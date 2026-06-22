import { getScoreRangeSpectrumStyle, getScoreSpectrumStyle } from '../../utils/scoreSpectrum';

interface IntelligenceBarProps {
  value?: number;
  low?: number;
  high?: number;
  mode?: 'single' | 'range';
}

export default function IntelligenceBar({
  value,
  low,
  high,
  mode = 'single',
}: IntelligenceBarProps) {
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
