import { SITE_URL } from './siteConfig';

export type IconSetId =
  | 'site'
  | 'exam'
  | 'guide'
  | 'breedanalysis'
  | 'problemfinder'
  | 'breedfinder'
  | 'personality';

export const ICONS_DIR = 'images/icons';

export interface IconSet {
  prefix: string;
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
}

const OG_DIR = 'images/og';
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export const ICON_SETS: Record<IconSetId, IconSet> = {
  site: {
    prefix: 'dog',
    ogImage: `${SITE_URL}/${OG_DIR}/site.jpg`,
    ogImageAlt:
      'Gold Standard Dog Training — dog training in Golden Bay & Tasman Region, New Zealand',
    ogImageWidth: OG_WIDTH,
    ogImageHeight: OG_HEIGHT,
  },
  exam: {
    prefix: 'graduated',
    ogImage: `${SITE_URL}/${OG_DIR}/exam.jpg`,
    ogImageAlt: 'Gold Standard Dog Training knowledge exam — graduated dog mascot',
    ogImageWidth: OG_WIDTH,
    ogImageHeight: OG_HEIGHT,
  },
  guide: {
    prefix: 'studyguide',
    ogImage: `${SITE_URL}/${OG_DIR}/guide.jpg`,
    ogImageAlt: 'Gold Standard Dog Training client reference guide',
    ogImageWidth: OG_WIDTH,
    ogImageHeight: OG_HEIGHT,
  },
  breedanalysis: {
    prefix: 'breedanalysis',
    ogImage: `${SITE_URL}/${OG_DIR}/breedanalysis.jpg`,
    ogImageAlt: 'Gold Standard Dog Training breed analysis reference',
    ogImageWidth: OG_WIDTH,
    ogImageHeight: OG_HEIGHT,
  },
  problemfinder: {
    prefix: 'wrong',
    ogImage: `${SITE_URL}/${OG_DIR}/problemfinder.jpg`,
    ogImageAlt: 'Gold Standard Dog Training Problem Finder tool',
    ogImageWidth: OG_WIDTH,
    ogImageHeight: OG_HEIGHT,
  },
  breedfinder: {
    prefix: 'right',
    ogImage: `${SITE_URL}/${OG_DIR}/breedfinder.jpg`,
    ogImageAlt: 'Gold Standard Dog Training — what dog should you get?',
    ogImageWidth: OG_WIDTH,
    ogImageHeight: OG_HEIGHT,
  },
  personality: {
    prefix: 'human',
    ogImage: `${SITE_URL}/${OG_DIR}/personality.jpg`,
    ogImageAlt: 'Gold Standard Dog Training — what kind of dog are you?',
    ogImageWidth: OG_WIDTH,
    ogImageHeight: OG_HEIGHT,
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
    icons: [
      // Root ICO — browsers/crawlers that request /favicon.ico by default.
      { sizes: 'any', href: `${base}favicon.ico` },
      ...FAVICON_SIZES.map((size) => ({
        sizes: `${size}x${size}`,
        href: base + iconPath(prefix, size),
      })),
    ],
    appleTouchIcon: base + iconPath(prefix, 180),
    tileImage: iconUrl(prefix, 192),
  };
}

/** Square mascot icons for the sticky header brand mark — always the 72px assets. */
export const HEADER_BRAND_ICON_PREFIXES = [
  'dog',
  'graduated',
  'human',
  'studyguide',
  'right',
  'wrong',
  'breedanalysis',
] as const;

export type HeaderBrandIconPrefix = (typeof HEADER_BRAND_ICON_PREFIXES)[number];

/** Asset URL for a header brand rotator frame (72px for all viewports). */
export function headerBrandIconAsset(prefix: HeaderBrandIconPrefix): string {
  return iconAsset(prefix, 72);
}

/** Fisher–Yates shuffle copy for a random rotator order per page load. */
export function shuffleHeaderBrandIcons(
  prefixes: readonly HeaderBrandIconPrefix[] = HEADER_BRAND_ICON_PREFIXES,
): HeaderBrandIconPrefix[] {
  const next = [...prefixes];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}


