/**
 * Generate the standard favicon / section icon size set from a master mascot JPEG.
 *
 * Usage:
 *   node scripts/generate-icon-sizes.mjs wrong right human
 *   node scripts/generate-icon-sizes.mjs   # all tool mascots missing sizes
 *
 * Master source: public/images/icons/{prefix}.jpg, else {prefix}512.jpg
 * Output sizes match existing site sets (dog, graduated, breedanalysis): 16–512 + hero .jpg
 */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'images', 'icons');

/** Keep in sync with sizes present for dog / graduated / breedanalysis. */
const ICON_SIZES = [16, 32, 48, 72, 96, 180, 192, 512];

const DEFAULT_PREFIXES = ['wrong', 'right', 'human'];

/**
 * @param {string} prefix
 * @returns {Promise<string>}
 */
async function resolveSourcePath(prefix) {
  const heroPath = join(iconsDir, `${prefix}.jpg`);
  if (existsSync(heroPath)) return heroPath;

  const largest = join(iconsDir, `${prefix}512.jpg`);
  if (existsSync(largest)) return largest;

  throw new Error(
    `No source for "${prefix}": add public/images/icons/${prefix}.jpg or ${prefix}512.jpg`
  );
}

/**
 * @param {string} prefix
 * @param {string} sourcePath
 */
async function generateIconSet(prefix, sourcePath) {
  const sourceBuffer = await sharp(sourcePath).toBuffer();
  const meta = await sharp(sourceBuffer).metadata();
  const heroPath = join(iconsDir, `${prefix}.jpg`);

  if (!existsSync(heroPath)) {
    await sharp(sourceBuffer)
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(heroPath);
    console.log(`  wrote ${prefix}.jpg (${meta.width}×${meta.height})`);
  }

  for (const size of ICON_SIZES) {
    const outPath = join(iconsDir, `${prefix}${size}.jpg`);
    await sharp(sourceBuffer)
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: size <= 48 ? 85 : 90, mozjpeg: true })
      .toFile(outPath);
    console.log(`  wrote ${prefix}${size}.jpg`);
  }
}

const prefixes = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_PREFIXES;

for (const prefix of prefixes) {
  console.log(`Generating icon set: ${prefix}`);
  const sourcePath = await resolveSourcePath(prefix);
  await generateIconSet(prefix, sourcePath);
}

console.log(`Done — ${prefixes.length} icon set(s) in public/images/icons/`);
