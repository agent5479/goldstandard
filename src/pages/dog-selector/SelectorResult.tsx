import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  INTELLIGENCE_DIMENSIONS,
  INTELLIGENCE_DIMENSION_KEYS,
  isTraitTypedDimension,
} from '../../data/dogIntelligence';
import { getPurposeRole, type PurposeRoleId } from '../../data/dogPurposeRoles';
import { resolveCultivationTimeline } from '../../data/nervousSystemCultivation';
import {
  computeMixIntelligence,
  type IntelligenceRange,
} from '../../utils/intelligenceMix';
import {
  scoreSubjectAllRoles,
  type GambitLevel,
  type SelectorSubject,
} from '../../utils/roleFit';
import IntelligenceBar, {
  getDimensionCellStyle,
  getScoreRangeCellStyle,
  getSegmentCellStyleForDimension,
} from '../intelligence/IntelligenceBar';
import TrainingLeverageCard from '../intelligence/TrainingLeverageCard';
import BreedDetailContent from '../intelligence/BreedDetailContent';
import CultivationTimeline from './CultivationTimeline';
import GambitCallouts from './GambitCallouts';

const GAMBIT_LABEL: Record<GambitLevel, string> = {
  aligned: 'Aligned',
  moderate: 'Moderate',
  wide: 'Wide lottery',
  conflict: 'Conflict',
};

function rangesFromSubject(subject: SelectorSubject, expectedScores: Record<string, number>): IntelligenceRange[] {
  if (subject.kind === 'mix' && subject.parents.length >= 2) {
    const mix = computeMixIntelligence(subject.parents);
    if (mix.valid) return mix.ranges;
  }
  return INTELLIGENCE_DIMENSION_KEYS.map((dimension) => ({
    dimension,
    expected: expectedScores[dimension] ?? 5,
    likelyLow: expectedScores[dimension] ?? 5,
    likelyHigh: expectedScores[dimension] ?? 5,
    spread: 0,
  }));
}

