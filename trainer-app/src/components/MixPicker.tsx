import { useEffect, useRef, useState } from 'react';
import { breedCategories, breeds } from '@/data/breeds';
import type { Breed, BreedCategory } from '@/data/breeds';
import {
  AXES,
  getBreedFullProfile,
  getBreedMixAxisProfile,
  getBreedMixTraitLabel,
  getBreedSuggestedProfileTags,
  getBreedTrainerSummary,
  getCategoryAxisHint,
  type TraitAxis,
} from '@/data/breedTraits';
import { dogProfileTagLabel } from '@/data/dogProfileTags';
import { normalizeMixSelection } from '@/utils/dogBreedLabel';

export type MixParentSource = 'a' | 'b' | 'c' | 'other';

export interface MixSelection {
  parentA: Breed;
  parentB: Breed | null;
  parentC: Breed | null;
  personality: BreedCategory;
  working: BreedCategory;
  physical: BreedCategory;
  personalitySource: MixParentSource;
  workingSource: MixParentSource;
  physicalSource: MixParentSource;
}

interface MixPickerProps {
  onSelect: (selection: MixSelection) => void;
  onBack: () => void;
  /** Pre-fill parent breeds when opened from a deliberate cross breed selection. */
  initialParentNames?: { parentA: string; parentB: string };
}

function findBreed(name: string): Breed | null {
  return breeds.find((breed) => breed.name === name) ?? null;
}

interface AxisChoice {
  source: MixParentSource;
  category: BreedCategory;
}

function listSelectedParents(
  parentA: Breed,
  parentB: Breed | null,
  parentC: Breed | null
): { source: 'a' | 'b' | 'c'; breed: Breed }[] {
  const list: { source: 'a' | 'b' | 'c'; breed: Breed }[] = [{ source: 'a', breed: parentA }];
  if (parentB) list.push({ source: 'b', breed: parentB });
  if (parentC) list.push({ source: 'c', breed: parentC });
  return list;
}

function filterBreeds(query: string): Breed[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return breeds.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 8);
}

interface TraitOptionProps {
  selected: boolean;
  name: string;
  axisDetail: string;
  parentSlot?: 'a' | 'b' | 'c';
  onClick: () => void;
}

const PARENT_SLOT_LABEL: Record<'a' | 'b' | 'c', string> = {
  a: 'Primary type',
  b: 'Secondary type',
  c: 'Third type',
};

