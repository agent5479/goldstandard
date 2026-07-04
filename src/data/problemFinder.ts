import { BOOKING_CONCERN_TO_TAGS } from '@shared/clientBookingTags';
import { PUPPY_PHASE_NAV_LINKS } from '../pages/guide-sections/GuideContentsNav';
import type { NeuroPattern } from './breedTraits';
import type { BehaviorDriver } from './behaviorDrivers';

export const PUPPY_PHASE_ANCHORS = new Set(PUPPY_PHASE_NAV_LINKS.map((link) => link.anchor));

export type ProblemContextId = 'walks' | 'home' | 'social' | 'basics';
export type ProblemOutcomeId =
  | 'pull_lead'
  | 'recall'
  | 'leash_reactive'
  | 'barking'
  | 'jumping'
  | 'anxious'
  | 'separation'
  | 'doors_guests'
  | 'impulse'
  | 'yard_boundaries'
  | 'puppy'
  | 'dog_issues'
  | 'obedience'
  | 'repetitive_soothing';

export type ImpactLevel = 1 | 2 | 3 | 4 | 5;

export interface ProblemGuideLink {
  anchor: string;
  label: string;
}

export interface ProblemOutcome {
  id: ProblemOutcomeId;
  label: string;
  summary: string;
  urgencyNotes: Record<ImpactLevel, string>;
  guideLinks: ProblemGuideLink[];
  bookingTags: string[];
  neuroPatternHints?: NeuroPattern[];
  symptomExpressionHints?: string[];
  driverConsiderations?: BehaviorDriver[];
}

export interface ProblemContext {
  id: ProblemContextId;
  label: string;
  description: string;
  outcomeIds: ProblemOutcomeId[];
}

export const IMPACT_LABELS: Record<ImpactLevel, string> = {
  1: 'Minor annoyance',
  2: 'Noticeable but manageable',
  3: 'Affecting daily life',
  4: 'Stressful or embarrassing in public',
  5: 'Safety concern or hard to live with',
};

const tagsFor = (concernId: keyof typeof BOOKING_CONCERN_TO_TAGS): string[] =>
  [...(BOOKING_CONCERN_TO_TAGS[concernId] ?? [])];

