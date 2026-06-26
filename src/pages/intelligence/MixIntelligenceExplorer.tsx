import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  filterMixBreeds,
  INTELLIGENCE_DIMENSIONS,
  isTraitTypedDimension,
  type DogIntelligenceProfile,
} from '../../data/dogIntelligence';
import {
  computeMixIntelligence,
  computeMixTemperamentNotes,
  type MixParentInput,
} from '../../utils/intelligenceMix';
import IntelligenceBar, {
  getDimensionCellStyle,
  getScoreRangeCellStyle,
  getSegmentCellStyle,
} from './IntelligenceBar';

const FRACTION_OPTIONS = [
  { value: 0.5, label: '½ (50%)' },
  { value: 0.333333, label: '⅓ (33%)' },
  { value: 0.25, label: '¼ (25%)' },
  { value: 0.125, label: '⅛ (12%)' },
];

interface ParentRow {
  id: number;
  breed: string;
  profile: DogIntelligenceProfile | null;
  fraction: number;
  query: string;
}

let nextId = 1;

function createRow(breed = '', fraction = 0.5): ParentRow {
  return {
    id: nextId++,
    breed,
    profile: null,
    fraction,
    query: breed,
  };
}

function ParentBreedSearch({
  row,
  onUpdate,
  onRemove,
  canRemove,
}: {
  row: ParentRow;
  onUpdate: (row: ParentRow) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const matches = filterMixBreeds(row.query);

  if (row.profile) {
    return (
      <div className="intelligence-mix-parent">
        <div className="exam-breed-chip">
          <span className="exam-breed-name">{row.profile.breed}</span>
          <button
            type="button"
            className="exam-breed-chip-change"
            onClick={() => onUpdate({ ...row, breed: '', profile: null, query: '' })}
          >
            change
          </button>
        </div>
        <select
          className="intelligence-fraction-select"
          value={row.fraction}
          onChange={(e) => onUpdate({ ...row, fraction: Number(e.target.value) })}
          aria-label={`Fraction for ${row.profile.breed}`}
        >
          {FRACTION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {canRemove && (
          <button type="button" className="intelligence-mix-remove" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="intelligence-mix-parent">
      <div className="exam-breed-search">
        <input
          type="text"
          className="exam-breed-input"
          placeholder="Search parent breed…"
          autoComplete="off"
          value={row.query}
          onChange={(e) => onUpdate({ ...row, query: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && matches.length > 0) {
              e.preventDefault();
              const picked = matches[0];
              onUpdate({
                ...row,
                breed: picked.name,
                profile: picked.profile,
                query: picked.name,
              });
            }
          }}
        />
        <ul className="exam-breed-results" role="listbox" hidden={matches.length === 0}>
          {matches.map((entry) => (
            <li key={entry.name} role="option">
              <button
                type="button"
                className="exam-breed-result"
                onClick={() =>
                  onUpdate({
                    ...row,
                    breed: entry.name,
                    profile: entry.profile,
                    query: entry.name,
                  })
                }
              >
                <span className="exam-breed-name">{entry.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <select
        className="intelligence-fraction-select"
        value={row.fraction}
        onChange={(e) => onUpdate({ ...row, fraction: Number(e.target.value) })}
        aria-label="Parent fraction"
      >
        {FRACTION_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {canRemove && (
        <button type="button" className="intelligence-mix-remove" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

export default function MixIntelligenceExplorer() {
  const [rows, setRows] = useState<ParentRow[]>(() => [
    createRow('', 0.5),
    createRow('', 0.5),
  ]);

  const fractionSum = rows.reduce((sum, r) => sum + (r.profile ? r.fraction : 0), 0);
  const allParentsSelected = rows.every((r) => r.profile !== null);
  const fractionValid = Math.abs(fractionSum - 1) < 0.001;

  const parentInputs: MixParentInput[] = useMemo(
    () =>
      rows
        .filter((r) => r.profile)
        .map((r) => ({ breed: r.profile!.breed, fraction: r.fraction })),
    [rows]
  );

  const intelligenceResult = useMemo(
    () => (allParentsSelected && fractionValid ? computeMixIntelligence(parentInputs) : null),
    [allParentsSelected, fractionValid, parentInputs]
  );

  const temperamentResult = useMemo(
    () => (allParentsSelected && fractionValid ? computeMixTemperamentNotes(parentInputs) : null),
    [allParentsSelected, fractionValid, parentInputs]
  );

  const updateRow = (id: number, updated: ParentRow) => {
    setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const addRow = () => {
    if (rows.length >= 4) return;
    setRows((prev) => [...prev, createRow('', 0.25)]);
  };

  const remaining = Math.round((1 - fractionSum) * 100);

  return (
    <div className="intelligence-mix-wrap">
      <p className="intelligence-mix-lead">
        Build a cross or mongrel mix by assigning fractional parent contributions. Scores show a{' '}
        <strong>likely range</strong>, not a fixed result — genetics in mixes is a lottery.
      </p>

      <div className="intelligence-mix-parents">
        {rows.map((row) => (
          <ParentBreedSearch
            key={row.id}
            row={row}
            onUpdate={(updated) => updateRow(row.id, updated)}
            onRemove={() => removeRow(row.id)}
            canRemove={rows.length > 2}
          />
        ))}
      </div>

      {rows.length < 4 && (
        <button type="button" className="btn btn-secondary intelligence-mix-add" onClick={addRow}>
          Add another parent (up to 4)
        </button>
      )}

      {!fractionValid && allParentsSelected && (
        <p className="intelligence-mix-fraction-hint alert alert-secondary">
          {remaining > 0
            ? `${Math.round(fractionSum * 100)}% allocated — add ${remaining}% more to reach 100%.`
            : `${Math.round(fractionSum * 100)}% allocated — reduce fractions to total 100%.`}
        </p>
      )}

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
                      ? getSegmentCellStyle(intelligenceResult.instinctSegments)
                      : range.dimension === 'neuro'
                        ? getSegmentCellStyle(intelligenceResult.neuroSegments)
                        : isTraitTypedDimension(range.dimension)
                          ? getDimensionCellStyle(range.dimension, range.expected)
                          : getScoreRangeCellStyle(range.likelyLow, range.likelyHigh);

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
                      <IntelligenceBar mode="range" low={range.likelyLow} high={range.likelyHigh} />
                    );

                  const midpointStyle =
                    range.dimension === 'inst'
                      ? getSegmentCellStyle(intelligenceResult.instinctSegments)
                      : range.dimension === 'neuro'
                        ? getSegmentCellStyle(intelligenceResult.neuroSegments)
                        : isTraitTypedDimension(range.dimension)
                          ? getDimensionCellStyle(range.dimension, range.expected)
                          : getScoreRangeCellStyle(range.expected, range.expected);

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
          <Link to="/exam">owner exam mix flow</Link>.
        </p>
      </div>
    </div>
  );
}
