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
} from '../../data/dogIntelligence';
import { COGNITIVE_GREEN_HUE, getTraitIntensityStyle } from '../../utils/scoreSpectrum';
import IntelligenceLegendItem from './IntelligenceLegendItem';

function buildIntensityScores(floor: number): number[] {
  const span = 10 - floor;
  if (span <= 0) return [10, floor];
  const midHigh = Math.round((floor + span * 0.75) * 10) / 10;
  const mid = Math.round((floor + span * 0.5) * 10) / 10;
  const midLow = Math.round((floor + span * 0.25) * 10) / 10;
  return [10, midHigh, mid, midLow, floor];
}

export default function IntelligenceTableLegend() {
  const cognitiveDims = INTELLIGENCE_DIMENSIONS.filter((d) =>
    COGNITIVE_DIMENSIONS.includes(d.key)
  );
  const iqFloor = INTELLIGENCE_SCORE_FLOORS.iq;
  const intensityScores = buildIntensityScores(iqFloor);
  const iqBounds = scoreBoundsFor('iq');

  return (
    <div className="intelligence-legend intelligence-legend--typed">
      <div className="intelligence-legend-row">
        <span className="intelligence-legend-row-title">Intensity (score strength)</span>
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
        <span className="intelligence-legend-row-title">Stress patterns (red)</span>
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
            description="Orange — typical vocal output (alert barking, baying, yapping)."
          />
          <IntelligenceLegendItem
            label="Dominance"
            color={DOM_HUE}
            description="Green — assertive or rank-seeking behaviour; vividness shows strength."
          />
          <IntelligenceLegendItem
            label="Protectiveness"
            color={PROT_HUE}
            description="Green — guarding household and territory; distinct from guard instinct talent."
          />
          <IntelligenceLegendItem
            label="Neuroticism"
            color={NEURO_HUE}
            description="Red — stress-looping patterns; segment shade shows which pattern."
          />
          {cognitiveDims.map((dim) => (
            <IntelligenceLegendItem
              key={dim.key}
              label={dim.label}
              color={COGNITIVE_GREEN_HUE}
              description={`${dim.description} Green vividness encodes score (pale at column minimum).`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
