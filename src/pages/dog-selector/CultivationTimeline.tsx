import { Link } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import type { ResolvedCultivationCheckpoint } from '../../data/nervousSystemCultivation';

export default function CultivationTimeline({
  checkpoints,
}: {
  checkpoints: ResolvedCultivationCheckpoint[];
}) {
  return (
    <div className="dog-selector-timeline">
      <h3>Nervous-system cultivation by age</h3>
      <p className="dog-selector-timeline-lead">
        Checkpoints inside the existing puppy stages — not a replacement for them. The universal
        structure does not change; the volume of the hand and the job overlay do.{' '}
        <Link to={guideHref('breed-age-intensity')}>Age × temperament</Link>
      </p>
      <ol className="dog-selector-timeline-list">
        {checkpoints.map((row) => (
          <li key={row.meta.id} className="dog-selector-timeline-item">
            <header>
              <p className="dog-selector-timeline-age">{row.meta.ageLabel}</p>
              <h4>
                {row.stage.label}{' '}
                <span className="dog-selector-timeline-stage">{row.stage.ageRangeLabel}</span>
              </h4>
            </header>
            {row.divergence && <p className="dog-selector-timeline-divergence">{row.divergence}</p>}
            <div className="dog-selector-timeline-cols">
              <div>
                <h5>Observed</h5>
                <ul>
                  {row.observed.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5>Cultivate</h5>
                <ul>
                  {row.cultivate.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5>Defer</h5>
                <ul>
                  {row.defer.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            {row.roleOverlay && (
              <div className="dog-selector-timeline-role">
                <h5>This job at {row.meta.ageLabel}</h5>
                <p>
                  <strong>Cultivate:</strong> {row.roleOverlay.cultivate.join(' ')}
                </p>
                <p>
                  <strong>Defer:</strong> {row.roleOverlay.defer.join(' ')}
                </p>
              </div>
            )}
            {row.categoryNotes.some((note) => note.puppy || note.adolescent) && (
              <ul className="dog-selector-timeline-category">
                {row.categoryNotes.map((note) => {
                  const text = note.puppy ?? note.adolescent;
                  if (!text) return null;
                  return (
                    <li key={note.category}>
                      <strong>{note.label}:</strong> {text}
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="dog-selector-timeline-links">
              {row.guideAnchors.map((anchor, index) => (
                <span key={anchor}>
                  {index > 0 ? ' · ' : ''}
                  <Link to={guideHref(anchor)}>{anchor.replace(/-/g, ' ')}</Link>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
