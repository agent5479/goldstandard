/**
 * Build root favicon.ico (16/32/48) and 1200×630 Open Graph JPEGs from mascot icons.
 *
 *   node scripts/generate-favicon-and-og.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const iconsDir = join(root, 'public', 'images', 'icons');
const ogDir = join(root, 'public', 'images', 'og');

const BRAND_BG = { r: 248, g: 245, b: 238 }; // #f8f5ee
const BRAND_GREEN = { r: 45, g: 74, b: 45 }; // #2d4a2d

/** Icon set prefix → OG filename stem (matches ICON_SETS in siteIcons.ts). */
const OG_SETS = [
  { prefix: 'dog', file: 'site', source: 'dog1024.jpg' },
  { prefix: 'graduated', file: 'exam', source: 'graduated.jpg' },
  { prefix: 'studyguide', file: 'guide', source: 'studyguide.jpg' },
  { prefix: 'breedanalysis', file: 'breedanalysis', source: 'breedanalysis.jpg' },
  { prefix: 'wrong', file: 'problemfinder', source: 'wrong.jpg' },
  { prefix: 'right', file: 'breedfinder', source: 'right.jpg' },
  { prefix: 'human', file: 'personality', source: 'human.jpg' },
];

/**
 * Pack PNG buffers into a multi-size ICO (BMP-in-ICO not used — PNG entries).
 * @param {Buffer[]} pngBuffers
 * @returns {Buffer}
 */
function encodeIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const entries = [];

  for (const png of pngBuffers) {
    const size = png.length;
    // Width/height in directory entry: 0 means 256; we only emit ≤48.
    const meta = { offset, size };
    entries.push(meta);
    offset += size;
  }

  const out = Buffer.alloc(offset);
  out.writeUInt16LE(0, 0); // reserved
  out.writeUInt16LE(1, 2); // type = icon
  out.writeUInt16LE(count, 4);

  let dirOffset = 6;
  for (let i = 0; i < count; i += 1) {
    const png = pngBuffers[i];
    // Infer pixel size from IHDR (bytes 16–23 of PNG after signature).
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    out.writeUInt8(width >= 256 ? 0 : width, dirOffset);
    out.writeUInt8(height >= 256 ? 0 : height, dirOffset + 1);
    out.writeUInt8(0, dirOffset + 2); // color palette
    out.writeUInt8(0, dirOffset + 3); // reserved
    out.writeUInt16LE(1, dirOffset + 4); // color planes
    out.writeUInt16LE(32, dirOffset + 6); // bits per pixel
    out.writeUInt32LE(entries[i].size, dirOffset + 8);
    out.writeUInt32LE(entries[i].offset, dirOffset + 12);
    png.copy(out, entries[i].offset);
    dirOffset += 16;
  }

  return out;
}

async function buildFaviconIco() {
  const sizes = [16, 32, 48];
  const pngs = [];
  for (const size of sizes) {
    const src = join(iconsDir, `dog${size}.jpg`);
    if (!existsSync(src)) {
      throw new Error(`Missing ${src} — run generate-icon-sizes first`);
    }
    const png = await sharp(src)
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer();
    pngs.push(png);
  }
  const ico = encodeIco(pngs);
  const outPath = join(root, 'public', 'favicon.ico');
  writeFileSync(outPath, ico);
  console.log(`wrote public/favicon.ico (${ico.length} bytes, sizes ${sizes.join('/')})`);
}

/**
 * Place a square mascot on a 1200×630 canvas with a soft green edge band.
 * @param {string} sourceName
 * @param {string} outFile
 */
async function buildOgImage(sourceName, outFile) {
  const srcPath = join(iconsDir, sourceName);
  if (!existsSync(srcPath)) {
    console.warn(`skip OG ${outFile}: missing ${sourceName}`);
    return;
  }

  const W = 1200;
  const H = 630;
  const mascotSize = 480;
  const left = Math.round((W - mascotSize) / 2);
  const top = Math.round((H - mascotSize) / 2);

  const mascot = await sharp(srcPath)
    .resize(mascotSize, mascotSize, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  // Soft vertical side panels in brand green for landscape link cards.
  const svg = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="rgb(${BRAND_BG.r},${BRAND_BG.g},${BRAND_BG.b})"/>
      <rect x="0" y="0" width="48" height="${H}" fill="rgb(${BRAND_GREEN.r},${BRAND_GREEN.g},${BRAND_GREEN.b})"/>
      <rect x="${W - 48}" y="0" width="48" height="${H}" fill="rgb(${BRAND_GREEN.r},${BRAND_GREEN.g},${BRAND_GREEN.b})"/>
    </svg>
  `);

  mkdirSync(ogDir, { recursive: true });
  const outPath = join(ogDir, outFile);
  await sharp(svg)
    .composite([{ input: mascot, left, top }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);
  console.log(`wrote public/images/og/${outFile} (1200×630)`);
}

await buildFaviconIco();
for (const set of OG_SETS) {
  await buildOgImage(set.source, `${set.file}.jpg`);
}
console.log('Done — favicon.ico + OG images');
