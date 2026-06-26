import type { DogIntelligenceProfile, IntelligenceDimension } from '../../data/dogIntelligence';
import { isSegmentedDimension, isTraitTypedDimension } from '../../data/dogIntelligence';
import IntelligenceBar, {
  getDimensionCellStyle,
  getSegmentCellStyle,
} from './IntelligenceBar';

interface IntelligenceScoreCellProps {
  profile: DogIntelligenceProfile;
  dimension: IntelligenceDimension;
}

export default function IntelligenceScoreCell({ profile, dimension }: IntelligenceScoreCellProps) {
  const score = profile.scores[dimension];

  if (dimension === 'inst') {
    return (
      <td
        className="intelligence-score-cell intelligence-score-cell--segments"
        style={getSegmentCellStyle(profile.instinctSegments)}
      >
        <IntelligenceBar
          mode="segments"
          segments={profile.instinctSegments}
          value={score}
          dimension={dimension}
        />
      </td>
    );
  }

  if (dimension === 'neuro') {
    return (
      <td
        className="intelligence-score-cell intelligence-score-cell--segments"
        style={getSegmentCellStyle(profile.neuroSegments)}
      >
        <IntelligenceBar
          mode="segments"
          segments={profile.neuroSegments}
          value={score}
          dimension={dimension}
        />
      </td>
    );
  }

  return (
    <td
      className="intelligence-score-cell"
      style={getDimensionCellStyle(dimension, score)}
    >
      <IntelligenceBar
        value={score}
        dimension={isTraitTypedDimension(dimension) ? dimension : undefined}
      />
    </td>
  );
}

export function isSegmentedScoreDimension(dimension: IntelligenceDimension): boolean {
  return isSegmentedDimension(dimension);
}
