/**
 * Writes public/sitemap.xml from scripts/seoRoutes.mjs so Vite copies it into docs/.
 * Run via prebuild: `node scripts/generate-sitemap.mjs`
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_ROUTES, absoluteUrl } from './seoRoutes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outPath = join(root, 'public', 'sitemap.xml');

const lastmod = new Date().toISOString().slice(0, 10);

const urls = SEO_ROUTES.map(
  (route) => `  <url>
    <loc>${absoluteUrl(route.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(outPath, xml, 'utf8');
console.log(`Wrote ${outPath} (${SEO_ROUTES.length} URLs, lastmod ${lastmod})`);
