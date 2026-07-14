/** Public marketing routes baked to static HTML during `npm run build`. Keep in sync with `scripts/seoRoutes.mjs` and `App.tsx`. */
export const PRERENDER_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/book',
  '/start',
  '/guide',
  '/guide/foundation',
  '/guide/leadership',
  '/guide/understanding',
  '/guide/social',
  '/guide/training',
  '/guide/puppy-phase',
  '/guide/daily-life',
  '/exam',
  '/intelligence',
  '/dog-personality',
  '/breed-finder',
] as const;

export type PrerenderRoute = (typeof PRERENDER_ROUTES)[number];