function TraitOption({ selected, name, axisDetail, parentSlot, onClick }: TraitOptionProps) {
  return (
    <button
      type="button"
      className={`mix-trait-card exam-trait-option exam-trait-option--detailed${selected ? ' is-selected' : ''}${parentSlot ? ` mix-trait-card--${parentSlot}` : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {parentSlot && (
        <span className="mix-trait-slot-badge">{PARENT_SLOT_LABEL[parentSlot]}</span>
      )}
      <span className="exam-trait-option-name">{name}</span>
      <p className="exam-trait-option-detail mix-trait-card-detail">{axisDetail}</p>
      {selected && <span className="mix-trait-selected-label">Selected for this trait</span>}
    </button>
  );
}

function ParentReference({ label, breed }: { label: string; breed: Breed }) {
  const suggestedTags = getBreedSuggestedProfileTags(breed.name);
  const category = breedCategories[breed.category];
  const summary = getBreedTrainerSummary(breed.name);

  return (
    <div className="exam-breed-ref-block">
      <h4 className="exam-breed-ref-title">{label}: {breed.name}</h4>
      <p className="exam-breed-ref-type">{getBreedMixTraitLabel(breed.name)}</p>
      <p className="exam-breed-ref-category small text-muted mb-2">
        Temperament type: {category.label}
      </p>
      <p className="exam-breed-ref-category-note small text-muted mb-2">{category.note}</p>
      {summary && <p className="exam-breed-ref-summary text-muted small mb-2">{summary}</p>}
      <p className="exam-breed-ref-lead small text-muted mb-2">
        Traits this parent could pass on:
      </p>
      <dl className="exam-breed-ref-table">
        {AXES.map((axis) => (
          <div className="exam-breed-ref-row" key={axis.key}>
            <dt>{axis.label}</dt>
            <dd>{getBreedMixAxisProfile(breed, axis.key, 'trainer')}</dd>
          </div>
        ))}
      </dl>
      {suggestedTags.length > 0 && (
        <p className="exam-breed-ref-tags small mb-0">
          <strong>Suggested profile tags:</strong>{' '}
          {suggestedTags.map(dogProfileTagLabel).join(', ')}
        </p>
      )}
    </div>
  );
}

function ParentSearch({
  id,
  label,
  placeholder,
  selected,
  unknown,
  onPick,
  allowUnknown,
  onUnknown,
  autoFocus,
}: {
  id: string;
  label: string;
  placeholder: string;
  selected: Breed | null;
  unknown?: boolean;
  onPick: (breed: Breed | null) => void;
  allowUnknown?: boolean;
  onUnknown?: () => void;
  autoFocus?: boolean;
}) {
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
          {selected && (
            <span className="exam-breed-cat">{getBreedMixTraitLabel(selected.name)}</span>
          )}
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
                <span className="exam-breed-cat">{getBreedMixTraitLabel(b.name)}</span>
                <span className="exam-breed-ref-snippet">{getBreedTrainerSummary(b.name) || getBreedFullProfile(b).personality.split('.')[0]}.</span>
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

export default function MixPicker({ onSelect, onBack, initialParentNames }: MixPickerProps) {
  const [parentA, setParentA] = useState<Breed | null>(() =>
    initialParentNames ? findBreed(initialParentNames.parentA) : null
  );
  const [parentB, setParentB] = useState<Breed | null>(() =>
    initialParentNames ? findBreed(initialParentNames.parentB) : null
  );
  const [parentC, setParentC] = useState<Breed | null>(null);
  const [showThirdParent, setShowThirdParent] = useState(false);
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

  const saveMix = () => {
    if (!parentA || !allChosen) return;
    onSelect(normalizeMixSelection({
      parentA,
      parentB,
      parentC: showThirdParent ? parentC : null,
      personality: choices.personality!.category,
      working: choices.working!.category,
      physical: choices.physical!.category,
      personalitySource: choices.personality!.source,
      workingSource: choices.working!.source,
      physicalSource: choices.physical!.source,
    }));
  };

  const selectedParents = parentA
    ? listSelectedParents(parentA, parentB, showThirdParent ? parentC : null)
    : [];
  const sharedCategory =
    selectedParents.length >= 2 &&
    selectedParents.every((entry) => entry.breed.category === selectedParents[0].breed.category) &&
    new Set(selectedParents.map((entry) => entry.breed.name)).size > 1;

  return (
    <section className="exam-step" aria-labelledby="exam-mix-heading">
      <h2 id="exam-mix-heading" className="h5">Tell us about the cross</h2>
      <p className="exam-step-desc">
        Pick up to three parent breeds (or your best guess), then which temperament traits your dog actually inherited.
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
        {showThirdParent ? (
          <ParentSearch
            id="mix-parent-c"
            label="Third type (optional)"
            placeholder="Another breed in the mix — e.g. Collie…"
            selected={parentC}
            onPick={(b) => {
              setParentC(b);
              if (!b) setShowThirdParent(false);
              resetParents();
            }}
          />
        ) : (
          parentsReady && (
            <button
              type="button"
              className="exam-mix-unknown-btn"
              onClick={() => setShowThirdParent(true)}
            >
              Add a third parent breed (optional)
            </button>
          )
        )}
      </div>

      {parentsReady && (
        <>
          <div className="exam-breed-ref-panel">
            <button type="button" className="exam-breed-ref-toggle" aria-expanded={refOpen} onClick={() => setRefOpen((open) => !open)}>
              {refOpen ? 'Hide' : 'Show'} parent reference profiles
            </button>
            {refOpen && (
              <div className="exam-breed-ref-grid">
                <ParentReference label="Primary type" breed={parentA!} />
                {parentB && <ParentReference label="Secondary type" breed={parentB} />}
                {showThirdParent && parentC && <ParentReference label="Third type" breed={parentC} />}
              </div>
            )}
          </div>

          <div className="exam-mix-traits">
            <p className="exam-breed-or mix-trait-section-lead">Which side did each trait come from?</p>
            <p className="mix-trait-section-hint">
              Each row is one inheritable trait — pick the parent whose description best matches your dog for that area only.
            </p>
            {sharedCategory && (
              <p className="exam-mix-same-category alert alert-secondary small">
                These parents share the <strong>{breedCategories[parentA!.category].label}</strong> type — compare
                the breed-specific details below, not the category name alone.
              </p>
            )}
            {AXES.map((axis) => {
              const choice = choices[axis.key];
              return (
                <div className={`exam-trait-axis exam-trait-axis-panel exam-trait-axis-panel--${axis.key}`} key={axis.key}>
                  <div className="exam-trait-axis-header">
                    <h3 className="exam-trait-label">{axis.label}</h3>
                    <p className="exam-trait-hint">{axis.hint}</p>
                  </div>
                  <p className="mix-trait-prompt">Which parent could have passed on this {axis.label.toLowerCase()}?</p>
                  <div className="exam-trait-options mix-trait-card-grid">
                    {selectedParents.map(({ source, breed }) => (
                      <TraitOption
                        key={source}
                        selected={choice?.source === source}
                        parentSlot={source}
                        name={breed.name}
                        axisDetail={getBreedMixAxisProfile(breed, axis.key, 'trainer')}
                        onClick={() => setAxis(axis.key, { source, category: breed.category })}
                      />
                    ))}
                    <button
                      type="button"
                      className={`mix-trait-card mix-trait-card--other exam-trait-option exam-trait-option--detailed exam-trait-option--other${choice?.source === 'other' ? ' is-selected' : ''}`}
                      onClick={() => setOtherOpen(otherOpen === axis.key ? null : axis.key)}
                      aria-pressed={choice?.source === 'other'}
                    >
                      <span className="mix-trait-slot-badge mix-trait-slot-badge--other">Something else</span>
                      <span className="exam-trait-option-name">
                        {choice?.source === 'other'
                          ? breedCategories[choice.category].label
                          : 'Different type than parents'}
                      </span>
                      <span className="mix-trait-tag">Not from a listed parent</span>
                      <p className="exam-trait-option-detail mix-trait-card-detail">
                        Trait came from a different type — tap to pick the closest match below.
                      </p>
                    </button>
                  </div>
                  {otherOpen === axis.key && (
                    <div className="exam-category-cards exam-trait-other">
                      {categoryKeys.map((key) => (
                        <button type="button" className="exam-category-card" key={key} onClick={() => setAxis(axis.key, { source: 'other', category: key })}>
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
          <button className="btn btn-primary exam-back-btn" type="button" disabled={!allChosen} onClick={saveMix}>
            Use this mix
          </button>
        )}
      </div>
    </section>
  );
}
