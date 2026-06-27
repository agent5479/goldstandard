import {
  COGNITIVE_DIMENSIONS,
  DOM_HUE,
  INSTINCT_SUBTYPE_META,
  INTELLIGENCE_DIMENSIONS,
  INTELLIGENCE_SCORE_FLOORS,
  NEURO_HUE,
  NEURO_PATTERN_META,
  PROT_HUE,
  scoreBoundsFor,
  VOCAL_HUE,
  type DogIntelligenceProfile,
  type InstinctSubtype,
  type IntelligenceDimension,
  type NeuroPattern,
} from '../../data/dogIntelligence';
import { COGNITIVE_GREEN_HUE, getTraitIntensityStyle } from '../../utils/scoreSpectrum';
import IntelligenceFilterBadge from './IntelligenceFilterBadge';

export type InstinctFilterKey = `inst:${InstinctSubtype}`;
export type NeuroFilterKey = `neuro:${NeuroPattern}`;
export type DimensionFilterKey = `dim:${IntelligenceDimension}`;
export type TableFilterKey = InstinctFilterKey | NeuroFilterKey | DimensionFilterKey;

const SEGMENT_FILTER_MIN_WEIGHT = 0.08;
const BEHAVIORAL_SCORE_MIN = 6;
const COGNITIVE_SCORE_MIN = 7;

export function matchesTableFilters(
  profile: DogIntelligenceProfile,
  filters: Set<TableFilterKey>
): boolean {
  if (filters.size === 0) return true;

  for (const filter of filters) {
    if (filter.startsWith('inst:')) {
      const key = filter.slice(5) as InstinctSubtype;
      if (
        profile.instinctSegments.some((seg) => seg.key === key && seg.weight >= SEGMENT_FILTER_MIN_WEIGHT)
      ) {
        return true;
      }
      continue;
    }

    if (filter.startsWith('neuro:')) {
      const key = filter.slice(6) as NeuroPattern;
      if (profile.neuroSegments.some((seg) => seg.key === key && seg.weight >= SEGMENT_FILTER_MIN_WEIGHT)) {
        return true;
      }
      continue;
    }

    if (filter.startsWith('dim:')) {
      const key = filter.slice(4) as IntelligenceDimension;
      const score = profile.scores[key];
      const min =
        key === 'iq' || key === 'adapt' || key === 'work' || key === 'ei' || key === 'si'
          ? COGNITIVE_SCORE_MIN
          : BEHAVIORAL_SCORE_MIN;
      if (score >= min) return true;
    }
  }

  return false;
}

