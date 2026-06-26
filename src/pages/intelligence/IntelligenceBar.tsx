import {
  INTELLIGENCE_DIMENSIONS,
  DOM_HUE,
  isTraitTypedDimension,
  NEURO_HUE,
  PROT_HUE,
  scoreBoundsFor,
  type IntelligenceDimension,
  type TraitSegment,
  VOCAL_HUE,
} from '../../data/dogIntelligence';
import {
  getScoreRangeSpectrumStyle,
  getScoreSpectrumStyle,
  getSegmentCellStyle,
  getTraitIntensityStyle,
  type ScoreIntensityBounds,
} from '../../utils/scoreSpectrum';

interface IntelligenceBarProps {
  value?: number;
  low?: number;
  high?: number;
  mode?: 'single' | 'range' | 'segments';
  segments?: TraitSegment[];
  dimension?: IntelligenceDimension;
}

function dimensionHue(key: IntelligenceDimension): string {
  if (key === 'vocal') return VOCAL_HUE;
  if (key === 'dom') return DOM_HUE;
  if (key === 'prot') return PROT_HUE;
  if (key === 'neuro') return NEURO_HUE;
  return INTELLIGENCE_DIMENSIONS.find((d) => d.key === key)?.color ?? '#888888';
}

function boundsFor(dimension: IntelligenceDimension): ScoreIntensityBounds {
  return scoreBoundsFor(dimension);
}

function buildSegmentAriaLabel(segments: TraitSegment[], totalScore: number): string {
  const parts = segments.map(
    (s) => `${s.label} ${(s.weight * 100).toFixed(0)}% at ${s.score.toFixed(1)}`
  );
  return `Score ${totalScore.toFixed(1)}: ${parts.join('; ')}`;
}

export default function IntelligenceBar({
  value,
  low,
  high,
  mode = 'single',
  segments = [],
  dimension,
}: IntelligenceBarProps) {
  if (mode === 'segments' && segments.length > 0 && dimension) {
    const totalScore = value ?? 0;
    const barWidth = totalScore * 10;
    const bounds = boundsFor(dimension);

    return (
      <div
        className="intelligence-bar-wrap intelligence-bar-wrap--stacked intelligence-bar-wrap--segments"
        aria-label={buildSegmentAriaLabel(segments, totalScore)}
      >
        <div className="intelligence-bar-bg">
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
        <span className="intelligence-bar-label">{totalScore.toFixed(1)}</span>
      </div>
    );
  }

  if (mode === 'range' && low !== undefined && high !== undefined && dimension) {
    const bounds = boundsFor(dimension);
    const spectrum = getScoreRangeSpectrumStyle(low, high, bounds);
    const width = Math.max(0, (high - low) * 10);
    const left = low * 10;
    return (
      <div className="intelligence-bar-wrap">
        <div className="intelligence-bar-bg">
          <div
            className="intelligence-bar-range"
            style={{
              left: `${left}%`,
              width: `${width}%`,
              background: spectrum.barRangeGradient ?? spectrum.barFill,
            }}
          />
        </div>
        <span className="intelligence-bar-label">
          {low.toFixed(1)}–{high.toFixed(1)}
        </span>
      </div>
    );
  }

  const val = value ?? 0;

  if (dimension && isTraitTypedDimension(dimension)) {
    const hue = dimensionHue(dimension);
    const bounds = boundsFor(dimension);
    const spectrum = getTraitIntensityStyle(hue, val, bounds);
    return (
      <div className="intelligence-bar-wrap intelligence-bar-wrap--stacked">
        <div className="intelligence-bar-bg">
          <div
            className="intelligence-bar-fill"
            style={{ width: `${val * 10}%`, background: spectrum.barFill }}
          />
        </div>
        <span className="intelligence-bar-label">{val.toFixed(1)}</span>
      </div>
    );
  }

  const cognitiveBounds = dimension ? boundsFor(dimension) : undefined;
  const spectrum = getScoreSpectrumStyle(val, cognitiveBounds);
  return (
    <div className="intelligence-bar-wrap intelligence-bar-wrap--stacked">
      <div className="intelligence-bar-bg">
        <div
          className="intelligence-bar-fill"
          style={{ width: `${val * 10}%`, background: spectrum.barFill }}
        />
      </div>
      <span className="intelligence-bar-label">{val.toFixed(1)}</span>
    </div>
  );
}

export function getScoreCellStyle(
  value: number,
  dimension: IntelligenceDimension
): { backgroundColor: string } {
  return {
    backgroundColor: getScoreSpectrumStyle(value, boundsFor(dimension)).cellBackground,
  };
}

export function getScoreRangeCellStyle(
  low: number,
  high: number,
  dimension: IntelligenceDimension
): { backgroundColor: string } {
  return {
    backgroundColor: getScoreRangeSpectrumStyle(low, high, boundsFor(dimension)).cellBackground,
  };
}

export function getSegmentCellStyleForDimension(
  segments: TraitSegment[],
  dimension: IntelligenceDimension
): { backgroundColor: string } {
  return getSegmentCellStyle(segments, boundsFor(dimension));
}

export function getDimensionCellStyle(
  dimension: IntelligenceDimension,
  value: number
): { backgroundColor: string } {
  if (isTraitTypedDimension(dimension)) {
    const hue = dimensionHue(dimension);
    return {
      backgroundColor: getTraitIntensityStyle(hue, value, boundsFor(dimension)).cellBackground,
    };
  }
  return getScoreCellStyle(value, dimension);
}
