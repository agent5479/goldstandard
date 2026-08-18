import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  INTELLIGENCE_DIMENSIONS,
  isTraitTypedDimension,
} from '../../data/dogIntelligence';
import {
  computeMixIntelligence,
  computeMixTemperamentNotes,
  type MixParentInput,
} from '../../utils/intelligenceMix';
import IntelligenceBar, {
  getDimensionCellStyle,
  getScoreRangeCellStyle,
  getSegmentCellStyleForDimension,
} from './IntelligenceBar';
import MixParentPicker, { type MixParentResolved } from './MixParentPicker';
import TrainingLeverageCard from './TrainingLeverageCard';

export default function MixIntelligenceExplorer() {
  const [resolved, setResolved] = useState<MixParentResolved>({
    parents: [],
    allSelected: false,
    fractionValid: false,
    fractionSum: 0,
  });

  const parentInputs: MixParentInput[] = resolved.parents;

  const intelligenceResult = useMemo(
    () =>
      resolved.allSelected && resolved.fractionValid
        ? computeMixIntelligence(parentInputs)
        : null,
    [resolved.allSelected, resolved.fractionValid, parentInputs]
  );

  const temperamentResult = useMemo(
    () =>
      resolved.allSelected && resolved.fractionValid
        ? computeMixTemperamentNotes(parentInputs)
        : null,
    [resolved.allSelected, resolved.fractionValid, parentInputs]
  );

  return (
    <div className="intelligence-mix-wrap">
      <MixParentPicker
        minParents={2}
        lead={
          <p className="intelligence-mix-lead">
            Build a cross or mongrel mix by assigning fractional parent contributions. Scores show a{' '}
            <strong>likely range</strong>, not a fixed result — genetics in mixes is a lottery.
          </p>
        }
        onResolved={setResolved}
      />

      {intelligenceResult?.valid && (
        <div className="intelligence-mix-results">
          <h3 className="intelligence-mix-title">{intelligenceResult.mixTitle}</h3>
          <p className="intelligence-mix-subtitle">Likely intelligence ranges (probabilistic)</p>

          <div className="intelligence-table-scroll">
            <table className="intelligence-table intelligence-mix-result-table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Likely range</th>
                  <th>Midpoint</th>
                </tr>
              </thead>
              <tbody>
                {intelligenceResult.ranges.map((range) => {
                  const dim = INTELLIGENCE_DIMENSIONS.find((d) => d.key === range.dimension)!;
                  const cellStyle =
                    range.dimension === 'inst'
                      ? getSegmentCellStyleForDimension(
                          intelligenceResult.instinctSegments,
                          range.dimension
                        )
                      : range.dimension === 'neuro'
                        ? getSegmentCellStyleForDimension(
                            intelligenceResult.neuroSegments,
                            range.dimension
                          )
                        : isTraitTypedDimension(range.dimension)
                          ? getDimensionCellStyle(range.dimension, range.expected)
                          : getScoreRangeCellStyle(
                              range.likelyLow,
                              range.likelyHigh,
                              range.dimension
                            );

                  const rangeBar =
                    range.dimension === 'inst' ? (
                      <IntelligenceBar
                        mode="segments"
                        segments={intelligenceResult.instinctSegments}
                        value={range.expected}
                        dimension={range.dimension}
                      />
                    ) : range.dimension === 'neuro' ? (
                      <IntelligenceBar
                        mode="segments"
                        segments={intelligenceResult.neuroSegments}
                        value={range.expected}
                        dimension={range.dimension}
                      />
                    ) : (
                      <IntelligenceBar
                        mode="range"
                        low={range.likelyLow}
                        high={range.likelyHigh}
                        dimension={range.dimension}
                      />
                    );

                  const midpointStyle =
                    range.dimension === 'inst'
                      ? getSegmentCellStyleForDimension(
                          intelligenceResult.instinctSegments,
                          range.dimension
                        )
                      : range.dimension === 'neuro'
                        ? getSegmentCellStyleForDimension(
                            intelligenceResult.neuroSegments,
                            range.dimension
                          )
                        : isTraitTypedDimension(range.dimension)
                          ? getDimensionCellStyle(range.dimension, range.expected)
                          : getScoreRangeCellStyle(
                              range.expected,
                              range.expected,
                              range.dimension
                            );

                  return (
                    <tr key={range.dimension}>
                      <td className="intelligence-dim-label intelligence-dim-label--tip intelligence-score-cell">
                        <span className="intelligence-th-tip-label">
                          {dim.label}
                          <span className="intelligence-col-tooltip" role="tooltip">
                            {dim.description}
                          </span>
                        </span>
                      </td>
                      <td className="intelligence-score-cell" style={cellStyle}>
                        {rangeBar}
                      </td>
                      <td className="intelligence-mix-mid" style={midpointStyle}>
                        ~{range.expected.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="intelligence-mix-leverage">
            <TrainingLeverageCard
              variant="mix"
              segments={intelligenceResult.instinctSegments}
              title="Training leverage (probabilistic)"
            />
          </div>
        </div>
      )}

      {temperamentResult && temperamentResult.notes.length > 0 && (
        <div className="intelligence-mix-temperament">
          <h3>Temperament inheritance (probabilistic)</h3>
          <p className="intelligence-mix-temperament-lead">
            Which parent traits might express — individual dogs often take after one side more than the
            fraction suggests.
          </p>
          <div className="intelligence-mix-temperament-grid">
            {temperamentResult.notes.map((note) => (
              <article
                className={`intelligence-mix-temperament-card${note.wideLottery ? ' is-wide-lottery' : ''}`}
                key={note.axis}
              >
                <h4>{note.axisLabel}</h4>
                <p className="intelligence-mix-temperament-summary">{note.summary}</p>
                <ul className="intelligence-mix-temperament-parents">
                  {note.parentNotes.map((pn) => (
                    <li key={pn.breed}>
                      <strong>
                        {Math.round(pn.fraction * 100)}% {pn.breed}:
                      </strong>{' '}
                      {pn.detail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="callout intelligence-mix-disclaimer">
        <strong>Genetic lottery</strong>
        <p>
          Mixes inherit unevenly. These ranges are illustrative — individual dogs routinely land outside
          them. For training-specific temperament attribution, use the{' '}
          <Link to="/exam">owner exam mix flow</Link>. For role fit, cultivation by age, and dice-roll
          gambits, use the <Link to="/dog-selector">dog selector</Link>.
        </p>
      </div>
    </div>
  );
}
