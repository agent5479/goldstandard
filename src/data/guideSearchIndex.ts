import { guideHref } from '@shared/guideHref';
import { getGuideModule } from '@shared/guideModules';
import { CONTENTS_LINKS } from '../pages/guide-sections/GuideContentsNav';

export interface GuideSearchEntry {
  to: string;
  anchor: string;
  title: string;
  group: string;
  moduleTitle: string;
  text: string;
  snippet: string;
}

const stripEmoji = (text: string) =>
  text
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

const normalize = (text: string) => stripEmoji(text).toLowerCase();

const ALIASES: { terms: string[]; anchor: string }[] = [
  { terms: ['pillars', 'three pillars', 'four pillars', 'preparation', 'consistency', 'real world wins', 'gold standard rule', 'authority', 'drain the tank', 'sit', 'wait', 'nothing for free', 'consent', 'release', 'pack leader', 'pack leader energy', 'anchor energy', 'energy', 'caesar', 'cesar', 'millan', 'dogs dont lie', "dogs don't lie", 'biofeedback'], anchor: 'pillars' },
  { terms: ['owner mindset', 'anxiety', 'calm leadership', 'owner energy', 'nervous handler', 'reassurance', 'shush', "it's okay", 'subconscious baseline', 'internal thermostat', 'new baseline', 'gamified loop', 'cultural reset', 'dramatic praise', 'internal expectations'], anchor: 'owner-mindset' },
  { terms: ['subconscious shift', 'transforming standards', 'old baseline new baseline', 'self regulation walk', 'neutral accountability'], anchor: 'new-baseline' },
  { terms: ['implementing baseline', 'command follow through', 'drop dramatic praise', 'upgrade what you tolerate'], anchor: 'implementing-baseline-shift' },
  { terms: ['expectations', 'triggers', 'opportunities', 'difficult situations', 'market', 'beach', 'real world', 'generalize', 'generalisation', 'spontaneous', 'living room training'], anchor: 'expectations' },
  { terms: ['recall', 'come back', 'come when called', 'bolting', 'run away', 'bolt', 'pursuit', 'joyless', 'chase recall'], anchor: 'expectations' },
  { terms: ['go-get', 'go get recall', 'go get method', 'treat at feet', 'reserved treat recall'], anchor: 'go-get-recall' },
  { terms: ["im over it", "i'm over it", 'misbehaviour attitude', 'calm certainty', 'not negotiating', 'over it rule', 'expect you to know', 'i expect you to know'], anchor: 'im-over-it' },
  { terms: ["i don't care", 'dont care', 'adult standard', 'seven months behaviour', '7 months adult', 'puppy excuse', 'excited not excuse', 'nervous not excuse', 'adult dog'], anchor: 'i-dont-care' },
  { terms: ['trust', 'advocate', 'trust not love', 'stranger petting', 'vet fear', 'kids discomfort'], anchor: 'trust-not-just-love' },
  { terms: ['leaning', 'dependency', 'self-regulation', 'lean against', 'social regulation', 'other dogs support'], anchor: 'social-regulation' },
  { terms: ['speak aloud', 'speaking aloud', 'voice principle', 'declare expectation', 'say it aloud'], anchor: 'speaking-aloud' },
  { terms: ['repeat command', 'say it once', 'cue once', 'nagging', 'heard command', 'second cue', 'third repeat', 'ear flick', 'head turn', 'huff', 'fixation cue', 'renegotiation'], anchor: 'cue-once' },
  { terms: ['ready stance', 'athletic stance', 'pre-engaged', 'martial arts stance', 'readiness'], anchor: 'ready-stance' },
  { terms: ['dog ready stance', 'hindquarters', 'back legs', 'stiffening', 'locking eyes', 'braced rear', 'precursor', 'hips push', 'im not worried', "i'm not worried"], anchor: 'dog-ready-stance' },
  { terms: ['reading dog', 'learning edge', 'looks worse', 'cognitive overload', 'forgets commands'], anchor: 'reading-dog' },
  { terms: ['3 second pause', 'three second pause', 'three-second pause', 'micro-signals', 'before petting', 'sigh', 'decompression sigh'], anchor: 'three-second-pause' },
  { terms: ['training mode', 'living mode', 'context of contact', 'trust lean', 'demand lean', 'lean on legs', 'rest contact', 'psychology'], anchor: 'context-of-contact' },
  { terms: ['staffy', 'collie', 'breed', 'terrier', 'sighthound', 'scenthound', 'guardian', 'spitz', 'giant breed', 'small breed', 'clingy', 'herding', 'breed variance'], anchor: 'breed-temperament' },
  { terms: ['rehabilitation', 'substitution', 'substitute dont suppress', 'mouth job', 'chin command', 'nose command', 'compulsive licking', 'licky dog', 'behavioral decoupling', 'proactive guidance'], anchor: 'rehabilitation-patterns' },
  { terms: ['driver calibration', 'behavior driver', 'skill gap', 'owner dynamics', 'entitlement hardship', 'neuro stress loop'], anchor: 'behavior-driver-calibration' },
  { terms: ['pattern playbook', 'neuro pattern', 'anxious attachment', 'handler sensitive', 'barrier frustration', 'fixation loop'], anchor: 'pattern-playbook-table' },
  { terms: ['symptom index', 'self licking', 'handler licking', 'paw chewing', 'repetitive soothing', 'velcro follow', 'compulsive'], anchor: 'symptom-expression-index' },
  { terms: ['correction', 'correction toolkit', 'interruption', 'reset body'], anchor: 'corrections' },
  { terms: ['butt push', 'bark', 'barking', 'yap', 'fixation', 'reactive', 'reactivity'], anchor: 'butt-push' },
  { terms: ['pulling', 'slack leash', 'heel', 'walking position', 'walk beside'], anchor: 'leash' },
  { terms: ['off-lead', 'off lead', 'freedom', 'access training', 'earned access'], anchor: 'access' },
  { terms: ['one second', 'timing', 'association window', 'precursor', 'delayed correction'], anchor: 'timing' },
  { terms: ['treat', 'treats', 'reward', 'life rewards'], anchor: 'rewards' },
  { terms: ['door', 'doorway', 'threshold', 'front door', 'gateway'], anchor: 'front-door' },
  { terms: ['check in', 'check-in', 'seven seconds', '7 second'], anchor: 'check-in-seven' },
  { terms: ['intact large male', 'large intact', 'intact male playbook'], anchor: 'intact-large-males' },
  { terms: ['puppy phase', 'puppy toilet', 'house training puppy', 'walk-back', 'puppy jumping', 'puppy mouthing', 'puppy schedule'], anchor: 'puppy-phase' },
  { terms: ['puppy age stages', 'age appropriate puppy', 'beckman puppy', 'puppy developmental stages', 'fear period puppy', 'teething puppy months'], anchor: 'puppy-age-stages' },
  { terms: ['toilet training puppy', 'golden windows', 'puppy potty'], anchor: 'puppy-toilet-training' },
  { terms: ['puppy daily structure', 'puppy sleep schedule', '1 hour awake'], anchor: 'puppy-daily-structure' },
  { terms: ['puppy behavior design', 'ditch food bowl', 'floor treats puppy'], anchor: 'puppy-behavior-design' },
  { terms: ['puppy early security', 'sleep with puppy', 'littermate separation', 'puppy closeness'], anchor: 'puppy-early-security' },
  { terms: ['puppy feeding', 'puppy nutrition', 'puppy food bowl', 'puppy meals'], anchor: 'puppy-nutrition-access' },
  { terms: ['puppy tracking', 'puppy weight', 'puppy log', 'puppy checklist'], anchor: 'puppy-tracking' },
  { terms: ['puppy planner', 'puppy schedule generator', 'puppy day plan', 'personalised puppy schedule'], anchor: 'puppy-planner' },
];

function buildStaticIndex(): GuideSearchEntry[] {
  const entries: GuideSearchEntry[] = CONTENTS_LINKS.map((link) => {
    const moduleTitle = getGuideModule(link.moduleId).title;
    const title = stripEmoji(link.label);
    return {
      to: guideHref(link.anchor),
      anchor: link.anchor,
      title,
      group: stripEmoji(link.group),
      moduleTitle,
      text: normalize(`${title} ${link.group} ${moduleTitle}`),
      snippet: '',
    };
  });

  for (const alias of ALIASES) {
    const entry = entries.find((item) => item.anchor === alias.anchor);
    if (entry) entry.text += ` ${normalize(alias.terms.join(' '))}`;
  }

  return entries;
}

export const GUIDE_SEARCH_INDEX: GuideSearchEntry[] = buildStaticIndex();

export function scoreGuideSearchEntry(entry: GuideSearchEntry, query: string): number {
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
  return score;
}
