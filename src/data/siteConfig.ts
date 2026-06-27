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
  'dog training Golden Bay, dog training Takaka, dog trainer Pohara, dog trainer Nelson Bays, dog trainer Motueka, dog trainer Richmond, Greater Tasman Region dog training, Tasman dog trainer, dog rehabilitation NZ, Beckman dog training NZ, Warwick Marshall dog training, obedience training Golden Bay, recall training Takaka, puppy training Nelson Bays, book dog training Golden Bay, elite dog coaching Tasman, dog breed intelligence, breed temperament comparison, Stanley Coren dog IQ, dog training knowledge exam NZ';

/** Default document / Open Graph title for the home page and static HTML shell. */
export const SITE_DEFAULT_TITLE =
  'Warwick Marshall | Dog Training Takaka & Golden Bay | Gold Standard Dog Training';

/** Core brand line — aligned with the Facebook page bio. */
export const SITE_TAGLINE =
  'Dog training, rehabilitation, and in-person coaching. Using proven, structured methods. Dogs find peace and freedom when they know their place and learn trust and obedience.';

/** Default meta description (plain text — no emoji for search snippets). */
export const SITE_META_DESCRIPTION =
  'Warwick Marshall — dog training and rehabilitation based in Takaka and Golden Bay, serving the wider Tasman region, NZ. Structured Beckman-method coaching with lasting results. Call 027 814 2222.';

/** Open Graph / Twitter preview — light emoji for link shares (Facebook, etc.). */
export const SITE_OG_DESCRIPTION =
  '🐕 Warwick Marshall — dog training in Golden Bay & the Tasman region · Gold Standard Dog Training · 027 814 2222';

export const SITE_OG_IMAGE = `${SITE_URL}/images/icons/dog1024.jpg`;

export function siteUrl(path = ''): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
