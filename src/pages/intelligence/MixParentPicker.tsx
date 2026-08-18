import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  filterMixBreeds,
  type DogIntelligenceProfile,
} from '../../data/dogIntelligence';
import type { MixParentInput } from '../../utils/intelligenceMix';

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

export interface MixParentResolved {
  parents: MixParentInput[];
  allSelected: boolean;
  fractionValid: boolean;
  fractionSum: number;
}

function ParentBreedSearch({
  row,
  onUpdate,
  onRemove,
  canRemove,
  showFraction,
}: {
  row: ParentRow;
  onUpdate: (row: ParentRow) => void;
  onRemove: () => void;
  canRemove: boolean;
  showFraction: boolean;
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
        {showFraction && (
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
        )}
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
      {showFraction && (
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
      )}
      {canRemove && (
        <button type="button" className="intelligence-mix-remove" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

export default function MixParentPicker({
  minParents = 2,
  maxParents = 4,
  lead,
  onResolved,
}: {
  minParents?: number;
  maxParents?: number;
  lead?: ReactNode;
  onResolved: (state: MixParentResolved) => void;
}) {
  const [rows, setRows] = useState<ParentRow[]>(() =>
    minParents <= 1 ? [createRow('', 1)] : [createRow('', 0.5), createRow('', 0.5)]
  );

  const selectedCount = rows.filter((row) => row.profile).length;
  const showFraction = rows.length > 1;
  const fractionSum = rows.reduce((sum, row) => sum + (row.profile ? row.fraction : 0), 0);
  const allSelected = rows.every((row) => row.profile !== null) && selectedCount >= minParents;
  const fractionValid =
    selectedCount === 1 && minParents <= 1
      ? true
      : Math.abs(fractionSum - 1) < 0.001 && selectedCount >= 2;

  const parents: MixParentInput[] = useMemo(() => {
    const live = rows
      .filter((row) => row.profile)
      .map((row) => ({ breed: row.profile!.breed, fraction: row.fraction }));
    if (live.length === 1 && minParents <= 1) {
      return [{ breed: live[0].breed, fraction: 1 }];
    }
    return live;
  }, [rows, minParents]);

  const onResolvedRef = useRef(onResolved);
  onResolvedRef.current = onResolved;

  useEffect(() => {
    onResolvedRef.current({
      parents,
      allSelected: selectedCount >= minParents && rows.every((row) => row.profile !== null),
      fractionValid,
      fractionSum: selectedCount === 1 && minParents <= 1 ? 1 : fractionSum,
    });
  }, [parents, selectedCount, minParents, rows, fractionValid, fractionSum]);

  const updateRow = (id: number, updated: ParentRow) => {
    setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
  };

  const removeRow = (id: number) => {
    setRows((prev) => {
      const next = prev.filter((row) => row.id !== id);
      if (next.length === 1) {
        return next.map((row) => ({ ...row, fraction: 1 }));
      }
      return next;
    });
  };

  const addRow = () => {
    if (rows.length >= maxParents) return;
    setRows((prev) => {
      if (prev.length === 1) {
        return [
          { ...prev[0], fraction: 0.5 },
          createRow('', 0.5),
        ];
      }
      return [...prev, createRow('', 0.25)];
    });
  };

  const remaining = Math.round((1 - fractionSum) * 100);

  return (
    <div className="intelligence-mix-picker">
      {lead}
      <div className="intelligence-mix-parents">
        {rows.map((row) => (
          <ParentBreedSearch
            key={row.id}
            row={row}
            onUpdate={(updated) => updateRow(row.id, updated)}
            onRemove={() => removeRow(row.id)}
            canRemove={rows.length > minParents}
            showFraction={showFraction}
          />
        ))}
      </div>

      {rows.length < maxParents && (
        <button type="button" className="btn btn-secondary intelligence-mix-add" onClick={addRow}>
          {rows.length === 1 ? 'Add a parent breed to make this a mix' : `Add another parent (up to ${maxParents})`}
        </button>
      )}

      {!fractionValid && allSelected && selectedCount >= 2 && (
        <p className="intelligence-mix-fraction-hint alert alert-secondary">
          {remaining > 0
            ? `${Math.round(fractionSum * 100)}% allocated — add ${remaining}% more to reach 100%.`
            : `${Math.round(fractionSum * 100)}% allocated — reduce fractions to total 100%.`}
        </p>
      )}
    </div>
  );
}
