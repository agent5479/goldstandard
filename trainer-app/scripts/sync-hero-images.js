/**
 * Copies hero gallery images from the public site into trainer-app/public/images
 * so the trainer app can serve them on Firebase Hosting.
 */
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');
const sourceDir = join(repoRoot, 'public', 'images');
const targetDir = join(__dirname, '..', 'public', 'images');

if (!existsSync(sourceDir)) {
  console.error(`Source images not found: ${sourceDir}`);
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });
console.log(`Synced hero images → ${targetDir}`);