export const PROBLEM_OUTCOMES: Record<ProblemOutcomeId, ProblemOutcome> = {
  pull_lead: {
    id: 'pull_lead',
    label: 'Pulling on the lead',
    summary:
      'A dog that drags you down the street is usually telling you they do not yet see you as the one setting pace and direction. With the right collar, leash mechanics, and clear accountability, walks become calm and predictable — often faster than people expect.',
    urgencyNotes: {
      1: 'Even a light pull is worth fixing early — it is easier before it becomes a habit.',
      2: 'You are not alone; most owners start here, and structure fixes it quickly.',
      3: 'When every walk feels like a battle, targeted leash work restores enjoyment for both of you.',
      4: 'Public embarrassment on walks is common — and very workable with consistent standards.',
      5: 'Strong pullers can be a safety risk; firm leash accountability and collar choice matter here.',
    },
    guideLinks: [
      { anchor: 'leash', label: 'Leash accountability' },
      { anchor: 'collar-selection', label: 'Collar selection' },
      { anchor: 'leash-handling', label: 'Leash handling' },
    ],
    bookingTags: tagsFor('pull_lead'),
  },
  recall: {
    id: 'recall',
    label: "Won't come when called",
    summary:
      'Recall is not a trick — it is trust that you will follow through when it matters. Building a reliable come-when-called starts with clear expectations, the right reward timing, and proofing in real-world situations.',
    urgencyNotes: {
      1: 'A patchy recall is normal; tightening structure now prevents bigger problems later.',
      2: 'Inconsistent recall usually means the dog has learned coming back is optional.',
      3: 'When you cannot trust them off-lead, access and freedom stay limited — that can change.',
      4: 'Being the person shouting in the park is frustrating; clear standards fix the pattern.',
      5: 'Bolting or ignoring recall near roads is a serious safety issue — prioritise this with Warwick.',
    },
    guideLinks: [
      { anchor: 'expectations', label: 'Real-world expectations' },
      { anchor: 'go-get-recall', label: 'Go-get recall method' },
      { anchor: 'road-safety', label: 'Road safety' },
    ],
    bookingTags: tagsFor('recall'),
  },
  leash_reactive: {
    id: 'leash_reactive',
    label: 'Lunging or reactive on walks',
    summary:
      'Reactivity on lead often looks like aggression but is frequently frustration, fixation, or unclear boundaries. Interrupting the pattern, resetting body language, and teaching calm accountability on the leash are the foundation.',
    urgencyNotes: {
      1: 'Early lunging or staring is worth addressing before it escalates.',
      2: 'Reactive moments on walks are common — structure reduces the frequency quickly.',
      3: 'When walks are avoided because of reactions, targeted work restores confidence.',
      4: 'Public incidents are embarrassing and stressful; you are not failing — the dog needs clearer leadership.',
      5: 'Serious reactivity near triggers needs structured intervention; do not wait this out alone.',
    },
    guideLinks: [
      { anchor: 'butt-push', label: 'Fixation and reactivity interruption' },
      { anchor: 'leash', label: 'Leash accountability' },
      { anchor: 'dog-meetings-leash', label: 'Dog meetings on leash' },
    ],
    bookingTags: tagsFor('leash_reactive'),
    neuroPatternHints: ['barrier_frustration', 'fixation_loop'],
    symptomExpressionHints: ['barrier_lunge', 'stare_lock_trigger'],
    driverConsiderations: ['entitlement_hardship', 'breed_expression', 'trauma_security'],
  },
  barking: {
    id: 'barking',
    label: 'Barking or vocal behaviour',
    summary:
      'Excessive barking is usually the dog practising a job you did not assign — alerting, demanding attention, or rehearsing arousal. Clear interruption, earned quiet, and consistent standards reduce vocal habits without suppressing normal communication.',
    urgencyNotes: {
      1: 'Occasional barking is normal; persistent patterns are what we shape.',
      2: 'Frequent yapping at home or on walks responds well to structured interruption.',
      3: 'When barking disrupts daily life or neighbours, it is time for a clear plan.',
      4: 'Public barking or embarrassment in shared spaces is workable with consistent correction.',
      5: 'Non-stop or aggressive vocalising needs firm structure — Warwick can calibrate the approach.',
    },
    guideLinks: [
      { anchor: 'butt-push', label: 'Barking and fixation interruption' },
      { anchor: 'verbal-correction', label: 'Verbal correction' },
      { anchor: 'access', label: 'Earned access and calm standards' },
    ],
    bookingTags: tagsFor('barking'),
  },
  jumping: {
    id: 'jumping',
    label: 'Jumping up on people',
    summary:
      'Jumping is a greeting habit the dog has been allowed to rehearse. Teaching a calm default at thresholds and greetings — with clear correction and follow-through — replaces excitement with manners visitors will notice.',
    urgencyNotes: {
      1: 'Puppy jumping is common; fixing it early saves years of repetition.',
      2: 'Jumping on family is annoying but very fixable with consistent standards.',
      3: 'When guests cannot visit comfortably, greeting structure becomes a priority.',
      4: 'Embarrassing jumps on strangers in public respond quickly to collar and accountability work.',
      5: 'Large or forceful jumpers can knock people over — address this with clear physical boundaries.',
    },
    guideLinks: [
      { anchor: 'collar-snatch', label: 'Jumping and collar snatch' },
      { anchor: 'front-door', label: 'Front door protocol' },
      { anchor: 'access', label: 'Earned access' },
    ],
    bookingTags: tagsFor('jumping'),
    neuroPatternHints: ['frenetic_arousal'],
    symptomExpressionHints: ['helicopter_greeting', 'nudge_mouth_bump'],
    driverConsiderations: ['owner_dynamics', 'entitlement_hardship', 'age_development'],
  },
  anxious: {
    id: 'anxious',
    label: 'Anxious or fearful',
    summary:
      'Fear and anxiety are not fixed traits — they are responses that change with calm leadership, predictable structure, and calibrated correction. Understanding whether you are seeing true trauma or rehearsed worry helps set the right pace.',
    urgencyNotes: {
      1: 'Mild nervousness often improves as the dog learns you are a steady leader.',
      2: 'Noticeable fear on walks or at home benefits from structure before it becomes entrenched.',
      3: 'When anxiety limits where you can go or what you can do, targeted rehabituation helps.',
      4: 'A dog that embarrasses or worries you in public still needs advocacy, not pity — clarity helps.',
      5: 'Severe fear, shutdown, or panic needs careful calibration; Warwick will match intensity to the dog.',
    },
    guideLinks: [
      { anchor: 'symptom-glossary', label: 'Reading stress signals' },
      { anchor: 'trauma-signals', label: 'Trauma vs everyday fear' },
      { anchor: 'behavior-driver-calibration', label: 'Driver calibration' },
      { anchor: 'rehabilitation-patterns', label: 'Rehabilitation patterns' },
      { anchor: 'owner-mindset', label: 'Calm handler mindset' },
    ],
    bookingTags: tagsFor('anxious'),
    neuroPatternHints: ['handler_sensitive', 'fear_reactive', 'hyper_vigilant'],
    symptomExpressionHints: ['whale_eye_handler', 'lip_lick_displacement', 'submissive_urination_greeting'],
    driverConsiderations: ['trauma_security', 'owner_dynamics', 'skill_gap'],
  },
  separation: {
    id: 'separation',
    label: 'Distress when left alone',
    summary:
      'Separation distress often reflects unclear pack structure and rehearsed panic. Building independence through earned access, calm departures, and consistent expectations reduces clingy or destructive alone-time behaviour.',
    urgencyNotes: {
      1: 'Mild whining when you leave can be shaped before it becomes a full pattern.',
      2: 'Regular distress signals mean the dog has not learned alone-time is normal yet.',
      3: 'When you cannot leave the house comfortably, separation structure is the focus.',
      4: 'Destructive or noisy alone behaviour affects neighbours and your peace of mind — it is fixable.',
      5: 'Severe panic, self-harm, or escape attempts need structured intervention soon.',
    },
    guideLinks: [
      { anchor: 'access', label: 'Earned access and independence' },
      { anchor: 'social-regulation', label: 'Reducing dependency' },
      { anchor: 'daily', label: 'Daily structure' },
    ],
    bookingTags: tagsFor('separation'),
    neuroPatternHints: ['separation'],
    symptomExpressionHints: ['vocal_demand_alone', 'destructive_outburst'],
    driverConsiderations: ['skill_gap', 'owner_dynamics'],
  },
  doors_guests: {
    id: 'doors_guests',
    label: 'Door and visitor behaviour',
    summary:
      'Chaos at the door — barking, rushing, jumping on guests — is one of the most common owner frustrations. Threshold work, front-door protocol, and clear accountability turn arrivals into calm, predictable events.',
    urgencyNotes: {
      1: 'Excitement at the door is normal; teaching a calm default early pays off.',
      2: 'Regular door chaos is a training gap, not a personality flaw.',
      3: 'When you dread visitors arriving, front-door structure should be top priority.',
      4: 'Embarrassing greetings make social life harder — guests will notice the change quickly.',
      5: 'Dogs that bolt through doors or mob guests create safety risks — firm thresholds matter.',
    },
    guideLinks: [
      { anchor: 'front-door', label: 'Front door protocol' },
      { anchor: 'access', label: 'Earned access' },
      { anchor: 'collar-snatch', label: 'Jumping and greetings' },
    ],
    bookingTags: tagsFor('doors_guests'),
  },
  impulse: {
    id: 'impulse',
    label: 'Stealing food or rushing doors',
    summary:
      'Impulse problems — counter-surfing, bolting through doors, snatching — mean the dog has learned boundaries are negotiable. Clear interruption, nothing-for-free standards, and follow-through rebuild self-control.',
    urgencyNotes: {
      1: 'Occasional snatching is a habit worth interrupting early.',
      2: 'Regular food stealing or door dashing responds to consistent impulse work.',
      3: 'When impulse behaviour disrupts meals or daily routines, structure becomes essential.',
      4: 'Public snatching or door bolting is embarrassing and preventable with clear standards.',
      5: 'Dangerous dashing near roads or aggressive resource guarding needs immediate attention.',
    },
    guideLinks: [
      { anchor: 'access', label: 'Earned access and impulse' },
      { anchor: 'pillars', label: 'Foundation pillars' },
      { anchor: 'road-safety', label: 'Road and threshold safety' },
    ],
    bookingTags: tagsFor('impulse'),
    symptomExpressionHints: ['destructive_outburst'],
    driverConsiderations: ['entitlement_hardship', 'skill_gap'],
  },
  yard_boundaries: {
    id: 'yard_boundaries',
    label: 'Keeping them in the yard',
    summary:
      'Staying on your property is a combination of recall, respect for boundaries, and earned freedom — not just fencing. Building reliable containment behaviour means the dog understands where their world ends and yours begins.',
    urgencyNotes: {
      1: 'Occasional boundary testing is normal; clear standards prevent it becoming a habit.',
      2: 'A dog that wanders the property line needs clearer access rules and recall proofing.',
      3: 'When you cannot trust them in the yard, freedom and peace of mind are limited.',
      4: 'Chasing passers-by or escaping in front of neighbours is stressful — and very workable.',
      5: 'Dogs that bolt from the property create serious safety risks — prioritise boundary and recall work.',
    },
    guideLinks: [
      { anchor: 'access', label: 'Earned access and boundaries' },
      { anchor: 'expectations', label: 'Real-world proofing' },
      { anchor: 'go-get-recall', label: 'Recall foundations' },
    ],
    bookingTags: ['access_priority', 'recall_priority'],
  },
  puppy: {
    id: 'puppy',
    label: 'Puppy or adolescent basics',
    summary:
      'Young dogs need establishment before adult standards — toilet training, daily rhythm, hunger-driven behavioral design, and check-in conditioning. Structure the environment so the right choice is easy before problems become entrenched habits.',
    urgencyNotes: {
      1: 'Early weeks are the easiest time to set standards that last a lifetime.',
      2: 'Adolescent testing is normal; consistent structure gets you through it cleanly.',
      3: 'When puppy chaos is overwhelming daily life, a focused foundation plan helps.',
      4: 'An out-of-control adolescent in public is common — and responds fast to clear leadership.',
      5: 'Biting, bolting, or dangerous puppy behaviour needs firm calibration from the start.',
    },
    guideLinks: [
      { anchor: 'eight-week-separation', label: '8-week separation' },
      { anchor: 'rewards', label: 'Rewards and hunger setup' },
      { anchor: 'breed-age-intensity', label: 'Age × temperament' },
    ],
    bookingTags: tagsFor('puppy'),
  },
  dog_issues: {
    id: 'dog_issues',
    label: 'Issues with other dogs',
    summary:
      'Dog-to-dog problems range from over-excitement to genuine reactivity. Reading social signals, managing meetings on and off leash, and teaching disengagement give your dog a calmer social world.',
    urgencyNotes: {
      1: 'Rough play or over-greeting is common — early structure prevents escalation.',
      2: 'Regular friction with other dogs benefits from clearer social rules.',
      3: 'When you avoid other dogs entirely, reactivity work can reopen that world.',
      4: 'Public incidents with other dogs are stressful; you need a plan, not avoidance.',
      5: 'Fights or serious aggression toward dogs need structured intervention — do not manage this alone.',
    },
    guideLinks: [
      { anchor: 'dog-meetings', label: 'Dog meetings' },
      { anchor: 'dog-meetings-leash', label: 'Meetings on leash' },
      { anchor: 'butt-push', label: 'Reactivity interruption' },
    ],
    bookingTags: tagsFor('dog_issues'),
    driverConsiderations: ['social_dominance', 'age_development'],
  },
  obedience: {
    id: 'obedience',
    label: 'General obedience and manners',
    summary:
      'Sit, wait, heel, attention on the handler — these are not tricks but the language of daily life. When basics are inconsistent, everything else is harder. Clear structure and follow-through make manners reliable.',
    urgencyNotes: {
      1: 'Patchy obedience is a great place to start — small wins compound quickly.',
      2: 'Inconsistent commands usually mean the dog has learned cues are optional.',
      3: 'When daily life feels chaotic because basics are missing, foundations are the priority.',
      4: 'A dog that ignores you in public reflects a training gap, not a lost cause.',
      5: 'Dangerous disobedience near roads or in high-stakes moments needs urgent structure.',
    },
    guideLinks: [
      { anchor: 'pillars', label: 'Foundation pillars' },
      { anchor: 'cue-once', label: 'Say it once' },
      { anchor: 'daily', label: 'Daily structure' },
    ],
    bookingTags: tagsFor('obedience'),
    driverConsiderations: ['skill_gap'],
  },
  repetitive_soothing: {
    id: 'repetitive_soothing',
    label: 'Repetitive licking, chewing, or self-soothing',
    summary:
      'Compulsive licking of handler or self, paw chewing, and similar repetitive soothing — often insecurity endorphin release, not defiance. Route through driver calibration, then the symptom index for handler vs self variants.',
    urgencyNotes: {
      1: 'Occasional licking is normal; persistent loops worth addressing with substitution, not repeated Stop.',
      2: 'Handler-licking and self-licking need different decoupling rules — identify the target first.',
      3: 'When soothing behaviours disrupt daily contact or sleep, substitution playbook applies after driver check.',
      4: 'Embarrassing or constant licking in public — workable once drivers and pattern are identified.',
      5: 'Self-lick with bald patches or hot spots — vet rule-out before behavioural plan alone.',
    },
    guideLinks: [
      { anchor: 'behavior-driver-calibration', label: 'Driver calibration' },
      { anchor: 'symptom-expression-index', label: 'Symptom expression index' },
      { anchor: 'case-compulsive-licking', label: 'Worked example: handler licking' },
      { anchor: 'rehabilitation-patterns', label: 'Rehabilitation patterns' },
    ],
    bookingTags: ['anxious', 'rehabituation'],
    neuroPatternHints: ['anxious_attachment', 'handler_sensitive', 'frustration_reactive'],
    symptomExpressionHints: [
      'compulsive_lick_handler',
      'compulsive_lick_self',
      'repetitive_paw_chew',
      'compulsive_lick_environment',
    ],
    driverConsiderations: ['entitlement_hardship', 'breed_expression', 'owner_dynamics', 'trauma_security'],
  },
};

