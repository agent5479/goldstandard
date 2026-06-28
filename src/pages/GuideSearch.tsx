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
  /* Foundation */
  { terms: ['pillars', 'three pillars', 'preparation', 'consistency', 'real world wins', 'gold standard rule', 'authority', 'drain the tank', 'sit', 'wait', 'nothing for free', 'consent', 'release'], href: '#pillars' },

  /* Owner mindset & expectations */
  { terms: ['owner mindset', 'anxiety', 'calm leadership', 'owner energy', 'nervous handler', 'reassurance', 'shush', "it's okay"], href: '#owner-mindset' },
  { terms: ['expectations', 'triggers', 'opportunities', 'difficult situations', 'market', 'beach', 'real world', 'generalize', 'generalisation', 'spontaneous', 'living room training'], href: '#expectations' },
  { terms: ['recall', 'come back', 'come when called', 'bolting', 'run away', 'bolt', 'pursuit', 'joyless', 'chase recall'], href: '#expectations' },
  { terms: ['go-get', 'go get recall', 'go get method', 'treat at feet', 'reserved treat recall'], href: '#go-get-recall' },
  { terms: ["im over it", "i'm over it", 'misbehaviour attitude', 'calm certainty', 'not negotiating', 'over it rule', 'expect you to know', 'i expect you to know'], href: '#im-over-it' },
  { terms: ["i don't care", 'dont care', 'adult standard', 'seven months behaviour', '7 months adult', 'puppy excuse', 'excited not excuse', 'nervous not excuse', 'adult dog'], href: '#i-dont-care' },
  { terms: ['trust', 'advocate', 'trust not love', 'stranger petting', 'vet fear', 'kids discomfort'], href: '#trust-not-just-love' },
  { terms: ['leaning', 'dependency', 'self-regulation', 'lean against', 'social regulation', 'other dogs support'], href: '#social-regulation' },
  { terms: ['speak aloud', 'speaking aloud', 'voice principle', 'declare expectation', 'say it aloud'], href: '#speaking-aloud' },
  { terms: ['repeat command', 'say it once', 'cue once', 'nagging', 'heard command', 'second cue', 'third repeat', 'ear flick', 'head turn', 'huff', 'fixation cue', 'renegotiation'], href: '#cue-once' },
  { terms: ['ready stance', 'athletic stance', 'pre-engaged', 'martial arts stance', 'readiness'], href: '#ready-stance' },
  { terms: ['dog ready stance', 'hindquarters', 'back legs', 'stiffening', 'locking eyes', 'braced rear', 'precursor', 'hips push', 'im not worried', "i'm not worried"], href: '#dog-ready-stance' },

  /* Reading your dog */
  { terms: ['reading dog', 'learning edge', 'looks worse', 'cognitive overload', 'forgets commands'], href: '#reading-dog' },
  { terms: ['3 second pause', 'three second pause', 'three-second pause', 'micro-signals', 'before petting', 'sigh', 'decompression sigh'], href: '#three-second-pause' },
  { terms: ['training mode', 'living mode', 'context of contact', 'trust lean', 'demand lean', 'lean on legs', 'rest contact', 'psychology'], href: '#context-of-contact' },
  { terms: ['understanding', 'leadership', 'social needs', 'training theme'], href: '#guide-theme-understanding' },
  { terms: ['staffy', 'collie', 'breed', 'terrier', 'sighthound', 'scenthound', 'guardian', 'spitz', 'giant breed', 'small breed', 'clingy', 'herding', 'breed variance'], href: '#breed-temperament' },
  { terms: ['age intensity', 'breed age', 'puppy correction', 'adolescent testing', 'trauma calibration', 'how hard', 'volume of hand'], href: '#breed-age-intensity' },
  { terms: ['baby talk', 'lap dog', 'eye gazing', 'pitfalls', 'human baby', 'carrying', 'hand feeding', 'cute excuse'], href: '#common-pitfalls' },
  { terms: ['panting', 'lip lick', 'shake off', 'stiffening', 'whale eye', 'body language', 'weight back', 'helicopter tail', 'play bow', 'prayer position', 'pancreatitis', 'mounting', 'freeze', 'symptom', 'tail tucked', 'submissive urination', 'eye contact dogs', 'demanding paw', 'pawing', 'sass', 'guilt trap'], href: '#symptom-glossary' },
  { terms: ['trauma', 'fearful', 'shutdown', 'flinching', 'cowering', 'refusing food'], href: '#trauma-signals' },
  { terms: ['pack guarding', 'bathroom follow', 'bathroom dog', 'evolutionary guard', 'elimination guard'], href: '#pack-guarding' },
  { terms: ['dog fight', 'dog meeting', 'socialisation', 'socialization', 'rumble', 'negotiation', 'disengage'], href: '#dog-meetings' },
  { terms: ['leash dog meeting', 'three years', 'social maturity', 'intact male', 'greeting leash', 'dog meeting leash'], href: '#dog-meetings-leash' },
  { terms: ['dominance navigation', 'dominance culture', 'antisocial dominance', 'rank learning', 'navigate dominance'], href: '#dominance-navigation' },
  { terms: ['other dog braced', 'vulnerable rear', 'redirect vulnerable', 'other dog ready stance', 'exposed hindquarters'], href: '#other-dog-ready-stance' },
  { terms: ['intact dog', 'muzzle', 'muzzled', 'terrier meeting', 'unleashed intact', 'off leash intact'], href: '#intact-muzzle-protocol' },
  { terms: ['intact large male', 'large intact', 'untrained male', 'intact male playbook', '47kg', '47 kg', 'powerful intact', 'testosterone rank'], href: '#intact-large-males' },
  { terms: ['sentinel path', 'containment path', 'socialite path', 'three paths', 'intact mastery', 'desexing path', 'neuter path', 'lifestyle crossroads'], href: '#intact-three-paths' },
  { terms: ['german wirehaired pointer', 'wirehaired pointer', 'gwhp'], href: '#intact-large-males' },
  { terms: ['t-bone', 'over the neck', 'social friction', 'body block', 'invasive sniffing', 'micro signals', 'locked stare dogs'], href: '#social-friction' },
  { terms: ['master dog', 'balancer', 'facilitated socialisation', 'silent authority', 'dog teacher'], href: '#master-dog' },

  /* Corrections toolkit */
  { terms: ['correction', 'correction toolkit', 'interruption', 'reset body'], href: '#corrections' },
  { terms: ['unique sound', 'unique touch', 'correction mechanic', 'hey', 'clap', 'flank', 'jawbone', 'habituation', 'table paw'], href: '#unique-sound-touch' },
  { terms: ['gruff', 'squeeze', 'dog language', 'firmness', 'shocking', 'boss', 'pack boss', 'calibration', 'gruff correction', 'mouth hand', 'hand as mouth'], href: '#dog-language' },
  { terms: ['not a game', 'someone boss', 'boundary negotiation game', 'pack boss'], href: '#not-a-game' },
  { terms: ['life and death', 'life-and-death', 'roadside', 'when firmer', 'high stakes correction', 'recall game', 'boundary negotiation recall'], href: '#when-firmer' },
  { terms: ['when not firmer', 'trauma correction', 'venting', 'angry correction', 'exhausted handler'], href: '#when-not-firmer' },
  { terms: ['correction intensity', 'calibrate firmness', 'soft dog', 'hard dog', 'delivery volume'], href: '#correction-intensity' },
  { terms: ['escalation ladder', 'verbal pop ladder', 'shocking squeeze ladder', 'collar grab ladder'], href: '#escalation-ladder' },
  { terms: ['bark', 'barking', 'yap', 'fixation', 'reactive', 'reactivity', 'in place', 'butt push', 'hindquarters'], href: '#butt-push' },
  { terms: ['leash jerk', 'downward jerk', 'downward pull', 'slack after jerk'], href: '#leash-jerk' },
  { terms: ['verbal correction', 'verbal pop', 'bark command', 'tsht', 'never repeat louder', 'correction bark'], href: '#verbal-correction' },
  { terms: ['jump', 'jumping', 'lunging', 'mouthing', 'collar grab', 'collar snatch', 'forced sit', 'walk backwards', 'jumping up'], href: '#collar-snatch' },
  { terms: ['pin and hold', 'pin hold', 'advanced correction', 'sessions only', 'improvise pin'], href: '#pin-hold' },

  /* Equipment & leash */
  { terms: ['collar', 'slip lead', 'flat collar', 'collar selection', 'pressure release'], href: '#collar-selection' },
  { terms: ['head halter', 'halti', 'gentle leader', 'halter exception', 'safety brake'], href: '#head-halter' },
  { terms: ['harness', 'prong', 'choke chain', 'spiked collar', 'collars excluded', 'chest harness', 'opposition reflex', 'bungee'], href: '#collars-excluded' },
  { terms: ['pulling', 'slack leash', 'heel', 'walking position', 'walk beside', 'walk behind', 'stick assist', 'rural road walk', 'surge ahead'], href: '#leash' },
  { terms: ['flexi', 'extending leash', 'fixed line', 'leash selection', 'biothane', 'long line'], href: '#leash-selection' },
  { terms: ['u dangle', 'leash dangle', 'line weight', 'u shape', 'slack information', 'dashboard dangle'], href: '#leash-weight' },
  { terms: ['leash handling', 'low line', 'biomechanical', 'hand position', 'below neck', 'corrective tug'], href: '#leash-handling' },
  { terms: ['sniff break', 'sniffing', 'pee break', 'toilet break', 'decompress', 'heel earns', 'proactive sniff', 'sniff threshold', 'scent break', 'nose led walk'], href: '#sniff-breaks' },
  { terms: ['distraction processing', 'look at distraction', 'self regulate distraction', 'fixation window', 'process distraction'], href: '#distraction-processing' },

  /* Access, off-lead & road safety */
  { terms: ['off lead', 'off-lead', 'freedom', 'access training', 'earned access', 'leash on disappointed', 'misbehaviour costs access', 'continued perfection', 'failure leash time', 'baseline expectation', 'learned accountability'], href: '#access' },
  { terms: ['baseline', 'act right without being told', 'not constant bribery', 'natural baseline heel', 'micromanage heel'], href: '#baseline-expectation' },
  { terms: ['gamify', 'constant heel', 'repeating heel', 'running commentary', 'beg for cues', 'treat every step'], href: '#cue-once' },
  { terms: ['sphere of influence', 'choice to leave', 'stop the walk', 'fifteen stops', 'own walk', 'leash accountability', 'voluntary check in'], href: '#leash-accountability' },
  { terms: ['place of reinforcement', 'treat marking', 'distance treat', 'look away treat', 'window closed treat', 'handler reinforcement'], href: '#treat-handler-reinforcement' },
  { terms: ['controlled crucible', 'fail safely', 'crucible', 'off-lead development', 'safe failure', 'social development'], href: '#controlled-crucible' },
  { terms: ['off-lead intervention', 'off lead antisocial', 'antisocial off lead', 'sound then leash', 'leash back on off lead'], href: '#off-lead-intervention' },
  { terms: ['road safety', 'traffic', 'rural nz', 'new zealand road', 'zero tolerance traffic', 'absolute boundary', 'sealed road', 'stock truck', 'fatal mistake'], href: '#road-safety' },
  { terms: ['semantic hijacking', 'car cue', 'car word', 'repurpose car', 'high intent alert', 'car enthusiasm'], href: '#semantic-hijacking' },
  { terms: ['car protocol', 'car!', 'off pavement', 'gutter sit', 'gutter', 'verge', 'auditory tracking', 'evacuate', 'anchor sit', 'vehicle passes', 'gravel shoulder'], href: '#car-protocol' },
  { terms: ['seven month road', 'road seven months', 'road crucible', 'leashed traffic', 'traffic conditioning', 'on lead traffic', 'off lead near road', 'months before off lead road'], href: '#road-seven-months' },

  /* Rewards & timing */
  { terms: ['one second', 'timing', 'association window', 'precursor', 'delayed correction', 'missed window'], href: '#timing' },
  { terms: ['treat', 'treats', 'reward', 'life rewards', 'good boy mistake', 'praise reactive'], href: '#rewards' },
  { terms: ['food motivated', 'overused treat', 'treat exploit', 'training only treat', 'reserved treat', 'not hungry', 'treat diagnostic', 'dried liver', 'appetite'], href: '#treat-diagnostic' },
  { terms: ['orientation signals', 'reward currency', 'access oriented', 'play reward', 'social reward', 'not food motivated', 'sniff currency'], href: '#orientation-signals' },

  /* Outings & consolidation */
  { terms: ['door', 'doorway', 'threshold', 'front door', 'gateway', 'car boot', 'yard gate', 'surge door'], href: '#front-door' },
  { terms: ['coming home', 'home return', 'greeting', 'helicopter wag', 'sixty seconds', 'four paws', 'ignore greeting'], href: '#home-return' },
  { terms: ['check in', 'check-in', 'seven seconds', '7 second', 'hide tactic', 'glance back', 'pack check'], href: '#check-in-seven' },
  { terms: ['daily', 'practice', 'three weeks', 'routine', 'ten minutes', 'every walk'], href: '#daily' },
  { terms: ['graduation', 'puppy dynamic', 'relentless', 'mixed messages', 'family members', 'partner excuses'], href: '#graduation' }
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
