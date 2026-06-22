import { useEffect } from 'react';
import { SITE_GEO_LAT, SITE_GEO_LNG, SITE_NAME, SITE_OG_IMAGE, SITE_REGION_LABEL, siteUrl } from '../data/siteConfig';

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

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Per-route document title, meta description, canonical, Open Graph, and body class. */
export default function Seo({
  title,
  description,
  path = '/',
  bodyClass,
  index = true,
  socialDescription,
}: SeoProps) {
  useEffect(() => {
    const url = siteUrl(path);
    const social = socialDescription ?? description;
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
    setMeta('property', 'og:image', SITE_OG_IMAGE);
    setMeta('property', 'og:site_name', SITE_NAME);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', social);
    setMeta('name', 'twitter:image', SITE_OG_IMAGE);

    const previous = document.body.className;
    document.body.className = bodyClass ?? '';
    return () => {
      document.body.className = previous;
    };
  }, [title, description, path, bodyClass, index, socialDescription]);

  return null;
}
