import { useEffect } from 'react';
import {
  SITE_GEO_LAT,
  SITE_GEO_LNG,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_REGION_LABEL,
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

function applyFavicons(iconSet: IconSetId) {
  const links = faviconLinksForSet(iconSet);
  for (const { sizes, href } of links.icons) {
    setLink('icon', href, sizes);
  }
  setLink('apple-touch-icon', links.appleTouchIcon);
  setMeta('name', 'msapplication-TileImage', links.tileImage);
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

    document.title = title;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', index ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    setMeta('name', 'geo.region', 'NZ-TAS');
    setMeta('name', 'geo.placename', `${SITE_REGION_LABEL}, New Zealand`);
    setMeta('name', 'geo.position', `${SITE_GEO_LAT};${SITE_GEO_LNG}`);
    setLink('canonical', url);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', social);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', imageAlt);
    setMeta('property', 'og:site_name', SITE_NAME);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', social);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:image:alt', imageAlt);

    applyFavicons(iconSet);

    document.documentElement.dataset.seoReady = 'true';

    const previous = document.body.className;
    document.body.className = bodyClass ?? '';
    return () => {
      delete document.documentElement.dataset.seoReady;
      document.body.className = previous;
      applyFavicons('site');
      setMeta('property', 'og:image', SITE_OG_IMAGE);
      setMeta('property', 'og:image:alt', ICON_SETS.site.ogImageAlt);
      setMeta('name', 'twitter:image', SITE_OG_IMAGE);
      setMeta('name', 'twitter:image:alt', ICON_SETS.site.ogImageAlt);
    };
  }, [title, description, path, bodyClass, index, socialDescription, iconSet, ogImage, ogImageAlt]);

  return null;
}
