/** Public marketing routes baked to static HTML during `npm run build`. Keep in sync with `App.tsx`. */
export const PRERENDER_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/book',
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
] as const;

export type PrerenderRoute = (typeof PRERENDER_ROUTES)[number];
