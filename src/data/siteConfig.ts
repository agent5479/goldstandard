import type { AreaSeoEntry, ServiceSeoEntry } from './localSeo';
import { SERVICE_SEO } from './localSeo';

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

/** Comma-separated keywords for the static HTML shell (highest-intent local terms first). */
export const SITE_KEYWORDS =
  'dog trainer Golden Bay, dog training Golden Bay, dog trainer Takaka, dog training Takaka, dog trainer Nelson Bays, dog training Nelson, puppy training Golden Bay, puppy training Takaka, obedience training Golden Bay, recall training Takaka, reactive dog training NZ, dog rehabilitation Golden Bay, leash training Golden Bay, Warwick Marshall dog training, dog trainer Pohara, dog trainer Motueka, dog trainer Richmond, Tasman dog trainer, Greater Tasman Region dog training, book dog training Golden Bay, elite dog coaching Tasman, dog breed intelligence, breed temperament comparison, Stanley Coren dog IQ, dog training knowledge exam NZ';

/** Default document / Open Graph title for the home page and static HTML shell. */
export const SITE_DEFAULT_TITLE =
  'Warwick Marshall | Dog Trainer Golden Bay & Takaka | Gold Standard Dog Training';

/** Core brand line — aligned with the Facebook page bio. */
export const SITE_TAGLINE =
  'Dog training, rehabilitation, and in-person coaching. Using proven, structured methods. Dogs find peace and freedom when they know their place and learn trust and obedience.';

/** Default meta description (plain text — no emoji for search snippets). */
export const SITE_META_DESCRIPTION =
  'Dog trainer in Golden Bay & Takaka — Warwick Marshall offers obedience, recall, puppy training, and rehabilitation across Nelson Bays and the Tasman region, NZ. Book in-person sessions. Call 027 814 2222.';

/** Open Graph / Twitter preview — light emoji for link shares (Facebook, etc.). */
export const SITE_OG_DESCRIPTION =
  '🌿 Dog trainer Golden Bay & Takaka · obedience, recall & rehab · Gold Standard Dog Training · 027 814 2222';

export const SITE_OG_IMAGE = `${SITE_URL}/images/icons/dog1024.jpg`;

export const SITE_PHONE = '+64278142222';
export const SITE_PHONE_DISPLAY = '027 814 2222';
export const SITE_EMAIL = 'warwick.marshall@gmail.com';
export const SITE_FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61580061262910';
export const SITE_LOCALE = 'en_NZ';

/**
 * Google Business Profile public URL — paste when available (included in sameAs).
 * Example: https://www.google.com/maps/place/?q=place_id:...
 */
export const SITE_GBP_URL = '';

/** Optional brand channels — set when live; empty strings are omitted from sameAs / footer. */
export const SITE_YOUTUBE_URL = '';
export const SITE_INSTAGRAM_URL = '';
export const SITE_NEWSLETTER_URL = '';

export function siteUrl(path = ''): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Profile URLs for schema sameAs and footer (Facebook always; others when set). */
export function buildSameAsUrls(): string[] {
  return [SITE_FACEBOOK_URL, SITE_GBP_URL, SITE_YOUTUBE_URL, SITE_INSTAGRAM_URL, SITE_NEWSLETTER_URL].filter(
    (url) => Boolean(url && url.trim())
  );
}

export interface SocialLink {
  label: string;
  href: string;
}

/** Footer / contact social links (only profiles with a URL). */
export function buildSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [{ label: 'Facebook', href: SITE_FACEBOOK_URL }];
  if (SITE_GBP_URL.trim()) links.push({ label: 'Google Business Profile', href: SITE_GBP_URL });
  if (SITE_YOUTUBE_URL.trim()) links.push({ label: 'YouTube', href: SITE_YOUTUBE_URL });
  if (SITE_INSTAGRAM_URL.trim()) links.push({ label: 'Instagram', href: SITE_INSTAGRAM_URL });
  if (SITE_NEWSLETTER_URL.trim()) links.push({ label: 'Newsletter', href: SITE_NEWSLETTER_URL });
  return links;
}

function offerCatalogFromServices() {
  return {
    '@type': 'OfferCatalog',
    name: 'Dog training services',
    itemListElement: SERVICE_SEO.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': `${SITE_URL}/services/${service.slug}#service`,
        name: service.schemaName,
        description: service.schemaDescription,
        url: `${SITE_URL}/services/${service.slug}`,
        provider: { '@id': `${SITE_URL}/#business` },
      },
    })),
  };
}

/** Structured data graph for the marketing site (home + entity). */
export function buildSiteJsonLd(): Record<string, unknown> {
  const sameAs = buildSameAsUrls();
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
        sameAs,
        hasOfferCatalog: offerCatalogFromServices(),
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
        sameAs,
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

function webPageNode(options: {
  title: string;
  description: string;
  path: string;
  about?: string;
  contentLocation?: string;
}): Record<string, unknown> {
  const url = siteUrl(options.path);
  const node: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: options.title,
    description: options.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': options.about ?? `${SITE_URL}/#business` },
    inLanguage: 'en-NZ',
  };
  if (options.contentLocation) {
    node.contentLocation = { '@id': options.contentLocation };
  }
  return node;
}

export function buildBreadcrumbJsonLd(options: {
  path: string;
  title: string;
  description: string;
  crumbs: { name: string; path: string }[];
}): Record<string, unknown> {
  const url = siteUrl(options.path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPageNode({
        title: options.title,
        description: options.description,
        path: options.path,
      }),
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: options.crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: siteUrl(crumb.path),
        })),
      },
    ],
  };
}

export function buildServicePageJsonLd(service: ServiceSeoEntry): Record<string, unknown> {
  const path = `/services/${service.slug}`;
  const url = siteUrl(path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPageNode({
        title: service.title,
        description: service.metaDescription,
        path,
        about: `${url}#service`,
      }),
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: service.schemaName,
        description: service.schemaDescription,
        url,
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: SITE_SERVICE_AREAS.map((name) => ({
          '@type': 'Place',
          name,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Services', item: siteUrl('/services') },
          { '@type': 'ListItem', position: 3, name: service.cardTitle, item: url },
        ],
      },
    ],
  };
}

export function buildAreaPageJsonLd(area: AreaSeoEntry): Record<string, unknown> {
  const path = `/areas/${area.slug}`;
  const url = siteUrl(path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPageNode({
        title: area.title,
        description: area.metaDescription,
        path,
        contentLocation: `${url}#place`,
      }),
      {
        '@type': 'Place',
        '@id': `${url}#place`,
        name: area.placeName,
        url,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Areas', item: siteUrl('/areas') },
          { '@type': 'ListItem', position: 3, name: area.name, item: url },
        ],
      },
    ],
  };
}

export interface SoftwareToolMeta {
  path: string;
  title: string;
  description: string;
  applicationName: string;
}

/** Free first-party tools — SoftwareApplication + WebPage for AI citation. */
export function buildSoftwareToolJsonLd(tool: SoftwareToolMeta): Record<string, unknown> {
  const url = siteUrl(tool.path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: tool.title,
        description: tool.description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${url}#app` },
        inLanguage: 'en-NZ',
      },
      {
        '@type': ['SoftwareApplication', 'WebApplication'],
        '@id': `${url}#app`,
        name: tool.applicationName,
        description: tool.description,
        url,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'NZD',
        },
        publisher: { '@id': `${SITE_URL}/#business` },
        isAccessibleForFree: true,
      },
    ],
  };
}
