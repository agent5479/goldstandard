import type { IntelligenceDimension } from '../../data/dogIntelligence';

interface IntelligenceBarProps {
  value?: number;
  low?: number;
  high?: number;
  color: string;
  mode?: 'single' | 'range';
}

export default function IntelligenceBar({
  value,
  low,
  high,
  color,
  mode = 'single',
}: IntelligenceBarProps) {
  if (mode === 'range' && low !== undefined && high !== undefined) {
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
              background: color,
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
  return (
    <div className="intelligence-bar-wrap intelligence-bar-wrap--stacked">
      <div className="intelligence-bar-bg">
        <div
          className="intelligence-bar-fill"
          style={{ width: `${val * 10}%`, background: color }}
        />
      </div>
      <span className="intelligence-bar-label">{val.toFixed(1)}</span>
    </div>
  );
}

export function getDimensionColor(
  dimension: IntelligenceDimension,
  dimensions: { key: IntelligenceDimension; color: string }[]
): string {
  return dimensions.find((d) => d.key === dimension)?.color ?? '#888';
}
