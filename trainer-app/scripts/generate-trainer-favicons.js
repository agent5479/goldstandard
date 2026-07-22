/**
 * Builds bordered trainer metadata icons from the public site dog favicons.
 * Output: trainer-app/public/favicon/dog{N}.jpg with a red frame for tab/PWA/tile distinction.
 * Skips regeneration when all outputs already exist (CI-friendly without sharp).
 */
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourceDir = join(__dirname, '..', 'public', 'images', 'icons');
const targetDir = join(__dirname, '..', 'public', 'favicon');
const SIZES = [16, 32, 48, 180, 192, 512];
const BORDER_RED = { r: 220, g: 53, b: 69 }; // #dc3545

function borderWidth(size) {
  return Math.max(2, Math.round(size * 0.125));
}

function allOutputsExist() {
  return SIZES.every((size) => existsSync(join(targetDir, `dog${size}.jpg`)));
}

async function generateIcon(size, sharp) {
  const sourcePath = join(sourceDir, `dog${size}.jpg`);
  if (!existsSync(sourcePath)) {
    console.error(`Missing source icon: ${sourcePath}`);
    process.exit(1);
  }

  const border = borderWidth(size);
  const inner = size - border * 2;
  const photo = await sharp(sourcePath)
    .resize(inner, inner, { fit: 'cover', position: 'centre' })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: BORDER_RED,
    },
  })
    .composite([{ input: photo, top: border, left: border }])
    .jpeg({ quality: 90 })
    .toFile(join(targetDir, `dog${size}.jpg`));
}

mkdirSync(targetDir, { recursive: true });

if (allOutputsExist()) {
  console.log(`Trainer favicons already present → ${targetDir}`);
  process.exit(0);
}

const { default: sharp } = await import('sharp');
for (const size of SIZES) {
  await generateIcon(size, sharp);
}

console.log(`Generated ${SIZES.length} bordered trainer icons → ${targetDir}`);
