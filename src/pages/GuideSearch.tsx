import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface SearchEntry {
  href: string;
  title: string;
  group: string;
  text: string;
  snippet: string;
}

const stripEmoji = (text: string) =>
  text
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

const normalize = (text: string) => stripEmoji(text).toLowerCase();

const firstSnippet = (root: Element) => {
  const paragraph = root.querySelector('p');
  if (!paragraph) return '';
  return normalize(paragraph.textContent ?? '').slice(0, 160);
};

const ALIASES: { terms: string[]; href: string }[] = [
  { terms: ['recall', 'come back', 'come when called', 'bolting', 'run away'], href: '#expectations' },
  { terms: ['sit', 'wait', 'earned access', 'nothing for free', 'consent', 'release'], href: '#pillars' },
  { terms: ['bark', 'barking', 'yap', 'fixation', 'reactive', 'reactivity'], href: '#butt-push' },
  { terms: ['jump', 'jumping', 'lunging', 'mouthing'], href: '#collar-snatch' },
  { terms: ['pulling', 'slack leash', 'heel', 'bungee', 'flexi', 'extending leash', 'fixed line', 'u dangle', 'leash dangle'], href: '#leash' },
  { terms: ['collar', 'harness', 'halter', 'gentle leader', 'halti', 'prong', 'choke chain', 'slip lead', 'flat collar', 'opposition reflex'], href: '#collar-selection' },
  { terms: ['off lead', 'off-lead', 'freedom', 'access'], href: '#access' },
  { terms: ['controlled crucible', 'fail safely', 'crucible', 'off-lead development'], href: '#controlled-crucible' },
  { terms: ['t-bone', 'over the neck', 'social friction', 'master dog', 'body block', 'antisocial'], href: '#social-friction' },
  { terms: ['treat', 'treats', 'reward', 'food motivated', 'overused treat', 'treat exploit', 'training only treat', 'reserved treat', 'not hungry', 'reward currency', 'food motivated diagnostic'], href: '#rewards' },
  { terms: ['one second', 'timing', 'association window'], href: '#timing' },
  { terms: ['door', 'doorway', 'threshold', 'front door'], href: '#front-door' },
  { terms: ['check in', 'check-in', 'seven seconds', '7 second'], href: '#check-in-seven' },
  { terms: ['anxiety', 'calm leadership', 'owner energy'], href: '#owner-mindset' },
  { terms: ['staffy', 'collie', 'breed', 'terrier'], href: '#breed-temperament' },
  { terms: ['baby talk', 'lap dog', 'eye gazing', 'pitfalls'], href: '#common-pitfalls' },
  { terms: ['panting', 'lip lick', 'shake off', 'stiffening', 'whale eye', 'body language', 'weight back', 'helicopter tail'], href: '#symptom-glossary' },
  { terms: ['3 second pause', 'three second pause', 'three-second pause', 'micro-signals'], href: '#three-second-pause' },
  { terms: ['coming home', 'home return', 'greeting', 'helicopter wag'], href: '#home-return' },
  { terms: ['sniff break', 'sniffing', 'decompress', 'heel earns'], href: '#sniff-breaks' },
  { terms: ['trust', 'advocate', 'trust not love'], href: '#trust-not-just-love' },
  { terms: ['repeat command', 'say it once', 'cue once', 'nagging', 'heard command', 'second cue', 'third repeat'], href: '#cue-once' },
  { terms: ['real world', 'generalize', 'generalisation', 'spontaneous'], href: '#expectations' },
  { terms: ['dog fight', 'dog meeting', 'socialisation', 'socialization'], href: '#dog-meetings' },
  { terms: ['trauma', 'fearful', 'shutdown'], href: '#trauma-signals' },
  { terms: ['gruff', 'squeeze', 'dog language', 'firmness', 'shocking', 'roadside', 'recall game', 'boss', 'pack boss', 'calibration', 'gruff correction', 'mouth hand'], href: '#dog-language' },
  { terms: ['unique sound', 'unique touch', 'correction mechanic', 'hey', 'clap', 'flank', 'jawbone', 'habituation'], href: '#unique-sound-touch' },
  { terms: ['daily', 'practice', 'three weeks', 'routine'], href: '#daily' },
  { terms: ['graduation', 'puppy dynamic', 'relentless'], href: '#graduation' },
  { terms: ['seven months', '7 months', 'adult dog', "i don't care", 'dont care', 'im over it'], href: '#i-dont-care' }
];

