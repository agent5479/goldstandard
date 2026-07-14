import { useEffect } from 'react';
import {
  SITE_GEO_LAT,
  SITE_GEO_LNG,
  SITE_LOCALE,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_REGION_LABEL,
  buildSiteJsonLd,
  buildWebPageJsonLd,
  siteUrl,
} from '../data/siteConfig';
import {
  faviconLinksForSet,
  ICON_SETS,
  type IconSetId,
} from '../data/siteIcons';

interface SeoProps {
  title: string;
  description: string;
  /** Route path for canonical / Open Graph URL, e.g. `/guide`. */
  path?: string;
  /** Body class for page-specific CSS (e.g. page-home, page-guide). */
  bodyClass?: string;
  /** When false, adds noindex (rare — e.g. draft pages). Defaults to true. */
  index?: boolean;
  /** Open Graph / Twitter text; defaults to `description`. Use for emoji social previews on the home page. */
  socialDescription?: string;
  /** Favicon and default OG image set for this route. */
  iconSet?: IconSetId;
  /** Override Open Graph / Twitter image URL. */
  ogImage?: string;
  /** Override Open Graph / Twitter image alt text. */
  ogImageAlt?: string;
}

const SITE_JSON_LD_ID = 'gsdt-site-jsonld';
const PAGE_JSON_LD_ID = 'gsdt-page-jsonld';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, sizes?: string) {
  const selector = sizes
    ? `link[rel="${rel}"][sizes="${sizes}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (sizes) el.sizes = sizes;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function applyFavicons(iconSet: IconSetId) {
  const links = faviconLinksForSet(iconSet);
  for (const { sizes, href } of links.icons) {
    setLink('icon', href, sizes);
  }
  setLink('apple-touch-icon', links.appleTouchIcon);
  setMeta('name', 'msapplication-TileImage', links.tileImage);
}

function applySocialImage(set: (typeof ICON_SETS)[IconSetId], image: string, imageAlt: string) {
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:image:secure_url', image);
  setMeta('property', 'og:image:type', 'image/jpeg');
  setMeta('property', 'og:image:width', String(set.ogImageWidth));
  setMeta('property', 'og:image:height', String(set.ogImageHeight));
  setMeta('property', 'og:image:alt', imageAlt);
  setMeta('name', 'twitter:image', image);
  setMeta('name', 'twitter:image:alt', imageAlt);
}

/** Per-route document title, meta description, canonical, Open Graph, and body class. */
export default function Seo({
  title,
  description,
  path = '/',
  bodyClass,
  index = true,
  socialDescription,
  iconSet = 'site',
  ogImage,
  ogImageAlt,
}: SeoProps) {
  useEffect(() => {
    const url = siteUrl(path);
    const social = socialDescription ?? description;
    const set = ICON_SETS[iconSet];
    const image = ogImage ?? set.ogImage;
    const imageAlt = ogImageAlt ?? set.ogImageAlt;
    const isHome = !path || path === '/';

    document.title = title;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', index ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    setMeta('name', 'geo.region', 'NZ-TAS');
    setMeta('name', 'geo.placename', `${SITE_REGION_LABEL}, New Zealand`);
    setMeta('name', 'geo.position', `${SITE_GEO_LAT};${SITE_GEO_LNG}`);
    setMeta('name', 'ICBM', `${SITE_GEO_LAT}, ${SITE_GEO_LNG}`);
    setLink('canonical', url);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', social);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:locale', SITE_LOCALE);
    applySocialImage(set, image, imageAlt);
    setMeta('property', 'og:site_name', SITE_NAME);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', social);

    applyFavicons(iconSet);

    setJsonLd(SITE_JSON_LD_ID, buildSiteJsonLd());
    if (index && !isHome) {
      setJsonLd(PAGE_JSON_LD_ID, buildWebPageJsonLd({ title, description, path }));
    } else {
      document.getElementById(PAGE_JSON_LD_ID)?.remove();
    }

    document.documentElement.dataset.seoReady = 'true';

    const previous = document.body.className;
    document.body.className = bodyClass ?? '';
    return () => {
      delete document.documentElement.dataset.seoReady;
      document.body.className = previous;
      applyFavicons('site');
      applySocialImage(ICON_SETS.site, SITE_OG_IMAGE, ICON_SETS.site.ogImageAlt);
    };
  }, [title, description, path, bodyClass, index, socialDescription, iconSet, ogImage, ogImageAlt]);

  return null;
}
