import { Link } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import type { TraitSegment } from '../../data/dogIntelligence';
import { resolveTrainingLeverage } from '../../data/instinctTrainingLeverage';

export type TrainingLeverageVariant = 'purebred' | 'mix';

interface TrainingLeverageCardProps {
  segments: TraitSegment[];
  breedName?: string;
  variant?: TrainingLeverageVariant;
  title?: string;
}

export default function TrainingLeverageCard({
  segments,
  breedName,
  variant = 'purebred',
  title = 'Training leverage',
}: TrainingLeverageCardProps) {
  const blocks = resolveTrainingLeverage(segments, { breedName });

  if (blocks.length === 0) {
    return (
      <article className="intelligence-breed-detail-card">
        <h4 className="intelligence-breed-detail-card-title">🎯 {title}</h4>
        <div className="intelligence-breed-detail-card-body">
          <p className="intelligence-breed-detail-card-empty">
            No instinct breakdown — select a listed breed or use temperament category defaults.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="intelligence-breed-detail-card">
      <h4 className="intelligence-breed-detail-card-title">🎯 {title}</h4>
      <div className="intelligence-breed-detail-card-body">
        {variant === 'mix' && (
          <p className="intelligence-leverage-mix-caveat">
            <em>
              Likely leverage for this blend — probabilistic. Not every method below will fit your dog; treat
              the list as options to try against what you actually see, not a checklist to apply in full.
            </em>
          </p>
        )}

        {blocks.map((block) => (
          <div key={block.instinct} className="intelligence-leverage-block">
            <p className="intelligence-leverage-block-header">
              <span
                className="intelligence-breed-detail-segment-dot"
                style={{ background: block.hue }}
                aria-hidden
              />
              <strong>{block.label}</strong>
              <span className="intelligence-breed-detail-segment-weight">
                ({Math.round(block.weight * 100)}%)
              </span>
            </p>
            <p className="intelligence-leverage-headline">{block.headline}</p>
            <p className="intelligence-leverage-fixation">{block.fixationNote}</p>
            {block.breedNote && (
              <p className="intelligence-leverage-breed-note">
                <strong>Breed note:</strong> {block.breedNote}
              </p>
            )}
            <ul className="intelligence-leverage-methods">
              {block.methods.map((method) => (
                <li key={method.id}>
                  <strong>{method.title}</strong> — {method.summary}
                  {method.guideAnchors && method.guideAnchors.length > 0 && (
                    <span className="intelligence-leverage-method-links">
                      {' '}
                      {method.guideAnchors.map((anchor, index) => (
                        <span key={anchor}>
                          {index > 0 ? ' · ' : ''}
                          <Link to={guideHref(anchor)}>{anchor.replace(/-/g, ' ')}</Link>
                        </span>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="intelligence-leverage-footer">
          <Link to="/intelligence#instinct-training-leverage">Full instinct leverage reference</Link>
          {' · '}
          <Link to={guideHref('genetic-leverage')}>Genetic leverage (guide)</Link>
        </p>
      </div>
    </article>
  );
}
