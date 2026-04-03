import fs from 'node:fs/promises';
import path from 'node:path';

const ENV_EXAMPLE = `# dev-backup-widget — do NOT commit this file with real tokens
GITHUB_TOKEN=ghp_xxxxxxxx
GITHUB_REPOSITORY=your-username/your-backup-repo
GITHUB_BRANCH=main

# Optional (defaults shown when omitted)
# DEV_BACKUP_PROJECT_ROOT=/absolute/path/to/project
# DEV_BACKUP_PORT=37547
`;

export async function runInit(argv, packageRoot) {
  const cwd = process.cwd();
  const target = path.join(cwd, '.dev-backup.env');
  try {
    await fs.access(target);
    console.error(`Refusing to overwrite existing ${target}`);
    process.exit(1);
  } catch {
    // ok
  }
  await fs.writeFile(target, ENV_EXAMPLE, 'utf8');
  const port = process.env.DEV_BACKUP_PORT || '37547';
  const snippet = `<!-- dev-backup-widget: add before </body> while developing -->
<script>
  window.__DEV_BACKUP__ = { apiOrigin: 'http://127.0.0.1:${port}' };
</script>
<script src="http://127.0.0.1:${port}/widget.js" defer></script>
`;

  const snippetPath = path.join(cwd, 'dev-backup-snippet.html');
  await fs.writeFile(snippetPath, snippet, 'utf8');

  console.log(`Wrote ${target}`);
  console.log(`Wrote ${snippetPath}`);
  console.log('');
  console.log('Next:');
  console.log(`  1. Fill in GITHUB_* in ${path.basename(target)}`);
  console.log('  2. Start server from your project root, loading env:');
  console.log('       export $(grep -v "^#" .dev-backup.env | xargs) && npx dev-backup serve');
  console.log('     (on Windows, set variables manually or use dotenv-cli)');
  console.log(`  3. Paste contents of ${path.basename(snippetPath)} into your HTML`);
}
