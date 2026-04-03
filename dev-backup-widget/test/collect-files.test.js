import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { collectProjectFiles } from '../lib/collect-files.js';

test('collectProjectFiles respects root .gitignore and excludes .git', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'dbu-'));
  await fs.writeFile(path.join(tmp, 'keep.txt'), 'a');
  await fs.writeFile(path.join(tmp, 'drop.log'), 'b');
  await fs.writeFile(path.join(tmp, '.gitignore'), '*.log\n');
  await fs.mkdir(path.join(tmp, '.git'));
  await fs.writeFile(path.join(tmp, '.git', 'HEAD'), 'ref: refs/heads/main');

  const files = await collectProjectFiles(tmp);
  const rels = files.map((f) => f.relPath).sort();
  assert.deepEqual(rels, ['.gitignore', 'keep.txt']);
});
