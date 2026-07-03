import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import { breedCategories } from '../../data/breeds';
import {
  findIntelligenceByBreedName,
  getNeuroPatternSignals,
  scoreBoundsFor,
  type NeuroPattern,
  type TraitSegment,
  VOCAL_HUE,
} from '../../data/dogIntelligence';
import {
  getRehabilitationPlaybook,
  REHABILITATION_PATH_LABELS,
} from '../../data/rehabilitationPlaybooks';
import { getSymptomsForPattern } from '../../data/symptomExpressions';
import {
  findBreedByName,
  getBreedAxisProfile,
  getBreedClientMixTraitLabel,
  getBreedNeuroticismPropensityDetail,
  getBreedSizeClass,
  getBreedSuggestedProfileTags,
  NEUROTICISM_LABELS,
  NEUROTICISM_VARIANT,
  type TraitAxis,
} from '../../data/breedTraits';
import {
  getBreedLifePhaseNotes,
  getBreedSensitivityDetail,
  getBreedSensitivitySummary,
} from '../../data/breedSensitivityResolvers';
import { SIZE_CLASS_META } from '../../data/breedSizeGrades';
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
  minLegendWeight = 0,
}: {
  segments: TraitSegment[];
  totalScore: number;
  dimension: 'inst' | 'neuro';
  showOverall?: boolean;
  /** Hide legend rows below this weight (e.g. 0.05 for stress card). */
  minLegendWeight?: number;
}) {
  if (segments.length === 0) {
    return <p className="intelligence-breed-detail-card-empty">No breakdown available.</p>;
  }

  const bounds = scoreBoundsFor(dimension);
  const barWidth = totalScore * 10;
  const legendSegments = [...segments]
    .filter((seg) => seg.weight >= minLegendWeight)
    .sort((a, b) => b.weight - a.weight);

  return (
    <>
      {showOverall && (
        <p className="intelligence-breed-detail-card-score">
          Overall: <strong>{totalScore.toFixed(1)}/10</strong>
        </p>
      )}
      <div
        className="intelligence-breed-detail-combo-bar"
        aria-label={segments
          .map((s) => `${s.label} ${(s.weight * 100).toFixed(0)}% at ${s.score.toFixed(1)}`)
          .join('; ')}
      >
        <div className="intelligence-bar-bg intelligence-breed-detail-combo-bar-bg">
          <div className="intelligence-bar-segments" style={{ width: `${barWidth}%` }}>
            {segments.map((seg) => (
              <div
                key={String(seg.key)}
                className="intelligence-bar-segment"
                style={{
                  flex: seg.weight,
                  background: getTraitIntensityStyle(seg.hue, seg.score, bounds).barFill,
                }}
                title={`${seg.label}: ${seg.score.toFixed(1)}`}
              />
            ))}
          </div>
        </div>
      </div>
      <ul className="intelligence-breed-detail-segment-legend">
        {legendSegments.map((seg) => (
          <li key={String(seg.key)} className="intelligence-breed-detail-segment-legend-item">
            <span
              className="intelligence-breed-detail-segment-dot"
              style={{ background: getTraitIntensityStyle(seg.hue, seg.score, bounds).barFill }}
            />
            <span className="intelligence-breed-detail-segment-legend-label">{seg.label}</span>
            <span className="intelligence-breed-detail-segment-weight">
              ({Math.round(seg.weight * 100)}%)
            </span>
            {Math.abs(seg.score - totalScore) > 0.05 && (
              <span className="intelligence-breed-detail-segment-legend-score">
                {seg.score.toFixed(1)}
              </span>
            )}
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
  breedName,
}: {
  segments: TraitSegment[];
  totalScore: number;
  neuroDetail: ReturnType<typeof getBreedNeuroticismPropensityDetail>;
  neuroScore: number | undefined;
  isEstimated: boolean;
  breedName?: string;
}) {
  const dominantPatterns = segments
    .filter((seg) => seg.weight >= 0.08)
    .map((seg) => seg.key as NeuroPattern);

  const seenSignals = new Set<string>();
  const expressionSignals = dominantPatterns.flatMap((pattern) =>
    getNeuroPatternSignals(pattern).filter((signal) => {
      const key = `${signal.guideAnchor}|${signal.label}`;
      if (seenSignals.has(key)) return false;
      seenSignals.add(key);
      return true;
    })
  );

  const suggestedTags = breedName ? getBreedSuggestedProfileTags(breedName) : [];
  const showLivingModeCallout =
    suggestedTags.includes('clingy') || suggestedTags.includes('anxious');

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
        <>
          <p className="intelligence-breed-detail-card-score">
            Table estimate: <strong>{neuroScore.toFixed(1)}/10</strong>
            {isEstimated ? ' (category-based)' : ''}
          </p>
          <p className="intelligence-breed-detail-neuro-baseline-hint">
            Baseline type-level propensity — the pattern bar below shows how stress tends to express.
            Handler-attuned breeds may present higher anxiety than this score when structure or warmth is
            inconsistent.
          </p>
        </>
      )}
      <SegmentCardContent
        segments={segments}
        totalScore={totalScore}
        dimension="neuro"
        showOverall={neuroScore === undefined}
        minLegendWeight={0.05}
      />
      {expressionSignals.length > 0 && (
        <div className="intelligence-breed-detail-expressions">
          <p className="intelligence-breed-detail-expressions-title">Typical stress expressions</p>
          <ul className="intelligence-breed-detail-expressions-list">
            {expressionSignals.map((signal) => (
              <li key={`${signal.guideAnchor}-${signal.label}`}>
                <Link to={guideHref(signal.guideAnchor.replace(/^#/, ''))}>{signal.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {dominantPatterns.length > 0 && (
        <div className="intelligence-breed-detail-expressions">
          <p className="intelligence-breed-detail-expressions-title">Rehabilitation approach</p>
          <p className="intelligence-breed-detail-neuro-baseline-hint">
            Confirm <Link to={guideHref('behavior-driver-calibration')}>drivers</Link> first — breed propensity
            is not the same as a confirmed stress loop.
          </p>
          <ul className="intelligence-breed-detail-expressions-list">
            {dominantPatterns.map((pattern) => {
              const playbook = getRehabilitationPlaybook(pattern);
              const symptoms = getSymptomsForPattern(pattern).slice(0, 3);
              return (
                <li key={pattern}>
                  <strong>{playbook.label}</strong>{' '}
                  <span className="intelligence-breed-detail-rehab-path">
                    ({REHABILITATION_PATH_LABELS[playbook.path]})
                  </span>
                  — {playbook.substitution.slice(0, 120)}
                  {playbook.substitution.length > 120 ? '…' : ''}{' '}
                  <Link to={guideHref(playbook.primaryGuideAnchor)}>Playbook →</Link>
                  {symptoms.length > 0 && (
                    <ul className="intelligence-breed-detail-symptom-hints">
                      {symptoms.map((s) => (
                        <li key={s.id}>
                          <Link to={guideHref(s.guideAnchor)}>{s.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {showLivingModeCallout && (
        <p className="intelligence-breed-detail-living-mode-hint">
          Velcro types: distinguish{' '}
          <Link to={guideHref('context-of-contact')}>training mode vs living mode</Link> contact — structure
          on outings, trust lean at rest.
        </p>
      )}
    </DetailCard>
  );
}

function SensitivitiesCard({ breedName }: { breedName: string }) {
  const summary = getBreedSensitivitySummary(breedName);
  const details = getBreedSensitivityDetail(breedName);

  return (
    <DetailCard title="🎚 Common sensitivities & triggers">
      <p className="intelligence-breed-detail-sensitivity-intro">{summary}</p>
      <p className="intelligence-breed-detail-neuro-baseline-hint">
        Adjunct to stress patterns above — what inputs commonly trigger or worsen loops. Individual upbringing
        varies.
      </p>
      <ul className="intelligence-breed-detail-sensitivity-list">
        {details.map((item) => (
          <li key={item.id} className="intelligence-breed-detail-sensitivity-item">
            <div className="intelligence-breed-detail-sensitivity-row">
              <span className="intelligence-breed-detail-sensitivity-label">{item.label}</span>
              <span
                className={`intelligence-breed-detail-neuro-badge intelligence-breed-detail-neuro-badge--${NEUROTICISM_VARIANT[item.level]}`}
              >
                {item.levelLabel ?? NEUROTICISM_LABELS[item.level]}
              </span>
            </div>
            {item.note && <p className="intelligence-breed-detail-sensitivity-note">{item.note}</p>}
            <p className="intelligence-breed-detail-sensitivity-links">
              {item.guideAnchors.map((anchor, index) => (
                <span key={anchor}>
                  {index > 0 ? ' · ' : ''}
                  <Link to={guideHref(anchor)}>Guide</Link>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </DetailCard>
  );
}

function LifePhaseCard({ breedName }: { breedName: string }) {
  const notes = getBreedLifePhaseNotes(breedName);

  return (
    <DetailCard title="🐶 Puppy & adolescent expectations">
      {notes.puppy && (
        <div className="intelligence-breed-detail-life-phase-block">
          <p className="intelligence-breed-detail-life-phase-label">Puppy (~8 weeks – 7 months)</p>
          <p>{notes.puppy}</p>
        </div>
      )}
      {notes.adolescent && (
        <div className="intelligence-breed-detail-life-phase-block">
          <p className="intelligence-breed-detail-life-phase-label">Adolescent (7 months – adult)</p>
          <p>{notes.adolescent}</p>
        </div>
      )}
      {notes.maturationNote && (
        <div className="intelligence-breed-detail-life-phase-block">
          <p className="intelligence-breed-detail-life-phase-label">Maturation</p>
          <p>{notes.maturationNote}</p>
        </div>
      )}
      <p className="intelligence-breed-detail-life-phase-guide">
        See also{' '}
        <Link to={guideHref('breed-age-intensity')}>age × temperament calibration</Link>,{' '}
        <Link to={guideHref('eight-week-separation')}>8-week separation</Link>, and{' '}
        <Link to={guideHref('i-dont-care')}>the adult standard from seven months</Link>.
      </p>
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
  const sizeLabel = SIZE_CLASS_META.find((m) => m.key === getBreedSizeClass(breed))?.label ?? '';

  return (
    <div className="intelligence-breed-detail-card-grid">
      <p className="intelligence-breed-detail-grid-meta">
        {getBreedClientMixTraitLabel(breed.name)} · <strong>{category.label}</strong>
        {sizeLabel ? ` · ${sizeLabel}` : ''} — {category.note}
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
        breedName={breed.name}
      />

      <SensitivitiesCard breedName={breed.name} />
      <LifePhaseCard breedName={breed.name} />

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
