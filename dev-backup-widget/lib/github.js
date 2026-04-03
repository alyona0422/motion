const API = 'https://api.github.com';

/** URL path after .../heads/ for branch (supports slashes in branch name). */
function branchPathSegments(branch) {
  return String(branch)
    .replace(/\\/g, '/')
    .split('/')
    .map(encodeURIComponent)
    .join('/');
}

/**
 * GitHub rejects Git Data API (blobs/trees) until the repo has at least one commit.
 * Contents API initializes an empty repo. See GitHub docs / git database guide.
 */
function contentsPutUrl(base, relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/');
  return `${base}/contents/${parts}`;
}

/**
 * @param {object} p
 * @param {string} p.auth
 * @param {string} p.base repos/{owner}/{repo}
 * @param {string} p.branch
 * @param {string} p.relPath
 * @param {Buffer} p.buffer
 * @param {string} p.message
 */
async function putContentsCreate({ auth, base, branch, relPath, buffer, message }) {
  const url = contentsPutUrl(base, relPath);
  const content = buffer.toString('base64');
  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: auth,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      message,
      content,
      branch,
    }),
  });
}

/**
 * Full snapshot: new commit tree contains exactly `files` (paths from project root).
 * @param {object} opts
 * @param {string} opts.token
 * @param {string} opts.owner
 * @param {string} opts.repo
 * @param {string} opts.branch
 * @param {{ relPath: string, buffer: Buffer }[]} files
 */
export async function pushFilesToBranch({ token, owner, repo, branch }, files) {
  const auth = `Bearer ${token}`;
  const base = `${API}/repos/${owner}/${repo}`;

  // GET uses git/ref (singular); PATCH update uses git/refs (plural). Same path 404s if mixed up.
  const getRefUrl = `${base}/git/ref/heads/${branchPathSegments(branch)}`;
  const updateRefUrl = `${base}/git/refs/heads/${branchPathSegments(branch)}`;
  let parentSha = null;

  const refRes = await fetch(getRefUrl, {
    headers: {
      Authorization: auth,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (refRes.ok) {
    const refData = await refRes.json();
    const commitSha = refData.object.sha;
    const commitRes = await fetch(`${base}/git/commits/${commitSha}`, {
      headers: {
        Authorization: auth,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!commitRes.ok) {
      const t = await commitRes.text();
      throw new Error(`GitHub commit fetch failed: ${commitRes.status} ${t}`);
    }
    const commitData = await commitRes.json();
    parentSha = commitData.sha;
  } else if (refRes.status === 404 || refRes.status === 409) {
    parentSha = null;
  } else {
    const t = await refRes.text();
    throw new Error(`GitHub ref fetch failed: ${refRes.status} ${t}`);
  }

  const maxFiles = 800;
  if (files.length > maxFiles) {
    throw new Error(
      `Too many files (${files.length}). Max ${maxFiles} for this MVP. Add patterns to .gitignore or split the project.`
    );
  }

  if (parentSha === null && files.length > 0) {
    const sorted = [...files].sort((a, b) => a.relPath.localeCompare(b.relPath));
    const first = sorted[0];
    const initMsg = `dev-backup: initialize empty repo (${first.relPath})`;
    const putRes = await putContentsCreate({
      auth,
      base,
      branch,
      relPath: first.relPath,
      buffer: first.buffer,
      message: initMsg,
    });
    if (!putRes.ok) {
      const t = await putRes.text();
      throw new Error(
        `GitHub cannot init empty repo via Contents API for ${first.relPath}: ${putRes.status} ${t}`
      );
    }
    const putData = await putRes.json();
    parentSha = putData.commit?.sha;
    if (!parentSha) {
      throw new Error('GitHub Contents API did not return commit.sha after init');
    }
  }

  const treeEntries = [];
  for (const f of files) {
    const content = f.buffer.toString('base64');

    const blobRes = await fetch(`${base}/git/blobs`, {
      method: 'POST',
      headers: {
        Authorization: auth,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ content, encoding: 'base64' }),
    });
    if (!blobRes.ok) {
      const t = await blobRes.text();
      throw new Error(`GitHub blob failed for ${f.relPath}: ${blobRes.status} ${t}`);
    }
    const blob = await blobRes.json();
    treeEntries.push({
      path: f.relPath.replace(/\\/g, '/'),
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    });
  }

  const treeRes = await fetch(`${base}/git/trees`, {
    method: 'POST',
    headers: {
      Authorization: auth,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ tree: treeEntries }),
  });

  if (!treeRes.ok) {
    const t = await treeRes.text();
    throw new Error(`GitHub tree failed: ${treeRes.status} ${t}`);
  }
  const treeData = await treeRes.json();

  const commitRes = await fetch(`${base}/git/commits`, {
    method: 'POST',
    headers: {
      Authorization: auth,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      message: `dev-backup: snapshot ${new Date().toISOString()}`,
      tree: treeData.sha,
      parents: parentSha ? [parentSha] : [],
    }),
  });
  if (!commitRes.ok) {
    const t = await commitRes.text();
    throw new Error(`GitHub commit create failed: ${commitRes.status} ${t}`);
  }
  const commit = await commitRes.json();

  if (parentSha) {
    const updateRes = await fetch(updateRefUrl, {
      method: 'PATCH',
      headers: {
        Authorization: auth,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ sha: commit.sha }),
    });
    if (!updateRes.ok) {
      const t = await updateRes.text();
      throw new Error(`GitHub ref update failed: ${updateRes.status} ${t}`);
    }
  } else {
    const createRefRes = await fetch(`${base}/git/refs`, {
      method: 'POST',
      headers: {
        Authorization: auth,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }),
    });
    if (!createRefRes.ok) {
      const t = await createRefRes.text();
      throw new Error(`GitHub ref create failed: ${createRefRes.status} ${t}`);
    }
  }

  return { commitSha: commit.sha, branch, owner, repo };
}
