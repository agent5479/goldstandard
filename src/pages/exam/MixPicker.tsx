import { useEffect, useRef, useState } from 'react';
import { breedCategories, breeds } from '../../data/breeds';
import type { Breed, BreedCategory } from '../../data/breeds';
import {
  AXES,
  getBreedAxisProfile,
  getBreedFullProfile,
  getCategoryAxisHint,
  type TraitAxis,
} from '../../data/breedTraits';

export interface MixSelection {
  parentA: Breed;
  parentB: Breed | null;
  personality: BreedCategory;
  working: BreedCategory;
  physical: BreedCategory;
}

interface MixPickerProps {
  onSelect: (selection: MixSelection) => void;
  onBack: () => void;
}

/** What the user picked for one trait axis. */
interface AxisChoice {
  source: 'a' | 'b' | 'other';
  category: BreedCategory;
}

function filterBreeds(query: string): Breed[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return breeds.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 8);
}

interface TraitOptionProps {
  selected: boolean;
  name: string;
  categoryLabel: string;
  axisDetail: string;
  onClick: () => void;
}

function TraitOption({ selected, name, categoryLabel, axisDetail, onClick }: TraitOptionProps) {
  return (
    <button
      type="button"
      className={`exam-trait-option exam-trait-option--detailed${selected ? ' is-selected' : ''}`}
      onClick={onClick}
    >
      <span className="exam-trait-option-name">{name}</span>
      <span className="exam-trait-option-cat">{categoryLabel}</span>
      <span className="exam-trait-option-detail">{axisDetail}</span>
    </button>
  );
}

interface ParentReferenceProps {
  label: string;
  breed: Breed;
}

