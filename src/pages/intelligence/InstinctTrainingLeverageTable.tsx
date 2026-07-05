import { Link } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import {
  formatLeverageInterrupts,
  resolveTrainingLeverage,
} from '../../data/instinctTrainingLeverage';
import { resolveIntelligenceProfile } from './BreedDetailContent';
import { useBreedDetailTip } from './BreedDetailTipRail';

export default function InstinctTrainingLeverageTable() {
  const breedTip = useBreedDetailTip();
  const detailBreed = breedTip?.detailBreed ?? null;

  if (!detailBreed) {
    return (
      <div className="intelligence-leverage-reference">
        <p className="intelligence-leverage-reference-empty">
          Open a breed in the table above — tick the row checkbox on desktop or tap the breed name on mobile —
          to see training methods matched to that breed&apos;s instinct breakdown.
        </p>
      </div>
    );
  }

  const intelligenceProfile = resolveIntelligenceProfile(
    detailBreed.breedName,
    detailBreed.breedKeys
  );
  const blocks = intelligenceProfile
    ? resolveTrainingLeverage(intelligenceProfile.instinctSegments, {
        breedName: detailBreed.breedName,
      })
    : [];

  if (blocks.length === 0) {
    return (
      <div className="intelligence-leverage-reference">
        <p className="intelligence-leverage-reference-intro">
          <strong>{detailBreed.breedName}</strong> — no instinct leverage profile for this drive breakdown.
        </p>
        <p className="intelligence-leverage-reference-empty">
          See the breed detail panel for temperament notes, or try another breed with a clearer Inst column bar.
        </p>
      </div>
    );
  }

  return (
    <div className="intelligence-leverage-reference">
      <p className="intelligence-leverage-reference-intro">
        Methods for <strong>{detailBreed.breedName}</strong> — matched to the Inst column bar. Blueprint
        options, not a substitute for reading the individual dog. See also{' '}
        <Link to={guideHref('genetic-leverage')}>Genetic leverage</Link> in the guide.
      </p>

      <div className="intelligence-leverage-grid" role="list">
        {blocks.map((block) => {
          const interrupts = formatLeverageInterrupts(block.methods);
          const guideAnchors = [
            ...new Set(block.methods.flatMap((m) => m.guideAnchors ?? [])),
          ];

          return (
            <article
              key={block.instinct}
              className="intelligence-leverage-card"
              role="listitem"
              aria-labelledby={`leverage-${block.instinct}-title`}
            >
              <header className="intelligence-leverage-card-header">
                <span
                  className="intelligence-breed-detail-segment-dot"
                  style={{ background: block.hue }}
                  aria-hidden
                />
                <h3 id={`leverage-${block.instinct}-title`} className="intelligence-leverage-card-title">
                  {block.label}
                </h3>
                <span className="intelligence-breed-detail-segment-weight">
                  ({Math.round(block.weight * 100)}%)
                </span>
              </header>

              <p className="intelligence-leverage-headline">{block.headline}</p>
              <p className="intelligence-leverage-fixation">{block.fixationNote}</p>
              {block.breedNote && (
                <p className="intelligence-leverage-breed-note">
                  <strong>Breed note:</strong> {block.breedNote}
                </p>
              )}

              <div className="intelligence-leverage-card-section">
                <h4 className="intelligence-leverage-card-section-title">Key methods</h4>
                <ul className="intelligence-leverage-methods">
                  {block.methods.map((method) => (
                    <li key={method.id}>
                      <strong>{method.title}</strong> — {method.summary}
                    </li>
                  ))}
                </ul>
              </div>

              {interrupts.length > 0 && (
                <div className="intelligence-leverage-card-section">
                  <h4 className="intelligence-leverage-card-section-title">Interrupts fixation on</h4>
                  <ul className="intelligence-leverage-interrupts">
                    {interrupts.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {guideAnchors.length > 0 && (
                <footer className="intelligence-leverage-card-links">
                  {guideAnchors.map((anchor, index) => (
                    <span key={anchor}>
                      {index > 0 ? ' · ' : ''}
                      <Link to={guideHref(anchor)}>{anchor.replace(/-/g, ' ')}</Link>
                    </span>
                  ))}
                </footer>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
