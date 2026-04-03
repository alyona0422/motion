import archiver from 'archiver';
import { collectProjectFiles } from './collect-files.js';

/**
 * @param {string} projectRoot
 * @returns {Promise<Buffer>}
 */
export async function createProjectZipBuffer(projectRoot) {
  const files = await collectProjectFiles(projectRoot);
  return new Promise((resolve, reject) => {
    const chunks = [];
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', reject);
    archive.on('data', (c) => chunks.push(c));
    archive.on('end', () => resolve(Buffer.concat(chunks)));

    for (const f of files) {
      archive.append(f.buffer, { name: f.relPath });
    }
    archive.finalize();
  });
}