/** Walk the rendered guide DOM to build the search index (port of guide-search.js). */
function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const seen = new Set<string>();

  const addEntry = (entry: SearchEntry) => {
    const key = `${entry.href}|${entry.title}`;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push(entry);
  };

  document.querySelectorAll(".guide-contents-list a[href^='#']").forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    const title = stripEmoji(link.textContent ?? '');
    const group = stripEmoji(
      link.closest('.guide-contents-group')?.querySelector('.guide-contents-group-label')?.textContent ?? ''
    );
    const target = document.querySelector(href);

    addEntry({
      href,
      title,
      group: group || 'Contents',
      text: normalize(`${title} ${group}`),
      snippet: target ? firstSnippet(target) : ''
    });
  });

  document.querySelectorAll('.guide-section[id]').forEach((section) => {
    const href = `#${section.id}`;
    const heading = section.querySelector('h2');
    const sectionNum = section.querySelector('.section-num');
    const title = heading ? stripEmoji(heading.textContent ?? '') : section.id;
    const group = sectionNum ? stripEmoji(sectionNum.textContent ?? '') : 'Guide section';

    addEntry({
      href,
      title,
      group,
      text: normalize(`${title} ${group} ${firstSnippet(section)}`),
      snippet: firstSnippet(section)
    });

    section.querySelectorAll('h3[id]').forEach((subheading) => {
      const subHref = `#${subheading.id}`;
      const subTitle = stripEmoji(subheading.textContent ?? '');

      addEntry({
        href: subHref,
        title: subTitle,
        group: title,
        text: normalize(`${subTitle} ${title} ${group}`),
        snippet: firstSnippet(subheading.parentElement ?? section)
      });
    });
  });

  document.querySelectorAll('.guide-glossary tbody tr').forEach((row) => {
    const signal = row.querySelector('td:first-child');
    const meaning = row.querySelector('td:nth-child(2)');
    if (!signal || !meaning) return;

    const title = stripEmoji(signal.textContent ?? '');
    const snippet = normalize(meaning.textContent ?? '').slice(0, 120);

    addEntry({
      href: '#symptom-glossary',
      title: `Symptom: ${title}`,
      group: 'Symptom glossary',
      text: normalize(`${title} ${snippet} symptom glossary`),
      snippet
    });
  });

  ALIASES.forEach((alias) => {
    const entry = entries.find((item) => item.href === alias.href);
    if (!entry) return;
    entry.text += ` ${normalize(alias.terms.join(' '))}`;
  });

  return entries;
}

function scoreEntry(entry: SearchEntry, query: string): number {
  const title = normalize(entry.title);
  const text = entry.text;
  const words = query.split(/\s+/).filter(Boolean);

  let score = 0;

  if (title === query) score += 120;
  if (title.startsWith(query)) score += 90;
  if (title.includes(query)) score += 70;

  words.forEach((word) => {
    if (title.startsWith(word)) score += 40;
    else if (title.includes(word)) score += 28;
    else if (text.includes(word)) score += 16;
  });

  if (text.includes(query)) score += 24;
  if (entry.snippet.includes(query)) score += 12;

  return score;
}

export default function GuideSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const indexRef = useRef<SearchEntry[]>([]);
  const fieldRef = useRef<HTMLDivElement>(null);

  // Guide content renders synchronously before this effect, so the DOM walk
  // sees the full document — same data as the original page.
  useEffect(() => {
    indexRef.current = buildIndex();
  }, []);

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

  const getMatches = (value: string): SearchEntry[] => {
    const normalizedQuery = normalize(value);
    if (normalizedQuery.length < 2) return [];

    return indexRef.current
      .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 8)
      .map((result) => result.entry);
  };

  const matches = open ? getMatches(query) : [];

  const navigateTo = (href: string) => {
    const target = document.querySelector(href);
    if (!target) return;

    setOpen(false);
    setActiveIndex(-1);
    setQuery('');
    history.replaceState(null, '', href);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    (target as HTMLElement).setAttribute('tabindex', '-1');
    (target as HTMLElement).focus({ preventScroll: true });
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
        navigateTo(matches[activeIndex].href);
        return;
      }
      const list = getMatches(query);
      if (list[0]) navigateTo(list[0].href);
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
        <label className="visually-hidden" htmlFor="guide-search-input">Search the guide</label>
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
              <li key={`${entry.href}|${entry.title}`}>
                <button
                  type="button"
                  className="guide-search-option"
                  role="option"
                  id={`guide-search-option-${itemIndex}`}
                  aria-selected={itemIndex === activeIndex}
                  onClick={() => navigateTo(entry.href)}
                >
                  <span className="guide-search-option-title">{entry.title}</span>
                  <span className="guide-search-option-meta">{entry.group}</span>
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