export const PROBLEM_CONTEXTS: ProblemContext[] = [
  {
    id: 'walks',
    label: 'On walks or out in public',
    description: 'Lead pulling, recall, reactivity, or embarrassment when you are out and about.',
    outcomeIds: ['pull_lead', 'recall', 'leash_reactive', 'dog_issues'],
  },
  {
    id: 'home',
    label: 'At home',
    description: 'Barking, doors, visitors, separation, yard boundaries, or impulse indoors.',
    outcomeIds: ['barking', 'doors_guests', 'separation', 'yard_boundaries', 'impulse', 'repetitive_soothing'],
  },
  {
    id: 'social',
    label: 'Around people or other dogs',
    description: 'Jumping on guests, anxiety, repetitive soothing, or trouble with other dogs in social situations.',
    outcomeIds: ['jumping', 'anxious', 'dog_issues', 'leash_reactive', 'repetitive_soothing'],
  },
  {
    id: 'basics',
    label: 'New dog or general basics',
    description: 'Puppy foundations, adolescent testing, or general manners and obedience.',
    outcomeIds: ['puppy', 'obedience', 'recall'],
  },
];

export function getContextById(id: ProblemContextId): ProblemContext {
  const context = PROBLEM_CONTEXTS.find((entry) => entry.id === id);
  if (!context) throw new Error(`Unknown problem context: ${id}`);
  return context;
}

