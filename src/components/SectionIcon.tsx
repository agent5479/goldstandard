import { iconAssetForSet, type IconSetId } from '../data/siteIcons';

type SectionIconSize = 'sm' | 'md' | 'lg' | 'card' | 'hero';

const SOURCE_SIZE: Record<SectionIconSize, number | 'hero'> = {
  sm: 48,
  md: 96,
  lg: 192,
  card: 192,
  hero: 'hero',
};

const DISPLAY_SIZE: Record<SectionIconSize, number> = {
  sm: 20,
  md: 40,
  lg: 72,
  card: 88,
  hero: 160,
};

interface SectionIconProps {
  set: IconSetId;
  size?: SectionIconSize;
  className?: string;
  alt?: string;
}

/** Section mascot icon at an appropriate source and display size. */
export default function SectionIcon({
  set,
  size = 'sm',
  className,
  alt = '',
}: SectionIconProps) {
  const display = DISPLAY_SIZE[size];
  const classes = ['section-icon', `section-icon--${size}`, className].filter(Boolean).join(' ');

  return (
    <img
      src={iconAssetForSet(set, SOURCE_SIZE[size])}
      alt={alt}
      className={classes}
      width={display}
      height={display}
      decoding="async"
    />
  );
}
