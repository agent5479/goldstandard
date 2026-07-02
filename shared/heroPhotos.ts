import { HERO_PHOTOS as generatedHeroPhotos } from './heroPhotos.data';

export interface HeroPhoto {
  thumb: string;
  full: string;
  alt: string;
  label: string;
  eager?: boolean;
  highPriority?: boolean;
}

export const HERO_PHOTOS: HeroPhoto[] = [...generatedHeroPhotos];

export function findHeroPhoto(fullPath: string | undefined): HeroPhoto | undefined {
  if (!fullPath) return undefined;
  return HERO_PHOTOS.find((photo) => photo.full === fullPath);
}

export function heroPhotoSrc(path: string, baseUrl = '/'): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${base}${path.replace(/^\//, '')}`;
}
