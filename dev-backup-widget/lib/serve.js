import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectProjectFiles } from './collect-files.js';
import { createProjectZipBuffer } from './zip.js';
import { pushFilesToBranch } from './github.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const widgetPath = path.join(__dirname, '..', 'widget', 'widget.js');

function parseArgs(argv) {
  let port = process.env.DEV_BACKUP_PORT
    ? Number(process.env.DEV_BACKUP_PORT, 10)
    : 37547;
  let projectRoot = process.env.DEV_BACKUP_PROJECT_ROOT || process.cwd();

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--port' && argv[i + 1]) {
      port = Number(argv[++i], 10);
    } else if (argv[i] === '--project-root' && argv[i + 1]) {
      projectRoot = path.resolve(argv[++i]);
    }
  }
  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    throw new Error('Invalid --port');
  }
  return { port, projectRoot: path.resolve(projectRoot) };
}

/**
 * file:// pages send Origin: "null" (literal). CORS requires echoing that value.
 * This tool only listens on 127.0.0.1 — still dev-only; prefer http://localhost for previews.
 */
function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (origin === 'null') return true;
  try {
    const u = new URL(origin);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    const host = u.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  } catch {
    return false;
  }
}

function corsHeaders(origin) {
  if (!origin) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
  }
  if (!isAllowedOrigin(origin)) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function parseRepo(str) {
  const s = String(str || '').trim();
  if (!s) return null;
  const parts = s.split('/').filter(Boolean);
  if (parts.length === 2) return { owner: parts[0], repo: parts[1] };
  return null;
}

function loadGithubConfig() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo =
    parseRepo(process.env.GITHUB_REPOSITORY) ||
    (process.env.GITHUB_OWNER && process.env.GITHUB_REPO
      ? { owner: process.env.GITHUB_OWNER, repo: process.env.GITHUB_REPO }
      : null);
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!token || !repo) return null;
  return { token, ...repo, branch };
}

export async function runServe(argv) {
  const { port, projectRoot } = parseArgs(argv);

  const server = http.createServer(async (req, res) => {
    const origin = req.headers.origin;
    const c = corsHeaders(origin);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, c);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json', ...c });
      res.end(JSON.stringify({ ok: true, projectRoot }));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/widget.js') {
      try {
        const body = await fs.readFile(widgetPath, 'utf8');
        res.writeHead(200, {
          'Content-Type': 'application/javascript; charset=utf-8',
          ...c,
        });
        res.end(body);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain', ...c });
        res.end(String(e.message));
      }
      return;
    }

    if (req.method === 'GET' && url.pathname === '/snapshot.zip') {
      try {
        const buf = await createProjectZipBuffer(projectRoot);
        res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="project-snapshot.zip"',
          ...c,
        });
        res.end(buf);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json', ...c });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
      return;
    }

    if (req.method === 'POST' && url.pathname === '/backup') {
      const gh = loadGithubConfig();
      if (!gh) {
        res.writeHead(503, { 'Content-Type': 'application/json', ...c });
        res.end(
          JSON.stringify({
            ok: false,
            error:
              'Missing GITHUB_TOKEN or GITHUB_REPOSITORY (owner/repo). Set env and restart serve.',
          })
        );
        return;
      }

      try {
        const files = await collectProjectFiles(projectRoot);
        if (files.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json', ...c });
          res.end(JSON.stringify({ ok: false, error: 'No files to back up (check .gitignore).' }));
          return;
        }
        const result = await pushFilesToBranch(gh, files);
        res.writeHead(200, { 'Content-Type': 'application/json', ...c });
        res.end(
          JSON.stringify({
            ok: true,
            message: 'Backup complete',
            ...result,
            fileCount: files.length,
          })
        );
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json', ...c });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain', ...c });
    res.end('Not found');
  });

  await new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => resolve());
    server.on('error', reject);
  });

  console.log(`dev-backup listening on http://127.0.0.1:${port}`);
  console.log(`  project root: ${projectRoot}`);
  console.log(`  widget:       http://127.0.0.1:${port}/widget.js`);
  console.log(`  POST backup:  http://127.0.0.1:${port}/backup`);
}
