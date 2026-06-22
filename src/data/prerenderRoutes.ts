/** Public marketing routes baked to static HTML during `npm run build`. Keep in sync with `App.tsx`. */
export const PRERENDER_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/book',
  '/guide',
  '/exam',
] as const;

export type PrerenderRoute = (typeof PRERENDER_ROUTES)[number];