export function getOutcomeById(id: ProblemOutcomeId): ProblemOutcome {
  const outcome = PROBLEM_OUTCOMES[id];
  if (!outcome) throw new Error(`Unknown problem outcome: ${id}`);
  return outcome;
}

export function getOutcomesForContext(contextId: ProblemContextId): ProblemOutcome[] {
  return getContextById(contextId).outcomeIds.map((id) => getOutcomeById(id));
}

export function buildBookingPrioritiesUrl(bookingTags: string[]): string {
  const priorities = bookingTags.filter((tag) => tag.endsWith('_priority'));
  if (priorities.length === 0) return '/book';
  return `/book?priorities=${priorities.join(',')}`;
}

export const PROBLEM_FINDER_HANDOFF_KEY = 'gsdt_problem_finder_handoff';
export const PROBLEM_FINDER_HANDOFF_TTL_MS = 60 * 60 * 1000;

export interface ProblemFinderHandoff {
  message: string;
  outcomeIds: ProblemOutcomeId[];
  contextId: ProblemContextId;
  impact: ImpactLevel;
  createdAt: number;
}

export function toggleProblemOutcome(
  ids: ProblemOutcomeId[],
  id: ProblemOutcomeId,
): ProblemOutcomeId[] {
  return ids.includes(id) ? ids.filter((entry) => entry !== id) : [...ids, id];
}

