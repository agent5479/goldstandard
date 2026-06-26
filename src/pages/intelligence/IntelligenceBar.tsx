import {
  INTELLIGENCE_DIMENSIONS,
  DOM_HUE,
  isTraitTypedDimension,
  NEURO_HUE,
  PROT_HUE,
  type IntelligenceDimension,
  type TraitSegment,
  VOCAL_HUE,
} from '../../data/dogIntelligence';
import {
  getScoreRangeSpectrumStyle,
  getScoreSpectrumStyle,
  getSegmentCellStyle,
  getTraitIntensityStyle,
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
  if (mode === 'segments' && segments.length > 0) {
    const totalScore = value ?? 0;
    const barWidth = totalScore * 10;

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
                  background: getTraitIntensityStyle(seg.hue, seg.score).barFill,
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

  if (mode === 'range' && low !== undefined && high !== undefined) {
    const spectrum = getScoreRangeSpectrumStyle(low, high);
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
    const spectrum = getTraitIntensityStyle(hue, val);
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

  const spectrum = getScoreSpectrumStyle(val);
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

export function getScoreCellStyle(value: number): { backgroundColor: string } {
  return { backgroundColor: getScoreSpectrumStyle(value).cellBackground };
}

export function getScoreRangeCellStyle(low: number, high: number): { backgroundColor: string } {
  return { backgroundColor: getScoreRangeSpectrumStyle(low, high).cellBackground };
}

export { getSegmentCellStyle };

export function getDimensionCellStyle(
  dimension: IntelligenceDimension,
  value: number
): { backgroundColor: string } {
  if (isTraitTypedDimension(dimension)) {
    const hue = dimensionHue(dimension);
    return { backgroundColor: getTraitIntensityStyle(hue, value).cellBackground };
  }
  return getScoreCellStyle(value);
}
