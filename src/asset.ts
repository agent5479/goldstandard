/** Prefix a public/ asset path with the configured base URL (/goldstandard/). */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path;
}
