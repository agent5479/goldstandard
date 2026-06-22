/**
 * Post-build static prerender for GitHub Pages SEO.
 * Visits each public route in a headless browser and writes fully rendered HTML
 * (including per-route meta tags and page content) into docs/.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'docs');
const siteBase = '/goldstandard';

/** Keep in sync with src/data/prerenderRoutes.ts and App.tsx */
const routes = ['/', '/about', '/contact', '/book', '/guide', '/exam', '/intelligence'];

function routeToOutputFile(route) {
  if (route === '/') return join(outDir, 'index.html');
  return join(outDir, route.slice(1), 'index.html');
}

async function prerender() {
  console.log('Starting vite preview for prerender…');
  const previewServer = await preview({
    root,
    base: siteBase + '/',
    build: { outDir: 'docs' },
    preview: { port: 4173, strictPort: false },
  });

  const address = previewServer.resolvedUrls?.local?.[0];
  if (!address) {
    throw new Error('Could not resolve vite preview URL');
  }

  const previewOrigin = address.replace(/\/$/, '');
  console.log(`Preview server at ${previewOrigin}`);

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();

    for (const route of routes) {
      const url = route === '/' ? `${previewOrigin}/` : `${previewOrigin}${route}`;
      console.log(`Prerendering ${url}`);

      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.waitForSelector('html[data-seo-ready="true"]', { timeout: 30_000 });
      await page.waitForSelector('#root > *', { timeout: 30_000 });

      const html = await page.content();
      const outputFile = routeToOutputFile(route);
      mkdirSync(dirname(outputFile), { recursive: true });
      writeFileSync(outputFile, html, 'utf8');
      console.log(`  → ${outputFile.replace(root + '\\', '').replace(root + '/', '')}`);
    }
  } finally {
    await browser.close();
    await previewServer.close();
  }

  console.log(`Prerendered ${routes.length} routes into docs/`);
}

prerender().catch((error) => {
  console.error(error);
  process.exit(1);
});
