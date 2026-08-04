import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HEADER_BRAND_ICON_PREFIXES,
  headerBrandIconAsset,
} from '../data/siteIcons';

const ROTATE_MS = 4500;
const BRAND_NAME = 'Gold Standard Dog Training';

interface HeaderBrandMarkProps {
  className?: string;
  onClick?: () => void;
}

/**
 * Sticky-header home link: rotates square mascot icons from /images/icons,
 * reveals the site name on hover/focus, and navigates home on click.
 */
export default function HeaderBrandMark({
  className = 'site-header-brand',
  onClick,
}: HeaderBrandMarkProps) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || HEADER_BRAND_ICON_PREFIXES.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % HEADER_BRAND_ICON_PREFIXES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <Link
      to="/"
      className={className}
      onClick={onClick}
      aria-label={`${BRAND_NAME} home`}
    >
      <span className="site-header-brand-stage" aria-hidden="true">
        {HEADER_BRAND_ICON_PREFIXES.map((prefix, i) => (
          <img
            key={prefix}
            className={i === index ? 'is-active' : undefined}
            src={headerBrandIconAsset(prefix)}
            alt=""
            width={72}
            height={72}
            decoding="async"
          />
        ))}
      </span>
      <span className="site-header-brand-name">{BRAND_NAME}</span>
    </Link>
  );
}