export function toggleTableFilter(
  filters: Set<TableFilterKey>,
  key: TableFilterKey
): Set<TableFilterKey> {
  const next = new Set(filters);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

interface IntelligenceTableFiltersProps {
  activeFilters: Set<TableFilterKey>;
  onToggle: (key: TableFilterKey) => void;
  onClear: () => void;
}

function buildIntensityScores(floor: number): number[] {
  const span = 10 - floor;
  if (span <= 0) return [10, floor];
  const midHigh = Math.round((floor + span * 0.75) * 10) / 10;
  const mid = Math.round((floor + span * 0.5) * 10) / 10;
  const midLow = Math.round((floor + span * 0.25) * 10) / 10;
  return [10, midHigh, mid, midLow, floor];
}

export default function IntelligenceTableFilters({
  activeFilters,
  onToggle,
  onClear,
}: IntelligenceTableFiltersProps) {
  const cognitiveDims = INTELLIGENCE_DIMENSIONS.filter((d) =>
    COGNITIVE_DIMENSIONS.includes(d.key)
  );
  const iqFloor = INTELLIGENCE_SCORE_FLOORS.iq;
  const intensityScores = buildIntensityScores(iqFloor);
  const iqBounds = scoreBoundsFor('iq');

  return (
    <div className="intelligence-table-filters">
      <div className="intelligence-table-filters-header">
        <span className="intelligence-table-filters-title">Filter by type</span>
        {activeFilters.size > 0 && (
          <button type="button" className="intelligence-clear-btn" onClick={onClear}>
            Clear filters ({activeFilters.size})
          </button>
        )}
      </div>

      <div className="intelligence-filter-intensity" aria-label="Score intensity scale">
        <span className="intelligence-filter-group-label">Intensity</span>
        <div className="intelligence-legend-intensity">
          {intensityScores.map((score) => (
            <div className="intelligence-legend-intensity-item" key={score}>
              <div
                className="intelligence-legend-dot intelligence-legend-dot--intensity"
                style={{
                  background: getTraitIntensityStyle(COGNITIVE_GREEN_HUE, score, iqBounds).barFill,
                }}
              />
              <span className="intelligence-legend-intensity-score">{score}</span>
            </div>
          ))}
          <span className="intelligence-legend-intensity-hint">10 = vivid · column min = none</span>
        </div>
      </div>

      <div className="intelligence-filter-group">
        <span className="intelligence-filter-group-label">Instinct types</span>
        <div className="intelligence-filter-badges" role="group" aria-label="Instinct type filters">
          {INSTINCT_SUBTYPE_META.map((meta) => {
            const key = `inst:${meta.key}` as TableFilterKey;
            return (
              <IntelligenceFilterBadge
                key={meta.key}
                label={meta.label}
                color={meta.hue}
                description={meta.description}
                active={activeFilters.has(key)}
                onToggle={() => onToggle(key)}
              />
            );
          })}
        </div>
      </div>

      <div className="intelligence-filter-group">
        <span className="intelligence-filter-group-label">Stress patterns</span>
        <div className="intelligence-filter-badges" role="group" aria-label="Stress pattern filters">
          {NEURO_PATTERN_META.map((meta) => {
            const key = `neuro:${meta.key}` as TableFilterKey;
            return (
              <IntelligenceFilterBadge
                key={meta.key}
                label={meta.label}
                color={meta.hue}
                description={meta.description}
                active={activeFilters.has(key)}
                onToggle={() => onToggle(key)}
              />
            );
          })}
        </div>
      </div>

      <div className="intelligence-filter-group">
        <span className="intelligence-filter-group-label">Columns</span>
        <div className="intelligence-filter-badges" role="group" aria-label="Column filters">
          <IntelligenceFilterBadge
            label="Vocal"
            color={VOCAL_HUE}
            description="Breeds with notable vocal output (score ≥ 6)."
            active={activeFilters.has('dim:vocal')}
            onToggle={() => onToggle('dim:vocal')}
          />
          <IntelligenceFilterBadge
            label="Dominance"
            color={DOM_HUE}
            description="Breeds with notable assertive or rank-seeking tendency (score ≥ 6)."
            active={activeFilters.has('dim:dom')}
            onToggle={() => onToggle('dim:dom')}
          />
          <IntelligenceFilterBadge
            label="Protectiveness"
            color={PROT_HUE}
            description="Breeds with notable guarding drive (score ≥ 6)."
            active={activeFilters.has('dim:prot')}
            onToggle={() => onToggle('dim:prot')}
          />
          <IntelligenceFilterBadge
            label="Neuroticism"
            color={NEURO_HUE}
            description="Breeds with elevated stress-looping propensity (score ≥ 6)."
            active={activeFilters.has('dim:neuro')}
            onToggle={() => onToggle('dim:neuro')}
          />
          {cognitiveDims.map((dim) => {
            const key = `dim:${dim.key}` as TableFilterKey;
            return (
              <IntelligenceFilterBadge
                key={dim.key}
                label={dim.shortLabel}
                color={COGNITIVE_GREEN_HUE}
                description={`${dim.description} Shows breeds scoring ≥ 7.`}
                active={activeFilters.has(key)}
                onToggle={() => onToggle(key)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
