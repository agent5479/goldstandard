import { useEffect, useRef, useState } from 'react';
import { breedCategories, breeds } from '../../data/breeds';
import type { Breed, BreedCategory } from '../../data/breeds';

interface BreedPickerProps {
  onSelect: (category: BreedCategory, breedName: string | null) => void;
  onBack: () => void;
}

function filterBreeds(query: string): Breed[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return breeds.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 8);
}

export default function BreedPicker({ onSelect, onBack }: BreedPickerProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const matches = filterBreeds(query);
  const categoryKeys = Object.keys(breedCategories) as BreedCategory[];

  return (
    <section className="exam-step" id="exam-breed" aria-labelledby="exam-breed-heading">
      <h2 id="exam-breed-heading">🐕 What breed is your dog?</h2>
      <p className="exam-step-desc">Your breed shapes which questions you get — temperament changes how the method is delivered, not the standard itself.</p>
      <div className="exam-breed-search">
        <label className="visually-hidden" htmlFor="breed-search-input">Search breeds</label>
        <input
          type="text"
          id="breed-search-input"
          className="exam-breed-input"
          placeholder="Start typing — Border Collie, Staffy, Huntaway…"
          autoComplete="off"
          role="combobox"
          aria-expanded={matches.length > 0}
          aria-controls="breed-search-results"
          aria-autocomplete="list"
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (matches.length > 0) onSelect(matches[0].category, matches[0].name);
            }
          }}
        />
        <ul id="breed-search-results" className="exam-breed-results" role="listbox" hidden={matches.length === 0}>
          {matches.map((b) => (
            <li key={b.name} role="option" aria-selected={false}>
              <button type="button" className="exam-breed-result" onClick={() => onSelect(b.category, b.name)}>
                <span className="exam-breed-name">{b.name}</span>
                <span className="exam-breed-cat">{breedCategories[b.category].label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="exam-breed-or">Mixed breed, or not on the list? Choose the closest temperament:</p>
      <div className="exam-category-cards" id="exam-category-cards">
        {categoryKeys.map((key) => (
          <button type="button" className="exam-category-card" key={key} onClick={() => onSelect(key, null)}>
            <span className="exam-category-label">{breedCategories[key].label}</span>
            <span className="exam-category-note">{breedCategories[key].note}</span>
          </button>
        ))}
      </div>
      <button className="btn btn-secondary exam-back-btn" type="button" onClick={onBack}>← Back</button>
    </section>
  );
}
