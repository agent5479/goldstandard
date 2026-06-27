import { SITE_URL } from './siteConfig';

export type IconSetId = 'site' | 'exam' | 'guide' | 'breedanalysis';

export const ICONS_DIR = 'images/icons';

export interface IconSet {
  prefix: string;
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
}

export const ICON_SETS: Record<IconSetId, IconSet> = {
  site: {
    prefix: 'dog',
    ogImage: `${SITE_URL}/${ICONS_DIR}/dog1024.jpg`,
    ogImageAlt:
      'Gold Standard Dog Training — dog training in Golden Bay & Tasman Region, New Zealand',
    ogImageWidth: 1024,
    ogImageHeight: 1024,
  },
  exam: {
    prefix: 'graduated',
    ogImage: `${SITE_URL}/${ICONS_DIR}/graduated.jpg`,
    ogImageAlt: 'Gold Standard Dog Training knowledge exam — graduated dog mascot',
    ogImageWidth: 965,
    ogImageHeight: 965,
  },
  guide: {
    prefix: 'studyguide',
    ogImage: `${SITE_URL}/${ICONS_DIR}/studyguide.jpg`,
    ogImageAlt: 'Gold Standard Dog Training client reference guide',
    ogImageWidth: 966,
    ogImageHeight: 966,
  },
  breedanalysis: {
    prefix: 'breedanalysis',
    ogImage: `${SITE_URL}/${ICONS_DIR}/breedanalysis.jpg`,
    ogImageAlt: 'Gold Standard Dog Training breed analysis reference',
    ogImageWidth: 937,
    ogImageHeight: 937,
  },
};

const FAVICON_SIZES = [16, 32, 48] as const;

/** Relative public path for a sized icon or hero image. */
export function iconPath(prefix: string, size: number | 'hero'): string {
  if (size === 'hero') return `${ICONS_DIR}/${prefix}.jpg`;
  return `${ICONS_DIR}/${prefix}${size}.jpg`;
}

/** Absolute URL for og:image and tile meta. */
export function iconUrl(prefix: string, size: number | 'hero'): string {
  return `${SITE_URL}/${iconPath(prefix, size)}`;
}

/** Prefixed with Vite base URL for in-page img src. */
export function iconAsset(prefix: string, size: number | 'hero'): string {
  return import.meta.env.BASE_URL + iconPath(prefix, size);
}

/** Icon asset for a named section set (exam, guide, breed analysis, or site). */
export function iconAssetForSet(set: IconSetId, size: number | 'hero'): string {
  return iconAsset(ICON_SETS[set].prefix, size);
}

export function faviconLinksForSet(iconSet: IconSetId): {
  icons: { sizes: string; href: string }[];
  appleTouchIcon: string;
  tileImage: string;
} {
  const { prefix } = ICON_SETS[iconSet];
  const base = import.meta.env.BASE_URL;
  return {
    icons: FAVICON_SIZES.map((size) => ({
      sizes: `${size}x${size}`,
      href: base + iconPath(prefix, size),
    })),
    appleTouchIcon: base + iconPath(prefix, 180),
    tileImage: iconUrl(prefix, 192),
  };
}