function ParentReference({ label, breed }: ParentReferenceProps) {
  const profile = getBreedFullProfile(breed);
  return (
    <div className="exam-breed-ref-block">
      <h4 className="exam-breed-ref-title">{label}: {breed.name}</h4>
      <p className="exam-breed-ref-type">{breedCategories[breed.category].label}</p>
      <dl className="exam-breed-ref-table">
        {AXES.map((axis) => (
          <div className="exam-breed-ref-row" key={axis.key}>
            <dt>{axis.label}</dt>
            <dd>{profile[axis.key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

interface ParentSearchProps {
  id: string;
  label: string;
  placeholder: string;
  selected: Breed | null;
  unknown?: boolean;
  onPick: (breed: Breed | null) => void;
  allowUnknown?: boolean;
  onUnknown?: () => void;
  autoFocus?: boolean;
}

function ParentSearch({ id, label, placeholder, selected, unknown, onPick, allowUnknown, onUnknown, autoFocus }: ParentSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  if (selected || unknown) {
    return (
      <div className="exam-mix-parent">
        <span className="exam-mix-parent-label">{label}</span>
        <div className="exam-breed-chip">
          <span className="exam-breed-name">{selected ? selected.name : 'Unknown / not sure'}</span>
          {selected && <span className="exam-breed-cat">{breedCategories[selected.category].label}</span>}
          <button type="button" className="exam-breed-chip-change" onClick={() => { onPick(null); setQuery(''); }}>
            change
          </button>
        </div>
      </div>
    );
  }

  const matches = filterBreeds(query);

  return (
    <div className="exam-mix-parent">
      <label className="exam-mix-parent-label" htmlFor={id}>{label}</label>
      <div className="exam-breed-search">
        <input
          type="text"
          id={id}
          className="exam-breed-input"
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={matches.length > 0}
          aria-controls={`${id}-results`}
          aria-autocomplete="list"
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (matches.length > 0) onPick(matches[0]);
            }
          }}
        />
        <ul id={`${id}-results`} className="exam-breed-results" role="listbox" hidden={matches.length === 0}>
          {matches.map((b) => (
            <li key={b.name} role="option" aria-selected={false}>
              <button type="button" className="exam-breed-result" onClick={() => onPick(b)}>
                <span className="exam-breed-name">{b.name}</span>
                <span className="exam-breed-cat">{breedCategories[b.category].label}</span>
                <span className="exam-breed-ref-snippet">{getBreedFullProfile(b).physical.split('.')[0]}.</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {allowUnknown && (
        <button type="button" className="exam-mix-unknown-btn" onClick={onUnknown}>
          Unknown / not sure
        </button>
      )}
    </div>
  );
}

export default function MixPicker({ onSelect, onBack }: MixPickerProps) {
  const [parentA, setParentA] = useState<Breed | null>(null);
  const [parentB, setParentB] = useState<Breed | null>(null);
  const [parentBUnknown, setParentBUnknown] = useState(false);
  const [choices, setChoices] = useState<Partial<Record<TraitAxis, AxisChoice>>>({});
  const [otherOpen, setOtherOpen] = useState<TraitAxis | null>(null);
  const [refOpen, setRefOpen] = useState(true);

  const parentsReady = parentA !== null && (parentB !== null || parentBUnknown);
  const categoryKeys = Object.keys(breedCategories) as BreedCategory[];

  const setAxis = (axis: TraitAxis, choice: AxisChoice) => {
    setChoices((prev) => ({ ...prev, [axis]: choice }));
    setOtherOpen(null);
  };

  const resetParents = () => {
    setChoices({});
    setOtherOpen(null);
  };

  const allChosen = AXES.every((axis) => choices[axis.key]);

  const start = () => {
    if (!parentA || !allChosen) return;
    onSelect({
      parentA,
      parentB,
      personality: choices.personality!.category,
      working: choices.working!.category,
      physical: choices.physical!.category,
    });
  };

  return (
    <section className="exam-step" id="exam-mix" aria-labelledby="exam-mix-heading">
      <h2 id="exam-mix-heading">🐾 Tell us about the cross</h2>
      <p className="exam-step-desc">
        Mixes inherit unevenly — the build can come from one side and the personality from the other, or from
        somewhere else entirely. Pick the parent breeds (or your best guess), then tell us which traits your dog
        actually ended up with.
      </p>

      <div className="exam-mix-parents">
        <ParentSearch
          id="mix-parent-a"
          label="Primary type"
          placeholder="Start typing — Huntaway, Staffy, Lab…"
          selected={parentA}
          onPick={(b) => { setParentA(b); resetParents(); }}
          autoFocus
        />
        <ParentSearch
          id="mix-parent-b"
          label="Secondary type"
          placeholder="The other side of the cross…"
          selected={parentB}
          unknown={parentBUnknown}
          onPick={(b) => { setParentB(b); setParentBUnknown(false); resetParents(); }}
          allowUnknown={!parentBUnknown}
          onUnknown={() => { setParentBUnknown(true); setParentB(null); resetParents(); }}
        />
      </div>

      {parentsReady && (
        <>
          <div className="exam-breed-ref-panel">
            <button
              type="button"
              className="exam-breed-ref-toggle"
              aria-expanded={refOpen}
              onClick={() => setRefOpen((open) => !open)}
            >
              {refOpen ? 'Hide' : 'Show'} parent reference profiles
            </button>
            {refOpen && (
              <div className="exam-breed-ref-grid">
                <ParentReference label="Primary type" breed={parentA!} />
                {parentB && <ParentReference label="Secondary type" breed={parentB} />}
              </div>
            )}
          </div>

          <div className="exam-mix-traits">
            <p className="exam-breed-or">Which side did each trait come from?</p>
            {AXES.map((axis) => {
              const choice = choices[axis.key];
              return (
                <div className="exam-trait-axis" key={axis.key}>
                  <h3 className="exam-trait-label">{axis.label}</h3>
                  <p className="exam-trait-hint">{axis.hint}</p>
                  <div className="exam-trait-options">
                    <TraitOption
                      selected={choice?.source === 'a'}
                      name={parentA!.name}
                      categoryLabel={breedCategories[parentA!.category].label}
                      axisDetail={getBreedAxisProfile(parentA!, axis.key)}
                      onClick={() => setAxis(axis.key, { source: 'a', category: parentA!.category })}
                    />
                    {parentB && (
                      <TraitOption
                        selected={choice?.source === 'b'}
                        name={parentB.name}
                        categoryLabel={breedCategories[parentB.category].label}
                        axisDetail={getBreedAxisProfile(parentB, axis.key)}
                        onClick={() => setAxis(axis.key, { source: 'b', category: parentB.category })}
                      />
                    )}
                    <button
                      type="button"
                      className={`exam-trait-option exam-trait-option--detailed exam-trait-option--other${choice?.source === 'other' ? ' is-selected' : ''}`}
                      onClick={() => setOtherOpen(otherOpen === axis.key ? null : axis.key)}
                    >
                      <span className="exam-trait-option-name">
                        {choice?.source === 'other'
                          ? `Something else: ${breedCategories[choice.category].label}`
                          : 'Something else…'}
                      </span>
                      <span className="exam-trait-option-detail">
                        Trait came from a different type than either parent — pick the closest match below.
                      </span>
                    </button>
                  </div>
                  {otherOpen === axis.key && (
                    <div className="exam-category-cards exam-trait-other">
                      {categoryKeys.map((key) => (
                        <button
                          type="button"
                          className="exam-category-card"
                          key={key}
                          onClick={() => setAxis(axis.key, { source: 'other', category: key })}
                        >
                          <span className="exam-category-label">{breedCategories[key].label}</span>
                          <span className="exam-category-note">{getCategoryAxisHint(key, axis.key)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="exam-mix-actions">
        <button className="btn btn-secondary exam-back-btn" type="button" onClick={onBack}>← Back</button>
        {parentsReady && (
          <button className="btn btn-primary exam-back-btn" type="button" disabled={!allChosen} onClick={start}>
            Start the exam →
          </button>
        )}
      </div>
    </section>
  );
}
