import { Link } from 'react-router-dom';
import { guideHref, guideModuleHref } from '@shared/guideHref';
import { PUPPY_PHASE_NAV_LINKS } from '../pages/guide-sections/GuideContentsNav';

interface ProblemFinderPuppyNavProps {
  onNavigate: () => void;
}

export default function ProblemFinderPuppyNav({ onNavigate }: ProblemFinderPuppyNavProps) {
  return (
    <div className="problem-finder-reading">
      <p className="problem-finder-reading-label">Puppy phase guide</p>
      <ul className="problem-finder-guide-links">
        {PUPPY_PHASE_NAV_LINKS.map((link) => (
          <li key={link.anchor}>
            <Link to={guideHref(link.anchor)} onClick={onNavigate}>
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to={guideModuleHref('puppy-phase')}
        className="problem-finder-tertiary"
        onClick={onNavigate}
      >
        Read full module →
      </Link>
    </div>
  );
}
