/**
 * Discovers hero gallery images in public/images/, generates missing thumbnails,
 * and writes shared/heroPhotos.data.ts for the public site and trainer app.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const imagesDir = join(repoRoot, 'public', 'images');
const thumbsDir = join(imagesDir, 'thumbs');
const manifestPath = join(repoRoot, 'shared', 'heroPhotos.manifest.json');
const outputPath = join(repoRoot, 'shared', 'heroPhotos.data.ts');

const THUMB_SIZE = 176;

/** @typedef {{ exclude?: string[], order?: string[], overrides?: Record<string, Partial<{ label: string, alt: string, eager: boolean, highPriority: boolean }>> }} HeroManifest */

/**
 * @param {string} filename
 * @returns {string}
 */
function stem(filename) {
  return basename(filename, extname(filename));
}

/**
 * Derive display name from filename.
 * camelCase: tussockGWHP → Tussock; compound lowercase: mortyschnauzerpuppy → Morty
 * @param {string} name
 * @returns {string}
 */
function labelFromFilename(name) {
  const camelMatch = name.match(/^([a-z]+)(?=[A-Z])/);
  if (camelMatch) {
    const word = camelMatch[1];
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const suffixes = [
    'collierottweiler',
    'blacklabadolescent',
    'welshterrierpuppy',
    'chihuahuapuppy',
    'cavoodlepuppy',
    'schnoodlepuppy',
    'schnauzerpuppy',
    'staffypuppy',
    'bigschnoodle',
    'collieold',
    'spoodle',
    'golden',
    'collie',
    'puppy',
    'poodle',
    'schnoodle',
  ].sort((a, b) => b.length - a.length);

  const lower = name.toLowerCase();
  for (const suffix of suffixes) {
    if (lower.endsWith(suffix) && lower.length > suffix.length) {
      const word = name.slice(0, -suffix.length);
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  }

  const match = name.match(/^([a-z]+)/i);
  if (!match) return name;
  const word = match[1];
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * @param {string} sourcePath
 * @param {string} thumbPath
 */
async function ensureThumb(sourcePath, thumbPath) {
  if (existsSync(thumbPath)) return;

  mkdirSync(dirname(thumbPath), { recursive: true });
  await sharp(sourcePath)
    .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(thumbPath);
  console.log(`  generated thumb → ${thumbPath.replace(repoRoot + '/', '').replace(repoRoot + '\\', '')}`);
}

/**
 * @param {HeroPhotoEntry} entry
 * @returns {string}
 */
function formatEntry(entry) {
  const lines = [
    `    thumb: '${entry.thumb}',`,
    `    full: '${entry.full}',`,
    `    alt: '${entry.alt.replace(/'/g, "\\'")}',`,
    `    label: '${entry.label.replace(/'/g, "\\'")}',`,
  ];
  if (entry.eager) lines.push('    eager: true,');
  if (entry.highPriority) lines.push('    highPriority: true,');
  return `  {\n${lines.join('\n')}\n  }`;
}

/**
 * @typedef {{ thumb: string, full: string, alt: string, label: string, eager?: boolean, highPriority?: boolean }} HeroPhotoEntry
 */

async function main() {
  if (!existsSync(imagesDir)) {
    console.error(`Images directory not found: ${imagesDir}`);
    process.exit(1);
  }

  /** @type {HeroManifest} */
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const exclude = new Set(manifest.exclude ?? []);
  const order = manifest.order ?? [];
  const overrides = manifest.overrides ?? {};

  const imageFiles = readdirSync(imagesDir)
    .filter((file) => extname(file).toLowerCase() === '.jpg')
    .map(stem)
    .filter((name) => !exclude.has(name));

  const ordered = [];
  const seen = new Set();

  for (const name of order) {
    if (imageFiles.includes(name) && !exclude.has(name)) {
      ordered.push(name);
      seen.add(name);
    }
  }

  const remaining = imageFiles.filter((name) => !seen.has(name)).sort();
  const allNames = [...ordered, ...remaining];

  if (allNames.length === 0) {
    console.error('No hero photos found in public/images/');
    process.exit(1);
  }

  console.log(`Syncing ${allNames.length} hero photo(s)…`);

  /** @type {HeroPhotoEntry[]} */
  const entries = [];

  for (const name of allNames) {
    const sourcePath = join(imagesDir, `${name}.jpg`);
    const thumbPath = join(thumbsDir, `${name}.jpg`);

    if (!existsSync(sourcePath)) {
      console.warn(`  skipping ${name}: source image missing`);
      continue;
    }

    await ensureThumb(sourcePath, thumbPath);

    const override = overrides[name] ?? {};
    const label = override.label ?? labelFromFilename(name);
    const alt = override.alt ?? label;
    const entry = {
      thumb: `images/thumbs/${name}.jpg`,
      full: `images/${name}.jpg`,
      alt,
      label,
    };

    if (override.eager) entry.eager = true;
    if (override.highPriority) entry.highPriority = true;

    entries.push(entry);
  }

  const output = `// Generated by scripts/sync-hero-photos.mjs — do not edit manually.

export const HERO_PHOTOS = [
${entries.map(formatEntry).join(',\n')},
] as const;
`;

  writeFileSync(outputPath, output, 'utf8');
  console.log(`Wrote ${outputPath.replace(repoRoot + '/', '').replace(repoRoot + '\\', '')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
