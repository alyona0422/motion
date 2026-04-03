#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function usage(cmd) {
  console.log(`dev-backup — local backup daemon + embeddable widget

Usage:
  dev-backup serve [options]   Start HTTP server (backup API + widget script)
  dev-backup init [options]    Write example .dev-backup.env and HTML snippet

Options (serve):
  --port <n>       Port (default: env DEV_BACKUP_PORT or 37547)
  --project-root <path>  Project to back up (default: env DEV_BACKUP_PROJECT_ROOT or cwd)

Environment (serve / backup):
  GITHUB_TOKEN           Personal access token (repo scope)
  GITHUB_REPOSITORY      owner/repo
  GITHUB_BRANCH          Branch name (default: main)
  DEV_BACKUP_PROJECT_ROOT
  DEV_BACKUP_PORT
`);
  process.exit(cmd === 'help' || cmd === '-h' || cmd === '--help' ? 0 : 1);
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);

  if (!cmd || cmd === '-h' || cmd === '--help' || cmd === 'help') {
    usage(cmd);
  }

  if (cmd === 'serve') {
    const mod = await import('../lib/serve.js');
    await mod.runServe(rest);
    return;
  }

  if (cmd === 'init') {
    const mod = await import('../lib/init.js');
    const root = path.join(__dirname, '..');
    await mod.runInit(rest, root);
    process.exit(0);
  }

  console.error(`Unknown command: ${cmd}`);
  usage(cmd);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
