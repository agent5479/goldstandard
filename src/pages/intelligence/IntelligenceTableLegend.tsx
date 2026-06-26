import {
  COGNITIVE_DIMENSIONS,
  INSTINCT_SUBTYPE_META,
  INTELLIGENCE_DIMENSIONS,
  NEURO_PATTERN_META,
  VOCAL_HUE,
} from '../../data/dogIntelligence';
import { getTraitIntensityStyle } from '../../utils/scoreSpectrum';
import IntelligenceLegendItem from './IntelligenceLegendItem';

const INTENSITY_SAMPLE_HUE = '#639922';
const INTENSITY_SCORES = [10, 7, 5, 3, 1] as const;

export default function IntelligenceTableLegend() {
  const cognitiveDims = INTELLIGENCE_DIMENSIONS.filter((d) =>
    COGNITIVE_DIMENSIONS.includes(d.key)
  );

  return (
    <div className="intelligence-legend intelligence-legend--typed">
      <div className="intelligence-legend-row">
        <span className="intelligence-legend-row-title">Intensity (behavioural columns)</span>
        <div className="intelligence-legend-intensity">
          {INTENSITY_SCORES.map((score) => (
            <div className="intelligence-legend-intensity-item" key={score}>
              <div
                className="intelligence-legend-dot intelligence-legend-dot--intensity"
                style={{ background: getTraitIntensityStyle(INTENSITY_SAMPLE_HUE, score).barFill }}
              />
              <span className="intelligence-legend-intensity-score">{score}</span>
            </div>
          ))}
          <span className="intelligence-legend-intensity-hint">vivid → pale</span>
        </div>
      </div>

      <div className="intelligence-legend-row">
        <span className="intelligence-legend-row-title">Instinct types</span>
        <div className="intelligence-legend-chips">
          {INSTINCT_SUBTYPE_META.map((meta) => (
            <IntelligenceLegendItem
              key={meta.key}
              label={meta.label}
              color={meta.hue}
              description={meta.description}
            />
          ))}
        </div>
      </div>

      <div className="intelligence-legend-row">
        <span className="intelligence-legend-row-title">Stress patterns</span>
        <div className="intelligence-legend-chips">
          {NEURO_PATTERN_META.map((meta) => (
            <IntelligenceLegendItem
              key={meta.key}
              label={meta.label}
              color={meta.hue}
              description={meta.description}
            />
          ))}
        </div>
      </div>

      <div className="intelligence-legend-row">
        <span className="intelligence-legend-row-title">Other columns</span>
        <div className="intelligence-legend-chips">
          <IntelligenceLegendItem
            label="Vocal / barking"
            color={VOCAL_HUE}
            description="Typical vocal output — alert barking, baying, or yapping tendency."
          />
          {cognitiveDims.map((dim) => (
            <IntelligenceLegendItem
              key={dim.key}
              label={dim.label}
              color={dim.color}
              description={`${dim.description} Uses green (high) → gray (low) shading.`}
            />
          ))}
          <IntelligenceLegendItem
            label="Dominance"
            color="#8B4513"
            description="Assertive or rank-seeking behaviour — hue + intensity encoding."
          />
          <IntelligenceLegendItem
            label="Protectiveness"
            color="#B44A4A"
            description="Guarding household and territory — distinct from guard instinct talent."
          />
        </div>
      </div>
    </div>
  );
}
