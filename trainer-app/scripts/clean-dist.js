import { existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}
