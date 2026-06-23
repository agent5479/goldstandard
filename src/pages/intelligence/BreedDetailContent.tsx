import { breedCategories } from '../../data/breeds';
import { findIntelligenceByBreedName } from '../../data/dogIntelligence';
import {
  AXES,
  findBreedByName,
  getBreedAxisProfile,
  getBreedClientMixTraitLabel,
  getBreedNeuroticismPropensityDetail,
  NEUROTICISM_VARIANT,
} from '../../data/breedTraits';

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
  /** stack = vertical (mobile sheet); columns = side-by-side panels (desktop hover) */
  layout?: 'stack' | 'columns';
}

function NeuroSection({
  neuroDetail,
  neuroScore,
  isEstimated,
}: {
  neuroDetail: ReturnType<typeof getBreedNeuroticismPropensityDetail>;
  neuroScore: number | undefined;
  isEstimated: boolean;
}) {
  if (!neuroDetail && neuroScore === undefined) return null;

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
  layout = 'stack',
}: BreedDetailContentProps) {
  const breed = resolveBreedForDetail(breedName, breedKeys);
  const intelligenceProfile = resolveIntelligenceProfile(breedName, breedKeys);
  const neuroDetail = breed ? getBreedNeuroticismPropensityDetail(breed.name) : undefined;
  const neuroScore = intelligenceProfile?.scores.neuro;
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

  if (layout === 'columns') {
    return (
      <div className="intelligence-breed-detail-columns">
        <section className="intelligence-breed-detail-panel">
          <h4 className="intelligence-breed-detail-panel-title">Overview</h4>
          <p className="intelligence-breed-detail-type">{getBreedClientMixTraitLabel(breed.name)}</p>
          <p className="intelligence-breed-detail-category">
            <strong>{category.label}</strong> — {category.note}
          </p>
        </section>
        <section className="intelligence-breed-detail-panel">
          <h4 className="intelligence-breed-detail-panel-title">Temperament axes</h4>
          <dl className="intelligence-breed-detail-table">
            {AXES.map((axis) => (
              <div className="intelligence-breed-detail-row" key={axis.key}>
                <dt>{axis.label}</dt>
                <dd>{getBreedAxisProfile(breed, axis.key)}</dd>
              </div>
            ))}
          </dl>
        </section>
        {(neuroDetail || neuroScore !== undefined) && (
          <section className="intelligence-breed-detail-panel">
            <NeuroSection
              neuroDetail={neuroDetail}
              neuroScore={neuroScore}
              isEstimated={isEstimated}
            />
          </section>
        )}
      </div>
    );
  }

  return (
    <>
      <p className="intelligence-breed-detail-type">{getBreedClientMixTraitLabel(breed.name)}</p>
      <p className="intelligence-breed-detail-category">
        <strong>{category.label}</strong> — {category.note}
      </p>
      <dl className="intelligence-breed-detail-table">
        {AXES.map((axis) => (
          <div className="intelligence-breed-detail-row" key={axis.key}>
            <dt>{axis.label}</dt>
            <dd>{getBreedAxisProfile(breed, axis.key)}</dd>
          </div>
        ))}
      </dl>
      <NeuroSection neuroDetail={neuroDetail} neuroScore={neuroScore} isEstimated={isEstimated} />
    </>
  );
}
