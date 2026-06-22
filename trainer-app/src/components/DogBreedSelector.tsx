import { useId, useRef, useState } from 'react';
import { breedCategories, breeds } from '@/data/breeds';
import type { Breed, BreedCategory } from '@/data/breeds';
import {
  getBreedMixTraitLabel,
  getBreedTrainerSummary,
} from '@/data/breedTraits';
import MixPicker, { type MixSelection } from '@/components/MixPicker';
import {
  buildDefaultMixSelectionFromCross,
  formatBreedDisplayLabel,
  formatMixBreedLabel,
  formatTemperamentBreedLabel,
  resolveCrossParentNamesFromBreed,
} from '@/utils/dogBreedLabel';

type DogBreedSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  mixMode?: 'full' | 'simple';
};

function filterBreeds(query: string): Breed[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return breeds.filter((breed) => breed.name.toLowerCase().includes(q)).slice(0, 8);
}

export default function DogBreedSelector({
  value,
  onChange,
  disabled = false,
  required = false,
  mixMode = 'full',
}: DogBreedSelectorProps) {
  const listId = useId();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'search' | 'mix'>('search');
  const [query, setQuery] = useState('');
  const [mixDescription, setMixDescription] = useState('');
  const [mixInitialParents, setMixInitialParents] = useState<
    { parentA: string; parentB: string } | undefined
  >();
  const mixInputId = useId();

  const matches = filterBreeds(query);
  const categoryKeys = Object.keys(breedCategories) as BreedCategory[];

  const clearSelection = () => {
    onChange('');
    setQuery('');
    setMixDescription('');
    setMixInitialParents(undefined);
    setMode('search');
    inputRef.current?.focus();
  };

  const handleBreedPick = (breed: Breed) => {
    const crossParents = resolveCrossParentNamesFromBreed(breed.name);
    if (crossParents) {
      if (mixMode === 'full') {
        setMixInitialParents({ parentA: crossParents[0], parentB: crossParents[1] });
        setMode('mix');
        setQuery('');
        return;
      }
      const selection = buildDefaultMixSelectionFromCross(breed.name);
      if (selection) {
        onChange(formatMixBreedLabel(selection, 'trainer'));
        setQuery('');
        return;
      }
    }
    onChange(breed.name);
    setQuery('');
  };

  if (mode === 'mix' && mixMode === 'simple') {
    return (
      <div className="form-breed-selector form-breed-mix-simple">
        <label className="form-breed-label" htmlFor={mixInputId}>Mix / cross</label>
        <p className="text-muted small">Your best guess is fine — e.g. Labrador × Collie, Staffy mix.</p>
        <input
          id={mixInputId}
          type="text"
          className="exam-breed-input"
          placeholder="Describe the mix"
          autoComplete="off"
          disabled={disabled}
          value={mixDescription}
          onChange={(event) => setMixDescription(event.target.value)}
        />
        <div className="form-breed-mix-simple-actions">
          <button type="button" className="btn btn-primary" disabled={disabled || !mixDescription.trim()} onClick={() => { onChange(mixDescription.trim()); setMixDescription(''); setMode('search'); }}>
            Use this mix
          </button>
          <button type="button" className="btn btn-link" disabled={disabled} onClick={() => setMode('search')}>Back</button>
        </div>
      </div>
    );
  }

  if (mode === 'mix') {
    return (
      <div className="form-breed-selector form-breed-selector--mix">
        <MixPicker
          initialParentNames={mixInitialParents}
          onSelect={(selection: MixSelection) => {
            onChange(formatMixBreedLabel(selection, 'trainer'));
            setMixInitialParents(undefined);
            setMode('search');
          }}
          onBack={() => {
            setMixInitialParents(undefined);
            setMode('search');
          }}
        />
      </div>
    );
  }

  if (value) {
    return (
      <div className="form-breed-selector">
        <div className="exam-breed-chip form-breed-chip">
          <span className="exam-breed-name">{formatBreedDisplayLabel(value)}</span>
          <button type="button" className="exam-breed-chip-change" disabled={disabled} onClick={clearSelection}>
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-breed-selector">
      <label className="form-breed-label" htmlFor={inputId}>
        Dog breed {required ? '' : <span className="text-muted">(optional)</span>}
      </label>
      <div className="exam-breed-search">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className="exam-breed-input"
          placeholder="Start typing — Border Collie, Staffy, Huntaway…"
          autoComplete="off"
          role="combobox"
          aria-expanded={matches.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          disabled={disabled}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && matches.length > 0) {
              event.preventDefault();
              handleBreedPick(matches[0]);
            }
          }}
        />
        <ul id={listId} className="exam-breed-results" role="listbox" hidden={matches.length === 0}>
          {matches.map((breed) => {
            const summary = getBreedTrainerSummary(breed.name);
            return (
            <li key={breed.name} role="option">
              <button type="button" className="exam-breed-result" disabled={disabled} onClick={() => handleBreedPick(breed)}>
                <span className="exam-breed-name">{breed.name}</span>
                <span className="exam-breed-cat">{breedCategories[breed.category].label}</span>
                {summary && (
                  <span className="exam-breed-summary small text-muted d-block">{getBreedMixTraitLabel(breed.name)}</span>
                )}
              </button>
            </li>
            );
          })}
        </ul>
      </div>

      <p className="exam-breed-or">Got a cross?</p>
      <button type="button" className="exam-category-card exam-mix-card form-breed-mix-btn" disabled={disabled} onClick={() => setMode('mix')}>
        <span className="exam-category-label">Mongrel / mix / cross</span>
        <span className="exam-category-note">
          {mixMode === 'simple'
            ? 'Describe the mix in your own words.'
            : 'Pick parent breeds and which traits your dog inherited.'}
        </span>
      </button>

      <details className="form-breed-temperament">
        <summary>Breed not listed? Choose closest temperament</summary>
        <div className="exam-category-cards form-breed-temperament-cards">
          {categoryKeys.map((key) => (
            <button type="button" className="exam-category-card" key={key} disabled={disabled} onClick={() => onChange(formatTemperamentBreedLabel(key))}>
              <span className="exam-category-label">{breedCategories[key].label}</span>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
