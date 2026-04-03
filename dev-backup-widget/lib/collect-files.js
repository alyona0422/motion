import fs from 'node:fs/promises';
import path from 'node:path';
import ignore from 'ignore';

const DEFAULT_EXTRA_IGNORE = [
  '.git',
  '.git/**',
  '**/.git/**',
];

/**
 * @param {string} projectRoot absolute path
 * @returns {Promise<{ relPath: string, buffer: Buffer }[]>}
 */
export async function collectProjectFiles(projectRoot) {
  const root = path.resolve(projectRoot);
  const ig = ignore();
  for (const line of DEFAULT_EXTRA_IGNORE) {
    ig.add(line);
  }

  const gitignorePath = path.join(root, '.gitignore');
  try {
    const content = await fs.readFile(gitignorePath, 'utf8');
    ig.add(content);
  } catch {
    // no .gitignore
  }

  const files = [];
  await walk(root, root, ig, files);
  return files;
}

/**
 * @param {string} absDir
 * @param {string} root
 * @param {import('ignore').Ignore} ig
 * @param {{ relPath: string, buffer: Buffer }[]} out
 */
async function walk(absDir, root, ig, out) {
  let entries;
  try {
    entries = await fs.readdir(absDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const ent of entries) {
    const abs = path.join(absDir, ent.name);
    const rel = path.relative(root, abs).split(path.sep).join('/');
    if (rel === '') continue;

    if (ent.isDirectory()) {
      if (ig.ignores(rel + '/')) continue;
      await walk(abs, root, ig, out);
      continue;
    }

    if (!ent.isFile()) continue;
    if (ig.ignores(rel)) continue;

    const buffer = await fs.readFile(abs);
    out.push({ relPath: rel, buffer });
  }
}
