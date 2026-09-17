/**
 * Submit sitemap URLs to IndexNow (Bing and other participating engines).
 * The key file must already be live at /{key}.txt on the canonical host.
 * Run after deploy: `node scripts/submit-indexnow.mjs`
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_ROUTES, SITE_ORIGIN, absoluteUrl } from './seoRoutes.mjs';

const INDEXNOW_KEY = '3481b2c71f3849bd9d53fd46b812c1c4';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const host = new URL(SITE_ORIGIN).host;
const keyFile = join(root, 'public', `${INDEXNOW_KEY}.txt`);
const keyOnDisk = readFileSync(keyFile, 'utf8').trim();

if (keyOnDisk !== INDEXNOW_KEY) {
  console.error(`IndexNow key file mismatch: expected ${INDEXNOW_KEY} in ${keyFile}`);
  process.exit(1);
}

const keyLocation = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
const urlList = SEO_ROUTES.map((route) => absoluteUrl(route.path));

const payload = {
  host,
  key: INDEXNOW_KEY,
  keyLocation,
  urlList,
};

const response = await fetch(INDEXNOW_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

const bodyText = await response.text();
const status = response.status;

if (status === 200 || status === 202) {
  console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${status})`);
  process.exit(0);
}

if (status === 429 || status >= 500) {
  console.warn(`IndexNow temporary failure HTTP ${status}: ${bodyText || response.statusText}`);
  process.exit(0);
}

console.error(`IndexNow rejected submission HTTP ${status}: ${bodyText || response.statusText}`);
process.exit(1);
