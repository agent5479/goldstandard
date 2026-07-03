/**
 * Validates guide anchor → module mapping against exam anchors and link patterns.
 * Run: npm run lint:guide
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANCHOR_TO_MODULE, GUIDE_MODULES } from '../shared/guideModules';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let errors = 0;

function fail(message: string) {
  console.error(`lint:guide ✗ ${message}`);
  errors += 1;
}

function pass(message: string) {
  console.log(`lint:guide ✓ ${message}`);
}

const anchorsFile = readFileSync(join(root, 'src/data/guideAnchors.ts'), 'utf8');
const examAnchors = [...anchorsFile.matchAll(/^\s+'([^']+)',/gm)].map((m) => m[1]);

for (const anchor of examAnchors) {
  if (!ANCHOR_TO_MODULE[anchor]) {
    fail(`GUIDE_EXAM_ANCHORS entry "${anchor}" is missing from ANCHOR_TO_MODULE`);
  }
}

pass(`${examAnchors.length} exam anchors mapped`);

const seen = new Map<string, string>();
for (const module of GUIDE_MODULES) {
  for (const anchor of module.anchors) {
    const existing = seen.get(anchor);
    if (existing) fail(`Anchor "${anchor}" assigned to both "${existing}" and "${module.id}"`);
    else seen.set(anchor, module.id);
  }
}

pass('No duplicate anchor assignments');

function walk(dir: string, exts: string[]): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') files.push(...walk(full, exts));
    else if (entry.isFile() && exts.some((ext) => entry.name.endsWith(ext))) files.push(full);
  }
  return files;
}

const legacyPattern = /\/guide#[\w-]+/;
const scanDirs = ['src', 'trainer-app/src'].map((d) => join(root, d));

for (const dir of scanDirs) {
  for (const file of walk(dir, ['.tsx', '.ts'])) {
    if (file.includes('auditGuideLinks')) continue;
    const content = readFileSync(file, 'utf8');
    if (legacyPattern.test(content)) {
      fail(`Legacy /guide# link in ${file.replace(root + '/', '').replace(root + '\\', '')}`);
    }
  }
}

pass('No legacy /guide# links in src or trainer-app/src');

if (errors > 0) {
  console.error(`\nlint:guide failed with ${errors} error(s)`);
  process.exit(1);
}

console.log('\nlint:guide passed');
