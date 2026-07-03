import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { GUIDE_SEARCH_INDEX, scoreGuideSearchEntry, type GuideSearchEntry } from '../data/guideSearchIndex';

const normalize = (text: string) =>
  text
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

function getMatches(query: string): GuideSearchEntry[] {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return [];

  return GUIDE_SEARCH_INDEX.map((entry) => ({ entry, score: scoreGuideSearchEntry(entry, normalizedQuery) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 8)
    .map((result) => result.entry);
}

export default function GuideSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (event: MouseEvent) => {
      if (fieldRef.current?.contains(event.target as Node)) return;
      setOpen(false);
      setActiveIndex(-1);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const matches = open ? getMatches(query) : [];

  const navigateTo = (to: string) => {
    setOpen(false);
    setActiveIndex(-1);
    setQuery('');
    navigate(to);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) setOpen(true);
      const list = open ? matches : getMatches(query);
      if (list.length) setActiveIndex((activeIndex + 1 + list.length) % list.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) setOpen(true);
      const list = open ? matches : getMatches(query);
      if (list.length) setActiveIndex(activeIndex <= 0 ? list.length - 1 : activeIndex - 1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && matches[activeIndex]) {
        navigateTo(matches[activeIndex].to);
        return;
      }
      const list = getMatches(query);
      if (list[0]) navigateTo(list[0].to);
      return;
    }

    if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      event.currentTarget.blur();
    }
  };

  return (
    <div className="guide-search" aria-label="Search the guide">
      <h2 className="guide-search-heading">🔍 Search the guide</h2>
      <div className="guide-search-field" ref={fieldRef}>
        <label className="visually-hidden" htmlFor="guide-search-input">
          Search the guide
        </label>
        <input
          type="text"
          id="guide-search-input"
          className="guide-search-input"
          placeholder="Try recall, butt push, front door, reactivity…"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="guide-search-results"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `guide-search-option-${activeIndex}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        <ul id="guide-search-results" className="guide-search-results" role="listbox" hidden={!open || query.trim().length < 2}>
          {matches.length === 0 ? (
            <li className="guide-search-empty" role="presentation">
              No matching sections — try recall, leash, reactivity, or front door.
            </li>
          ) : (
            matches.map((entry, itemIndex) => (
              <li key={`${entry.to}|${entry.title}`}>
                <button
                  type="button"
                  className="guide-search-option"
                  role="option"
                  id={`guide-search-option-${itemIndex}`}
                  aria-selected={itemIndex === activeIndex}
                  onClick={() => navigateTo(entry.to)}
                >
                  <span className="guide-search-option-title">{entry.title}</span>
                  <span className="guide-search-option-meta">
                    {entry.moduleTitle} · {entry.group}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      <p className="guide-search-hint">Start typing for suggestions — jump straight to the section you need.</p>
    </div>
  );
}