export default function SelectorResult({
  subject,
  highlightRoleId,
  recipeNote,
  onBack,
  onRestart,
}: {
  subject: SelectorSubject;
  highlightRoleId?: PurposeRoleId;
  recipeNote?: string;
  onBack: () => void;
  onRestart: () => void;
}) {
  const packed = scoreSubjectAllRoles(subject);
  const [expandedDetail, setExpandedDetail] = useState(false);

  if (!packed) {
    return (
      <div className="callout">
        <strong>Could not score this combination</strong>
        <p>Check the breed names and that mix fractions total 100%.</p>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
      </div>
    );
  }

  const { title, input, roles } = packed;
  const ranges = input.ranges ?? rangesFromSubject(subject, input.scores);
  const isMix = Boolean(input.ranges) || subject.kind === 'mix';
  const breedNames =
    subject.kind === 'breed' ? [subject.breed] : subject.parents.map((parent) => parent.breed);
  const timeline = resolveCultivationTimeline({
    breedNames,
    roleId: highlightRoleId,
  });
  const highlighted = highlightRoleId ? roles.find((role) => role.roleId === highlightRoleId) : roles[0];
  const roleCopy = highlightRoleId ? getPurposeRole(highlightRoleId) : undefined;

  return (
    <div className="dog-selector-result">
      <div className="quiz-result-hero">
        <p className="section-label">{isMix ? 'Mix readout' : 'Breed readout'}</p>
        <h2 className="quiz-result-archetype">{title}</h2>
        {roleCopy && (
          <p className="quiz-result-blurb">
            Scored for <strong>{roleCopy.label}</strong> — {roleCopy.clientSummary}
          </p>
        )}
      </div>

      <div className="callout">
        <strong>Genetic lottery</strong>
        <p>
          {isMix
            ? 'Mixes inherit unevenly. Ranges are illustrative — individual dogs routinely land outside them. Select the adult in front of you, not the pedigree.'
            : 'Breed scores are type estimates, not a label for any individual dog. Structure and upbringing still decide the adult.'}{' '}
          Compare dimensions on the <Link to="/intelligence">breed analysis table</Link>.
        </p>
      </div>

      {highlighted && (
        <div className="dog-selector-highlight">
          <p className="dog-selector-highlight-score">
            {highlighted.fit.toFixed(0)}% fit
            <span>
              {' '}
              · {Math.round(highlighted.confidence * 100)}% confidence · {GAMBIT_LABEL[highlighted.gambitLevel]}
            </span>
          </p>
          {highlighted.reasons.length > 0 && (
            <ul className="breed-finder-result-reasons">
              {highlighted.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          )}
          {highlighted.cautions.length > 0 && (
            <ul className="breed-finder-result-cautions">
              {highlighted.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {(input.mixGambit || recipeNote) && (
        <GambitCallouts
          mixGambit={input.mixGambit}
          roleLevel={highlighted?.gambitLevel}
          recipeNote={recipeNote}
        />
      )}

      <h3>Likely intelligence {isMix ? 'ranges' : 'profile'}</h3>
      <div className="intelligence-table-scroll">
        <table className="intelligence-table intelligence-mix-result-table">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>{isMix ? 'Likely range' : 'Score'}</th>
              <th>{isMix ? 'Midpoint' : ''}</th>
            </tr>
          </thead>
          <tbody>
            {ranges.map((range) => {
              const dim = INTELLIGENCE_DIMENSIONS.find((item) => item.key === range.dimension)!;
              const cellStyle =
                range.dimension === 'inst'
                  ? getSegmentCellStyleForDimension(input.instinctSegments, range.dimension)
                  : range.dimension === 'neuro'
                    ? getSegmentCellStyleForDimension(input.neuroSegments, range.dimension)
                    : isTraitTypedDimension(range.dimension)
                      ? getDimensionCellStyle(range.dimension, range.expected)
                      : isMix
                        ? getScoreRangeCellStyle(range.likelyLow, range.likelyHigh, range.dimension)
                        : getDimensionCellStyle(range.dimension, range.expected);

              const bar =
                range.dimension === 'inst' ? (
                  <IntelligenceBar
                    mode="segments"
                    segments={input.instinctSegments}
                    value={range.expected}
                    dimension={range.dimension}
                  />
                ) : range.dimension === 'neuro' ? (
                  <IntelligenceBar
                    mode="segments"
                    segments={input.neuroSegments}
                    value={range.expected}
                    dimension={range.dimension}
                  />
                ) : isMix ? (
                  <IntelligenceBar
                    mode="range"
                    low={range.likelyLow}
                    high={range.likelyHigh}
                    dimension={range.dimension}
                  />
                ) : (
                  <IntelligenceBar mode="single" value={range.expected} dimension={range.dimension} />
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
                    {bar}
                  </td>
                  <td className="intelligence-mix-mid">
                    {isMix ? `~${range.expected.toFixed(1)}` : range.expected.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3>Role fit</h3>
      <ol className="dog-selector-role-rank">
        {roles.map((role) => (
          <li
            key={role.roleId}
            className={role.roleId === highlightRoleId ? 'is-highlighted' : undefined}
          >
            <span className="dog-selector-role-rank-label">{role.label}</span>
            <span className="dog-selector-role-rank-fit">{role.fit.toFixed(0)}%</span>
            <span className="dog-selector-role-rank-gambit">{GAMBIT_LABEL[role.gambitLevel]}</span>
          </li>
        ))}
      </ol>

      <div className="intelligence-mix-leverage">
        <TrainingLeverageCard
          variant={isMix ? 'mix' : 'purebred'}
          segments={input.instinctSegments}
          breedName={subject.kind === 'breed' ? subject.breed : undefined}
          title={isMix ? 'Training leverage (probabilistic)' : 'Training leverage'}
        />
      </div>

      <CultivationTimeline checkpoints={timeline} />

      {subject.kind === 'breed' && (
        <>
          <button
            type="button"
            className="btn btn-ghost breed-finder-detail-toggle"
            onClick={() => setExpandedDetail((open) => !open)}
            aria-expanded={expandedDetail}
          >
            {expandedDetail ? 'Hide breed analysis detail' : 'Show full breed analysis detail'}
          </button>
          {expandedDetail && (
            <div className="breed-finder-detail-panel">
              <BreedDetailContent breedName={subject.breed} />
            </div>
          )}
        </>
      )}

      <div className="quiz-result-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn btn-ghost" onClick={onRestart}>
          Start over
        </button>
      </div>
    </div>
  );
}