export function mergeOutcomes(ids: ProblemOutcomeId[]): ProblemOutcome[] {
  return ids.map((id) => getOutcomeById(id));
}

export function mergeGuideLinks(outcomes: ProblemOutcome[]): ProblemGuideLink[] {
  const seen = new Set<string>();
  const links: ProblemGuideLink[] = [];
  for (const outcome of outcomes) {
    for (const link of outcome.guideLinks) {
      if (seen.has(link.anchor)) continue;
      seen.add(link.anchor);
      links.push(link);
    }
  }
  return links;
}

export function shouldShowPuppyNav(outcomeIds: ProblemOutcomeId[]): boolean {
  return outcomeIds.includes('puppy');
}

export function mergeGuideLinksForResults(outcomeIds: ProblemOutcomeId[]): ProblemGuideLink[] {
  const links = mergeGuideLinks(mergeOutcomes(outcomeIds));
  if (!shouldShowPuppyNav(outcomeIds)) return links;
  return links.filter((link) => !PUPPY_PHASE_ANCHORS.has(link.anchor));
}

export function mergeBookingTags(outcomes: ProblemOutcome[]): string[] {
  const tags = new Set<string>();
  for (const outcome of outcomes) {
    for (const tag of outcome.bookingTags) tags.add(tag);
  }
  return [...tags];
}

