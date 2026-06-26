import { breedCategories } from '../../data/breeds';
import { findIntelligenceByBreedName, type TraitSegment, VOCAL_HUE } from '../../data/dogIntelligence';
import {
  AXES,
  findBreedByName,
  getBreedAxisProfile,
  getBreedClientMixTraitLabel,
  getBreedNeuroticismPropensityDetail,
  NEUROTICISM_VARIANT,
} from '../../data/breedTraits';
import { getTraitIntensityStyle } from '../../utils/scoreSpectrum';

export function resolveBreedForDetail(breedName: string, breedKeys: string[] = []) {
  return (
    findBreedByName(breedName) ??
    breedKeys.map((key) => findBreedByName(key)).find(Boolean)
  );
}

function resolveIntelligenceProfile(breedName: string, breedKeys: string[] = []) {
  return (
    findIntelligenceByBreedName(breedName) ??
    breedKeys.map((key) => findIntelligenceByBreedName(key)).find(Boolean)
  );
}

interface BreedDetailContentProps {
  breedName: string;
  breedKeys?: string[];
  /** Compact summary for table hover tooltip */
  compact?: boolean;
}

function SegmentBreakdown({
  title,
  segments,
  totalScore,
}: {
  title: string;
  segments: TraitSegment[];
  totalScore: number;
}) {
  if (segments.length === 0) return null;

  return (
    <section className="intelligence-breed-detail-segments">
      <h4 className="intelligence-breed-detail-segments-title">{title}</h4>
      <p className="intelligence-breed-detail-segments-total">
        Overall estimate: <strong>{totalScore.toFixed(1)}/10</strong>
      </p>
      <ul className="intelligence-breed-detail-segment-list">
        {segments.map((seg) => (
          <li key={String(seg.key)} className="intelligence-breed-detail-segment-item">
            <span className="intelligence-breed-detail-segment-label">
              <span
                className="intelligence-breed-detail-segment-dot"
                style={{ background: getTraitIntensityStyle(seg.hue, seg.score).barFill }}
              />
              {seg.label}
              <span className="intelligence-breed-detail-segment-weight">
                ({Math.round(seg.weight * 100)}%)
              </span>
            </span>
            <span className="intelligence-breed-detail-segment-bar-wrap">
              <span
                className="intelligence-breed-detail-segment-bar"
                style={{
                  width: `${seg.score * 10}%`,
                  background: getTraitIntensityStyle(seg.hue, seg.score).barFill,
                }}
              />
              <span className="intelligence-breed-detail-segment-score">{seg.score.toFixed(1)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NeuroSection({
  neuroDetail,
  neuroScore,
  isEstimated,
  compact = false,
}: {
  neuroDetail: ReturnType<typeof getBreedNeuroticismPropensityDetail>;
  neuroScore: number | undefined;
  isEstimated: boolean;
  compact?: boolean;
}) {
  if (!neuroDetail && neuroScore === undefined) return null;

  if (compact) {
    return (
      <p className="intelligence-breed-detail-neuro-compact">
        {neuroDetail && (
          <span
            className={`intelligence-breed-detail-neuro-badge intelligence-breed-detail-neuro-badge--${NEUROTICISM_VARIANT[neuroDetail.level]}`}
          >
            {neuroDetail.label}
          </span>
        )}
        {neuroScore !== undefined && (
          <span className="intelligence-breed-detail-neuro-compact-score">
            {neuroDetail ? ' · ' : ''}
            Neuro {neuroScore.toFixed(1)}/10
            {isEstimated ? ' (est.)' : ''}
          </span>
        )}
      </p>
    );
  }

  return (
    <section className="intelligence-breed-detail-neuro">
      <h4 className="intelligence-breed-detail-neuro-title">Stress-looping propensity</h4>
      {neuroDetail && (
        <>
          <p className="intelligence-breed-detail-neuro-level">
            <span
              className={`intelligence-breed-detail-neuro-badge intelligence-breed-detail-neuro-badge--${NEUROTICISM_VARIANT[neuroDetail.level]}`}
            >
              {neuroDetail.label}
            </span>
            <span className="intelligence-breed-detail-neuro-level-label">inclination for this type</span>
          </p>
          <p className="intelligence-breed-detail-neuro-note">{neuroDetail.note}</p>
        </>
      )}
      {neuroScore !== undefined && (
        <p className="intelligence-breed-detail-neuro-score">
          Breed analysis estimate: <strong>{neuroScore.toFixed(1)}/10</strong> potential neuroticism
          {isEstimated ? ' (category-based)' : ''}.
        </p>
      )}
    </section>
  );
}

export default function BreedDetailContent({
  breedName,
  breedKeys = [],
  compact = false,
}: BreedDetailContentProps) {
  const breed = resolveBreedForDetail(breedName, breedKeys);
  const intelligenceProfile = resolveIntelligenceProfile(breedName, breedKeys);
  const neuroDetail = breed ? getBreedNeuroticismPropensityDetail(breed.name) : undefined;
  const neuroScore = intelligenceProfile?.scores.neuro;
  const vocalScore = intelligenceProfile?.scores.vocal;
  const isEstimated = intelligenceProfile?.source === 'estimated';

  if (!breed) {
    return (
      <>
        {neuroScore !== undefined && (
          <section className="intelligence-breed-detail-neuro">
            <h4 className="intelligence-breed-detail-neuro-title">Stress sensitivity (breed analysis)</h4>
            <p className="intelligence-breed-detail-neuro-note">
              Estimated score {neuroScore.toFixed(1)}/10 on the breed analysis table — type-level
              temperament notes are not available for this name.
            </p>
          </section>
        )}
        {!neuroScore && (
          <p className="intelligence-breed-detail-note">No temperament profile available for this breed.</p>
        )}
      </>
    );
  }

  const category = breedCategories[breed.category];

  return (
    <>
      <p className="intelligence-breed-detail-type">{getBreedClientMixTraitLabel(breed.name)}</p>
      <p className="intelligence-breed-detail-category">
        {compact ? (
          <strong>{category.label}</strong>
        ) : (
          <>
            <strong>{category.label}</strong> — {category.note}
          </>
        )}
      </p>
      {!compact && (
        <dl className="intelligence-breed-detail-table">
          {AXES.map((axis) => (
            <div className="intelligence-breed-detail-row" key={axis.key}>
              <dt>{axis.label}</dt>
              <dd>{getBreedAxisProfile(breed, axis.key)}</dd>
            </div>
          ))}
        </dl>
      )}
      {compact && (
        <dl className="intelligence-breed-detail-table intelligence-breed-detail-table--compact">
          {AXES.map((axis) => (
            <div className="intelligence-breed-detail-row" key={axis.key}>
              <dt>{axis.label.replace(/^[^\s]+\s/, '')}</dt>
              <dd>{getBreedAxisProfile(breed, axis.key)}</dd>
            </div>
          ))}
        </dl>
      )}
      <NeuroSection
        neuroDetail={neuroDetail}
        neuroScore={neuroScore}
        isEstimated={isEstimated}
        compact={compact}
      />
      {!compact && intelligenceProfile && (
        <>
          <SegmentBreakdown
            title="Instinct composition"
            segments={intelligenceProfile.instinctSegments}
            totalScore={intelligenceProfile.scores.inst}
          />
          <SegmentBreakdown
            title="Stress pattern composition"
            segments={intelligenceProfile.neuroSegments}
            totalScore={intelligenceProfile.scores.neuro}
          />
          {vocalScore !== undefined && (
            <p className="intelligence-breed-detail-vocal">
              Vocal tendency: <strong>{vocalScore.toFixed(1)}/10</strong>
              <span
                className="intelligence-breed-detail-segment-dot"
                style={{
                  background: getTraitIntensityStyle(VOCAL_HUE, vocalScore).barFill,
                  marginLeft: '0.35rem',
                }}
              />
            </p>
          )}
        </>
      )}
    </>
  );
}
