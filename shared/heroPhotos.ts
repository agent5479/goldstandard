export interface HeroPhoto {
  thumb: string;
  full: string;
  alt: string;
  label: string;
  eager?: boolean;
  highPriority?: boolean;
}

export const HERO_PHOTOS: HeroPhoto[] = [
  {
    thumb: 'images/thumbs/dogs2.jpg',
    full: 'images/dogs2.jpg',
    alt: 'Dog in training',
    label: 'dog in training',
    eager: true,
    highPriority: true,
  },
  {
    thumb: 'images/thumbs/mortyschnauzerpuppy.jpg',
    full: 'images/mortyschnauzerpuppy.jpg',
    alt: 'Morty',
    label: 'Morty',
    eager: true,
  },
  {
    thumb: 'images/thumbs/montyschnoodlepuppy.jpg',
    full: 'images/montyschnoodlepuppy.jpg',
    alt: 'Monty',
    label: 'Monty',
    eager: true,
  },
  {
    thumb: 'images/thumbs/montyspoodle.jpg',
    full: 'images/montyspoodle.jpg',
    alt: 'Monty',
    label: 'Monty',
  },
  {
    thumb: 'images/thumbs/neocollieold.jpg',
    full: 'images/neocollieold.jpg',
    alt: 'Neo',
    label: 'Neo',
    eager: true,
  },
  {
    thumb: 'images/thumbs/archiegolden.jpg',
    full: 'images/archiegolden.jpg',
    alt: 'Archie',
    label: 'Archie',
  },
  {
    thumb: 'images/thumbs/tillycollie.jpg',
    full: 'images/tillycollie.jpg',
    alt: 'Tilly',
    label: 'Tilly',
  },
  {
    thumb: 'images/thumbs/nuggetbigschnoodle.jpg',
    full: 'images/nuggetbigschnoodle.jpg',
    alt: 'Nugget',
    label: 'Nugget',
  },
  {
    thumb: 'images/thumbs/cosmochihuahuapuppy.jpg',
    full: 'images/cosmochihuahuapuppy.jpg',
    alt: 'Cosmo',
    label: 'Cosmo',
  },
  {
    thumb: 'images/thumbs/stormstaffypuppy.jpg',
    full: 'images/stormstaffypuppy.jpg',
    alt: 'Storm',
    label: 'Storm',
  },
  {
    thumb: 'images/thumbs/sassocollierottweiler.jpg',
    full: 'images/sassocollierottweiler.jpg',
    alt: 'Sasso',
    label: 'Sasso',
  },
  {
    thumb: 'images/thumbs/tussockGWHP.jpg',
    full: 'images/tussockGWHP.jpg',
    alt: 'Tussock',
    label: 'Tussock',
  },
];

export function findHeroPhoto(fullPath: string | undefined): HeroPhoto | undefined {
  if (!fullPath) return undefined;
  return HERO_PHOTOS.find((photo) => photo.full === fullPath);
}

export function heroPhotoSrc(path: string, baseUrl = '/'): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${base}${path.replace(/^\//, '')}`;
}