export function mergeDriverConsiderations(outcomes: ProblemOutcome[]): BehaviorDriver[] {
  const seen = new Set<BehaviorDriver>();
  const drivers: BehaviorDriver[] = [];
  for (const outcome of outcomes) {
    for (const driver of outcome.driverConsiderations ?? []) {
      if (seen.has(driver)) continue;
      seen.add(driver);
      drivers.push(driver);
    }
  }
  return drivers;
}

export function mergeSymptomExpressionHints(outcomes: ProblemOutcome[]): string[] {
  const seen = new Set<string>();
  const hints: string[] = [];
  for (const outcome of outcomes) {
    for (const hint of outcome.symptomExpressionHints ?? []) {
      if (seen.has(hint)) continue;
      seen.add(hint);
      hints.push(hint);
    }
  }
  return hints;
}

export function buildEnquiryMessage(
  context: ProblemContext,
  outcomes: ProblemOutcome[],
  impact: ImpactLevel,
): string {
  const issueLines = outcomes.map((outcome) => `- ${outcome.label}`).join('\n');
  return [
    'Problem Finder summary',
    '',
    `Where: ${context.label}`,
    'Issues:',
    issueLines,
    `How much it's affecting us: ${IMPACT_LABELS[impact]}`,
    '',
    "I'd like help with these areas. Please let me know the best next step.",
  ].join('\n');
}

export function saveProblemFinderHandoff(handoff: ProblemFinderHandoff): void {
  sessionStorage.setItem(PROBLEM_FINDER_HANDOFF_KEY, JSON.stringify(handoff));
}

export function loadProblemFinderHandoff(): ProblemFinderHandoff | null {
  const raw = sessionStorage.getItem(PROBLEM_FINDER_HANDOFF_KEY);
  if (!raw) return null;

  try {
    const handoff = JSON.parse(raw) as ProblemFinderHandoff;
    if (!handoff.message || !handoff.contextId || !Array.isArray(handoff.outcomeIds)) return null;
    if (Date.now() - handoff.createdAt > PROBLEM_FINDER_HANDOFF_TTL_MS) {
      sessionStorage.removeItem(PROBLEM_FINDER_HANDOFF_KEY);
      return null;
    }
    return handoff;
  } catch {
    sessionStorage.removeItem(PROBLEM_FINDER_HANDOFF_KEY);
    return null;
  }
}

export function clearProblemFinderHandoff(): void {
  sessionStorage.removeItem(PROBLEM_FINDER_HANDOFF_KEY);
}

export function getImpactNote(outcomes: ProblemOutcome[], impact: ImpactLevel): string {
  if (outcomes.length === 0) return IMPACT_LABELS[impact];
  return outcomes[0].urgencyNotes[impact];
}
