import type { ReactNode } from 'react';
import { breedCategories } from '../../data/breeds';
import {
  findIntelligenceByBreedName,
  scoreBoundsFor,
  type TraitSegment,
  VOCAL_HUE,
} from '../../data/dogIntelligence';
import {
  findBreedByName,
  getBreedAxisProfile,
  getBreedClientMixTraitLabel,
  getBreedNeuroticismPropensityDetail,
  NEUROTICISM_VARIANT,
  type TraitAxis,
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
}

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="intelligence-breed-detail-card">
      <h4 className="intelligence-breed-detail-card-title">{title}</h4>
      <div className="intelligence-breed-detail-card-body">{children}</div>
    </article>
  );
}

function AxisCard({ breed, axis, title }: { breed: NonNullable<ReturnType<typeof resolveBreedForDetail>>; axis: TraitAxis; title: string }) {
  return (
    <DetailCard title={title}>
      <p>{getBreedAxisProfile(breed, axis)}</p>
    </DetailCard>
  );
}

function SegmentCardContent({
  segments,
  totalScore,
  dimension,
  showOverall = true,
}: {
  segments: TraitSegment[];
  totalScore: number;
  dimension: 'inst' | 'neuro';
  showOverall?: boolean;
}) {
  if (segments.length === 0) {
    return <p className="intelligence-breed-detail-card-empty">No breakdown available.</p>;
  }

  const bounds = scoreBoundsFor(dimension);

  return (
    <>
      {showOverall && (
        <p className="intelligence-breed-detail-card-score">
          Overall: <strong>{totalScore.toFixed(1)}/10</strong>
        </p>
      )}
      <ul className="intelligence-breed-detail-segment-list intelligence-breed-detail-segment-list--card">
        {segments.map((seg) => (
          <li key={String(seg.key)} className="intelligence-breed-detail-segment-item">
            <span className="intelligence-breed-detail-segment-label">
              <span
                className="intelligence-breed-detail-segment-dot"
                style={{ background: getTraitIntensityStyle(seg.hue, seg.score, bounds).barFill }}
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
                  background: getTraitIntensityStyle(seg.hue, seg.score, bounds).barFill,
                }}
              />
              <span className="intelligence-breed-detail-segment-score">{seg.score.toFixed(1)}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function StressCard({
  segments,
  totalScore,
  neuroDetail,
  neuroScore,
  isEstimated,
}: {
  segments: TraitSegment[];
  totalScore: number;
  neuroDetail: ReturnType<typeof getBreedNeuroticismPropensityDetail>;
  neuroScore: number | undefined;
  isEstimated: boolean;
}) {
  return (
    <DetailCard title="😵‍💫 Stress pattern composition and propensity">
      {neuroDetail && (
        <div className="intelligence-breed-detail-neuro-inline">
          <p className="intelligence-breed-detail-neuro-level">
            <span
              className={`intelligence-breed-detail-neuro-badge intelligence-breed-detail-neuro-badge--${NEUROTICISM_VARIANT[neuroDetail.level]}`}
            >
              {neuroDetail.label}
            </span>
          </p>
          <p className="intelligence-breed-detail-neuro-note">{neuroDetail.note}</p>
        </div>
      )}
      {neuroScore !== undefined && (
        <p className="intelligence-breed-detail-card-score">
          Table estimate: <strong>{neuroScore.toFixed(1)}/10</strong>
          {isEstimated ? ' (category-based)' : ''}
        </p>
      )}
      <SegmentCardContent
        segments={segments}
        totalScore={totalScore}
        dimension="neuro"
        showOverall={neuroScore === undefined}
      />
    </DetailCard>
  );
}

function VocalCard({ vocalScore }: { vocalScore: number }) {
  const bounds = scoreBoundsFor('vocal');
  const barFill = getTraitIntensityStyle(VOCAL_HUE, vocalScore, bounds).barFill;

  return (
    <DetailCard title="🗣 Vocal tendency">
      <p className="intelligence-breed-detail-card-score">
        Typical output: <strong>{vocalScore.toFixed(1)}/10</strong>
      </p>
      <span className="intelligence-breed-detail-vocal-bar-wrap">
        <span
          className="intelligence-breed-detail-segment-bar intelligence-breed-detail-vocal-bar"
          style={{ width: `${vocalScore * 10}%`, background: barFill }}
        />
        <span
          className="intelligence-breed-detail-segment-dot"
          style={{ background: barFill }}
        />
      </span>
      <p className="intelligence-breed-detail-vocal-hint">
        Alert barking, baying, yapping, or habitual noise for this type.
      </p>
    </DetailCard>
  );
}

function BreedDetailCardGrid({
  breedName,
  breedKeys,
}: {
  breedName: string;
  breedKeys: string[];
}) {
  const breed = resolveBreedForDetail(breedName, breedKeys);
  const intelligenceProfile = resolveIntelligenceProfile(breedName, breedKeys);
  const neuroDetail = breed ? getBreedNeuroticismPropensityDetail(breed.name) : undefined;
  const neuroScore = intelligenceProfile?.scores.neuro;
  const vocalScore = intelligenceProfile?.scores.vocal;
  const isEstimated = intelligenceProfile?.source === 'estimated';

  if (!breed) {
    return (
      <div className="intelligence-breed-detail-card-grid">
        {neuroScore !== undefined && (
          <DetailCard title="😵‍💫 Stress pattern composition and propensity">
            <p>
              Estimated score <strong>{neuroScore.toFixed(1)}/10</strong> on the breed analysis
              table — type-level temperament notes are not available for this name.
            </p>
          </DetailCard>
        )}
        {!neuroScore && (
          <p className="intelligence-breed-detail-note">No temperament profile available for this breed.</p>
        )}
      </div>
    );
  }

  const category = breedCategories[breed.category];

  return (
    <div className="intelligence-breed-detail-card-grid">
      <p className="intelligence-breed-detail-grid-meta">
        {getBreedClientMixTraitLabel(breed.name)} · <strong>{category.label}</strong> — {category.note}
      </p>

      <AxisCard breed={breed} axis="personality" title="🧠 Personality & drive" />
      <AxisCard breed={breed} axis="working" title="⚡ Working style & energy" />
      <AxisCard breed={breed} axis="physical" title="💪 Physical build & size" />

      {intelligenceProfile ? (
        <DetailCard title="🎯 Instinct composition">
          <SegmentCardContent
            segments={intelligenceProfile.instinctSegments}
            totalScore={intelligenceProfile.scores.inst}
            dimension="inst"
          />
        </DetailCard>
      ) : (
        <DetailCard title="🎯 Instinct composition">
          <p className="intelligence-breed-detail-card-empty">No instinct breakdown available.</p>
        </DetailCard>
      )}

      <StressCard
        segments={intelligenceProfile?.neuroSegments ?? []}
        totalScore={neuroScore ?? 0}
        neuroDetail={neuroDetail}
        neuroScore={neuroScore}
        isEstimated={isEstimated}
      />

      {vocalScore !== undefined ? (
        <VocalCard vocalScore={vocalScore} />
      ) : (
        <DetailCard title="🗣 Vocal tendency">
          <p className="intelligence-breed-detail-card-empty">No vocal estimate available.</p>
        </DetailCard>
      )}
    </div>
  );
}

export default function BreedDetailContent({
  breedName,
  breedKeys = [],
}: BreedDetailContentProps) {
  return <BreedDetailCardGrid breedName={breedName} breedKeys={breedKeys} />;
}
