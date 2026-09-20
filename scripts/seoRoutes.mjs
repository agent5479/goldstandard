/**
 * Single source of truth for public crawl routes (sitemap + prerender).
 * Keep `src/data/prerenderRoutes.ts` aligned with the `path` values here.
 *
 * Legacy `/services/*` paths are prerendered separately (MovedPage) but omitted
 * from the sitemap — see LEGACY_PRERENDER_ROUTES.
 */
export const SITE_ORIGIN = 'https://goldstandarddogtraining.nz';

/** @typedef {{ path: string; changefreq: string; priority: string }} SeoRoute */

/** @type {SeoRoute[]} */
export const SEO_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/book', changefreq: 'weekly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/services', changefreq: 'monthly', priority: '0.85' },
  { path: '/obedience-training', changefreq: 'monthly', priority: '0.85' },
  { path: '/puppy-training', changefreq: 'monthly', priority: '0.85' },
  { path: '/leash-training', changefreq: 'monthly', priority: '0.85' },
  { path: '/recall-training', changefreq: 'monthly', priority: '0.85' },
  { path: '/dog-behaviour', changefreq: 'monthly', priority: '0.85' },
  { path: '/reactive-dog', changefreq: 'monthly', priority: '0.85' },
  { path: '/difficult-dogs', changefreq: 'monthly', priority: '0.8' },
  { path: '/owner-coaching', changefreq: 'monthly', priority: '0.75' },
  { path: '/problem-finder', changefreq: 'monthly', priority: '0.8' },
  { path: '/areas', changefreq: 'monthly', priority: '0.85' },
  { path: '/areas/golden-bay', changefreq: 'monthly', priority: '0.8' },
  { path: '/areas/takaka', changefreq: 'monthly', priority: '0.8' },
  { path: '/areas/pohara', changefreq: 'monthly', priority: '0.75' },
  { path: '/areas/nelson-bays', changefreq: 'monthly', priority: '0.75' },
  { path: '/areas/motueka', changefreq: 'monthly', priority: '0.75' },
  { path: '/areas/richmond', changefreq: 'monthly', priority: '0.75' },
  { path: '/guide', changefreq: 'monthly', priority: '0.7' },
  { path: '/guide/foundation', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/leadership', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/understanding', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/social', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/training', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/puppy-phase', changefreq: 'monthly', priority: '0.6' },
  { path: '/guide/daily-life', changefreq: 'monthly', priority: '0.6' },
  { path: '/exam', changefreq: 'monthly', priority: '0.55' },
  { path: '/intelligence', changefreq: 'monthly', priority: '0.55' },
  { path: '/dog-personality', changefreq: 'monthly', priority: '0.5' },
  { path: '/breed-finder', changefreq: 'monthly', priority: '0.5' },
  { path: '/dog-selector', changefreq: 'monthly', priority: '0.5' },
  { path: '/equipment', changefreq: 'monthly', priority: '0.55' },
];

/** Prerender only — soft redirects; never listed in sitemap.xml. */
export const LEGACY_PRERENDER_ROUTES = [
  '/services/everyday-obedience',
  '/services/puppy-training',
  '/services/leash-recall-control',
  '/services/home-manners',
  '/services/dog-social-calm',
  '/services/rehabilitation',
  '/services/owner-coaching',
];

export function absoluteUrl(path) {
  if (!path || path === '/') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
