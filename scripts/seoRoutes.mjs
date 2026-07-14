/**
 * Single source of truth for public crawl routes (sitemap + prerender).
 * Keep `src/data/prerenderRoutes.ts` aligned with the `path` values here.
 */
export const SITE_ORIGIN = 'https://goldstandarddogtraining.nz';

/** @typedef {{ path: string; changefreq: string; priority: string }} SeoRoute */

/** @type {SeoRoute[]} */
export const SEO_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/book', changefreq: 'weekly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/guide', changefreq: 'monthly', priority: '0.7' },
  { path: '/guide/foundation', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/leadership', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/understanding', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/social', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/training', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/puppy-phase', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/daily-life', changefreq: 'monthly', priority: '0.6' },
  { path: '/exam', changefreq: 'monthly', priority: '0.6' },
  { path: '/intelligence', changefreq: 'monthly', priority: '0.6' },
  { path: '/dog-personality', changefreq: 'monthly', priority: '0.5' },
  { path: '/breed-finder', changefreq: 'monthly', priority: '0.5' },
];

export function absoluteUrl(path) {
  if (!path || path === '/') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
