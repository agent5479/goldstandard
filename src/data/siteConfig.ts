/** Public marketing site — custom domain (no trailing slash). */
export const SITE_URL = 'https://goldstandarddogtraining.nz';

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
export const SITE_REGION_LABEL = 'Golden Bay & Tasman Region';

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
  'dog training Golden Bay, dog training Takaka, dog trainer Pohara, dog trainer Nelson Bays, dog trainer Motueka, dog trainer Richmond, Greater Tasman Region dog training, Tasman dog trainer, dog rehabilitation NZ, Warwick Marshall dog training, obedience training Golden Bay, recall training Takaka, puppy training Nelson Bays, book dog training Golden Bay, elite dog coaching Tasman, dog breed intelligence, breed temperament comparison, Stanley Coren dog IQ, dog training knowledge exam NZ';

/** Default document / Open Graph title for the home page and static HTML shell. */
export const SITE_DEFAULT_TITLE =
  'Warwick Marshall | Dog Training Golden Bay & Tasman Region | Gold Standard Dog Training';

/** Core brand line — aligned with the Facebook page bio. */
export const SITE_TAGLINE =
  'Dog training, rehabilitation, and in-person coaching. Using proven, structured methods. Dogs find peace and freedom when they know their place and learn trust and obedience.';

/** Default meta description (plain text — no emoji for search snippets). */
export const SITE_META_DESCRIPTION =
  'Warwick Marshall — dog training and rehabilitation in Golden Bay, serving the wider Tasman region, NZ. Structured, results-focused coaching and in-person session work. Call 027 814 2222.';

/** Open Graph / Twitter preview — light emoji for link shares (Facebook, etc.). */
export const SITE_OG_DESCRIPTION =
  '🌿 Dog training in Golden Bay & the Tasman region · Gold Standard Dog Training · 027 814 2222';

export const SITE_OG_IMAGE = `${SITE_URL}/images/icons/dog1024.jpg`;

export const SITE_PHONE = '+64278142222';
export const SITE_PHONE_DISPLAY = '027 814 2222';
export const SITE_EMAIL = 'warwick.marshall@gmail.com';
export const SITE_FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61580061262910';
export const SITE_LOCALE = 'en_NZ';

export function siteUrl(path = ''): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Structured data graph for the marketing site (home + entity). */
export function buildSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_META_DESCRIPTION,
        inLanguage: 'en-NZ',
        publisher: { '@id': `${SITE_URL}/#business` },
      },
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${SITE_URL}/#business`,
        name: SITE_NAME,
        alternateName: 'Warwick Marshall Dog Training',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/images/icons/dog512.jpg`,
        image: SITE_OG_IMAGE,
        description: SITE_META_DESCRIPTION,
        telephone: SITE_PHONE,
        email: SITE_EMAIL,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE_ADDRESS_STREET,
          addressLocality: SITE_LOCALITY,
          addressRegion: SITE_ADDRESS_REGION,
          postalCode: SITE_POSTAL_CODE,
          addressCountry: SITE_COUNTRY,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SITE_GEO_LAT,
          longitude: SITE_GEO_LNG,
        },
        areaServed: SITE_SERVICE_AREAS.map((name) => ({
          '@type': 'Place',
          name,
        })),
        founder: { '@id': `${SITE_URL}/#warwick` },
        sameAs: [SITE_FACEBOOK_URL],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Dog training services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Private dog training session',
                description: 'In-person obedience, recall, leash work, and owner coaching.',
                url: `${SITE_URL}/book`,
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Dog rehabilitation coaching',
                description: 'Structured rehabilitation for reactivity, anxiety, and difficult histories.',
                url: `${SITE_URL}/book`,
              },
            },
          ],
        },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#warwick`,
        name: 'Warwick Marshall',
        jobTitle: 'Dog Trainer',
        url: `${SITE_URL}/about`,
        worksFor: { '@id': `${SITE_URL}/#business` },
        telephone: SITE_PHONE,
        email: SITE_EMAIL,
        address: {
          '@type': 'PostalAddress',
          addressLocality: SITE_LOCALITY,
          addressRegion: SITE_ADDRESS_REGION,
          addressCountry: SITE_COUNTRY,
        },
        sameAs: [SITE_FACEBOOK_URL],
      },
    ],
  };
}

export function buildWebPageJsonLd(options: {
  title: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  const url = siteUrl(options.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: options.title,
    description: options.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#business` },
    inLanguage: 'en-NZ',
  };
}
