/** Public marketing site — GitHub Pages base URL (no trailing slash). */
export const SITE_URL = 'https://agent5479.github.io/goldstandard';

export const SITE_NAME = 'Gold Standard Dog Training';

/** Primary town and region for geo meta and structured data. */
export const SITE_LOCALITY = 'Takaka';
export const SITE_ADDRESS_STREET = 'Rangihaeata';
export const SITE_ADDRESS_REGION = 'Golden Bay';
export const SITE_POSTAL_CODE = '7182';
export const SITE_COUNTRY = 'NZ';
export const SITE_GEO_LAT = -40.853;
export const SITE_GEO_LNG = 172.806;

/** Service area label used in titles and meta descriptions. */
export const SITE_REGION_LABEL = 'Golden Bay, Nelson Bays & Greater Tasman Region';

/** Towns and regions served — used in README, robots comments, and JSON-LD. */
export const SITE_SERVICE_AREAS = [
  'Golden Bay, New Zealand',
  'Takaka, New Zealand',
  'Pohara, New Zealand',
  'Nelson Bays, New Zealand',
  'Motueka, New Zealand',
  'Richmond, New Zealand',
  'Greater Tasman Region, New Zealand',
] as const;

/** Comma-separated keywords for the static HTML shell. */
export const SITE_KEYWORDS =
  'dog training Golden Bay, dog training Takaka, dog trainer Nelson Bays, dog trainer Motueka, Greater Tasman Region dog training, dog rehabilitation NZ, Beckman dog training NZ, Warwick Marshall dog training, book dog training Golden Bay, puppy training Takaka, obedience training Nelson';

/** Default document / Open Graph title for the home page and static HTML shell. */
export const SITE_DEFAULT_TITLE = `Gold Standard Dog Training | ${SITE_REGION_LABEL}`;

/** Core brand line — aligned with the Facebook page bio. */
export const SITE_TAGLINE =
  'Dog training, rehabilitation, and in-person coaching. Using proven, structured methods. Dogs find peace and freedom when they know their place and learn trust and obedience.';

/** Default meta description (plain text — no emoji for search snippets). */
export const SITE_META_DESCRIPTION = `${SITE_TAGLINE} ${SITE_REGION_LABEL}, NZ. Call Warwick: 027 814 2222.`;

/** Open Graph / Twitter preview — light emoji for link shares (Facebook, etc.). */
export const SITE_OG_DESCRIPTION = `🐕 ${SITE_TAGLINE} ${SITE_REGION_LABEL} · 027 814 2222`;

export const SITE_OG_IMAGE = `${SITE_URL}/images/dog1024.jpg`;

export function siteUrl(path = ''): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
