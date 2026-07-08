import {
  INSTINCT_SUBTYPE_META,
  type InstinctSubtype,
  type TraitSegment,
} from './dogIntelligence';

export type TrainingLifePhase = 'puppy' | 'adolescent' | 'adult' | 'all';

export interface TrainingLeverageMethod {
  id: string;
  title: string;
  summary: string;
  useWhen?: string;
  interrupts?: string[];
  guideAnchors?: string[];
  lifePhases?: TrainingLifePhase[];
}

export interface InstinctLeverageProfile {
  instinct: InstinctSubtype;
  headline: string;
  fixationNote: string;
  methods: TrainingLeverageMethod[];
}

export interface ResolvedLeverageBlock {
  instinct: InstinctSubtype;
  label: string;
  hue: string;
  weight: number;
  headline: string;
  fixationNote: string;
  methods: TrainingLeverageMethod[];
  breedNote?: string;
}

const instinctMetaByKey = new Map(INSTINCT_SUBTYPE_META.map((m) => [m.key, m]));

export const DEFAULT_LEVERAGE_MIN_WEIGHT = 0.15;

export const INSTINCT_LEVERAGE_PROFILES: InstinctLeverageProfile[] = [
  {
    instinct: 'scent',
    headline: 'Scent-work is currency — not a heel competition.',
    fixationNote:
      'Nose-led lock on dogs, posts, or trail — ears switch off; recall fails on scent, not defiance.',
    methods: [
      {
        id: 'scent-hand-hidden-find',
        title: 'Scent chain: hand → hidden find',
        summary:
          'Scent your closed hand, let the dog investigate, then send to a hidden treat or toy. Reward the find — the nose job replaces staring at triggers.',
        useWhen: 'Fixation on other dogs or environmental scent is building.',
        interrupts: ['dog-dog fixation', 'barrier frustration', 'scent lock on walk'],
        guideAnchors: ['genetic-leverage', 'access'],
        lifePhases: ['all'],
      },
      {
        id: 'scent-proactive-release',
        title: 'Proactive sniff release on walk',
        summary:
          'Grant a short, explicit sniff threshold before arousal peaks — at the start of the outing or after a trigger — then resume heel on your cue.',
        useWhen: 'Nose-led types need decompression before cooperation returns.',
        interrupts: ['pull toward scent', 'fixation loop on trail'],
        guideAnchors: ['sniff-breaks', 'leash'],
        lifePhases: ['all'],
      },
      {
        id: 'scent-scatter-ration',
        title: 'Scatter search from daily ration',
        summary:
          'Spread part of the measured daily food in grass or a snuffle mat. Legitimate nose work drains the tank before you deny access.',
        useWhen: 'Frustration when outlets are thin; substitute before denial.',
        interrupts: ['frustration reactive', 'destructive outbursts when bored'],
        guideAnchors: ['access', 'rewards'],
        lifePhases: ['all'],
      },
      {
        id: 'scent-structured-task',
        title: 'Assigned scent task as preferred reward',
        summary:
          'Use find-it, trailing, or container games as the payoff for calm check-ins or disengagement from triggers — not praise alone.',
        useWhen: 'Social sessions where prey-drive fixation on other dogs is the failure point.',
        interrupts: ['dog-dog fixation', 'fixation loop'],
        guideAnchors: ['genetic-leverage', 'dog-meetings'],
        lifePhases: ['adolescent', 'adult'],
      },
    ],
  },
  {
    instinct: 'hunt_dig',
    headline: 'Run, dig, and problem-solve — or frustration becomes fixation.',
    fixationNote:
      'Denied sniff, dig, or chase outlets surface as yap, destruction, or locked stare — not bad character.',
    methods: [
      {
        id: 'hunt-backward-proximity',
        title: 'Backward running + floor proximity treats',
        summary:
          'Run backward down a hallway or open space; drop kibble at your feet when the dog orients. Movement pulls attention better than static lures on high-drive terriers.',
        useWhen: 'Puppies and adolescents need owner orientation without face-to-face staring.',
        interrupts: ['fixation on movement', 'poor check-in under arousal'],
        guideAnchors: ['puppy-behavior-design', 'puppy-check-in', 'go-get-recall'],
        lifePhases: ['puppy', 'adolescent'],
      },
      {
        id: 'hunt-dig-box',
        title: 'Assigned dig box / earthwork zone',
        summary:
          'Provide a legal dig pit or sand box before calling digging pathological. Drain the earth drive, then deny elsewhere without surprise.',
        useWhen: 'Garden destruction or compulsive digging when outlets are denied.',
        interrupts: ['frustration reactive', 'destructive outbursts'],
        guideAnchors: ['access', 'breed-temperament'],
        lifePhases: ['all'],
      },
      {
        id: 'hunt-puzzle-scatter',
        title: 'Puzzle scatter and problem-solving feed',
        summary:
          'Hide food in boxes, towels, or scatter lanes. Terriers need a job — boredom becomes yap and fixation quickly.',
        useWhen: 'Under-stimulated days between structured walks.',
        interrupts: ['frustration reactive', 'fixation loop'],
        guideAnchors: ['access', 'rewards'],
        lifePhases: ['all'],
      },
      {
        id: 'hunt-structured-tug',
        title: 'Structured tug with wind-down',
        summary:
          'Short, rule-bound tug or chase games with a clear stop cue and post-play toilet or settle transition.',
        useWhen: 'Prey-drive needs an outlet before calm proximity work.',
        interrupts: ['frenetic arousal', 'barrier frustration'],
        guideAnchors: ['puppy-mouthing-play', 'access'],
        lifePhases: ['puppy', 'adolescent', 'adult'],
      },
    ],
  },
  {
    instinct: 'chase',
    headline: 'Manage the trigger window — you cannot recall a launched chase.',
    fixationNote:
      'Movement flash triggers explosive pursuit; once launched, correction is too late — pre-empt distance and arousal.',
    methods: [
      {
        id: 'chase-trigger-window',
        title: 'Trigger-window management',
        summary:
          'Increase distance before movement flashes; watch stiffening and stare-lock as precursors, not the lunge.',
        useWhen: 'Sighthounds or chase-heavy mixes near runners, bikes, or fast dogs.',
        interrupts: ['fixation loop', 'barrier frustration'],
        guideAnchors: ['dog-ready-stance', 'leash'],
        lifePhases: ['all'],
      },
      {
        id: 'chase-low-arousal-motion',
        title: 'Low-arousal motion games with clear stop',
        summary:
          'Controlled chase games with start/stop cues in safe space — arousal on your terms, not ambient triggers.',
        useWhen: 'Building engagement without letting ambient movement hijack the session.',
        interrupts: ['frenetic arousal'],
        guideAnchors: ['access', 'training'],
        lifePhases: ['puppy', 'adolescent'],
      },
      {
        id: 'chase-preempt-distance',
        title: 'Pre-emptive distance before movement flash',
        summary:
          'Cross the street, arc wide, or pause until the trigger passes — do not test recall against a running target.',
        useWhen: 'Recall fails on movement, not handler relationship.',
        interrupts: ['dog-dog fixation', 'barrier frustration'],
        guideAnchors: ['leash', 'go-get-recall'],
        lifePhases: ['all'],
      },
    ],
  },
  {
    instinct: 'herding_eye',
    headline: 'Break eye-lock before the lunge — access beats stare-down.',
    fixationNote:
      'Motion tracking and gather instinct — stiff stare at dogs, children, or wheels precedes nip or lunge.',
    methods: [
      {
        id: 'herding-break-eye-lock',
        title: 'Break visual lock at precursor',
        summary:
          'Interrupt stare-lock with spatial pressure or a reset word before movement commits — not prolonged face-to-face gazing.',
        useWhen: 'Heeler-type fixation on motion or other dogs.',
        interrupts: ['fixation loop', 'dog-dog fixation'],
        guideAnchors: ['dog-ready-stance', 'breed-temperament'],
        lifePhases: ['all'],
      },
      {
        id: 'herding-access-reward',
        title: 'Access and environmental reward',
        summary:
          'Earned continuation of walk, sniff, or play replaces praise cycles — environmental currency over handler drama.',
        useWhen: 'Eye-lock breeds learn to negotiate for access if praise is over-delivered.',
        interrupts: ['barrier frustration'],
        guideAnchors: ['access', 'rewards'],
        lifePhases: ['all'],
      },
      {
        id: 'herding-nominate-place',
        title: 'Nominate sit or place before movement',
        summary:
          'Proactive guidance: name the body position before the dog chooses to chase or gather — remove guesswork.',
        useWhen: 'Structured exposures where motion triggers gather.',
        interrupts: ['fixation loop'],
        guideAnchors: ['proactive-guidance', 'cue-once'],
        lifePhases: ['adolescent', 'adult'],
      },
    ],
  },
  {
    instinct: 'retrieve',
    headline: 'Mouth work and partnership — fetch as functional substitute.',
    fixationNote:
      'Oral fixation and velcro bonding — carrying, mouthing, and handler focus seek a job for the mouth.',
    methods: [
      {
        id: 'retrieve-mouth-job',
        title: 'Mouth job (Hold soft toy)',
        summary:
          'Teach Hold with a soft toy as security blanket — neurological grounding through carry work, not suppression.',
        useWhen: 'Anxious attachment, mouthing, or oral self-soothing loops.',
        interrupts: ['anxious attachment', 'compulsive handler licking'],
        guideAnchors: ['genetic-leverage', 'pattern-playbook-anxious-attachment'],
        lifePhases: ['all'],
      },
      {
        id: 'retrieve-structured-fetch',
        title: 'Structured fetch with calm delivery',
        summary:
          'Fetch with clear start, delivery to hand, and settle — partnership outlet before denial.',
        useWhen: 'High retrieve drive needs drain before calm threshold work.',
        interrupts: ['frustration reactive', 'frenetic arousal'],
        guideAnchors: ['access', 'rewards'],
        lifePhases: ['all'],
      },
      {
        id: 'retrieve-chin-nose',
        title: 'Chin / Nose nomination',
        summary:
          'Proactive Chin or Nose touch for calm static contact — nominate the good before demand behaviours start.',
        useWhen: 'Substituting for demand paw or mouthing at greetings.',
        interrupts: ['anxious attachment', 'demand behaviours'],
        guideAnchors: ['proactive-guidance', 'context-of-contact'],
        lifePhases: ['all'],
      },
    ],
  },
  {
    instinct: 'guard',
    headline: 'Assigned patrol with earned access — not reassurance for every glance.',
    fixationNote:
      'Vigilance at boundaries, strangers, and territory — patrol without structure becomes anxiety reinforcement.',
    methods: [
      {
        id: 'guard-assigned-patrol',
        title: 'Assigned patrol with start/stop',
        summary:
          'Structured perimeter check on cue — start and finish the job; calm leadership, not comfort-talk for every wary glance.',
        useWhen: 'Guardian types patrol doors, fences, or windows obsessively.',
        interrupts: ['territorial vigilance', 'hyper-vigilant scanning'],
        guideAnchors: ['front-door', 'pack-guarding'],
        lifePhases: ['adolescent', 'adult'],
      },
      {
        id: 'guard-earned-access',
        title: 'Earned access, not reassurance loops',
        summary:
          'Withhold engagement until calm coordination — do not reward every alert glance with soothing talk.',
        useWhen: 'Vigilance breeds entrench anxiety when every scan gets reassurance.',
        interrupts: ['territorial vigilance', 'handler-sensitive loops'],
        guideAnchors: ['breed-temperament', 'love-at-the-right-time', 'trust-not-just-love'],
        lifePhases: ['all'],
      },
      {
        id: 'guard-threshold-structure',
        title: 'Threshold structure at doors and fence line',
        summary:
          'Place, wait, and release protocols at boundaries — patrol is on your schedule, not ambient triggers.',
        useWhen: 'Barrier frustration at fence or door when access is blocked.',
        interrupts: ['barrier frustration', 'territorial vigilance'],
        guideAnchors: ['front-door', 'access'],
        lifePhases: ['all'],
      },
    ],
  },
  {
    instinct: 'sled_endurance',
    headline: 'Endurance first — then deny without surprise.',
    fixationNote:
      'Pent-up distance drive and independence — weak default recall when under-exercised; escape and frustration spike.',
    methods: [
      {
        id: 'sled-endurance-outlet',
        title: 'Endurance outlet before denial',
        summary:
          'Long structured walk, run, or pull session before expecting calm thresholds — drain the tank deliberately.',
        useWhen: 'Spitz or sled types destructive or vocal when under-exercised.',
        interrupts: ['frustration reactive', 'frenetic arousal'],
        guideAnchors: ['access', 'daily'],
        lifePhases: ['all'],
      },
      {
        id: 'sled-run-settle',
        title: 'Run-then-settle cycles',
        summary:
          'Alternate vigorous outlet with enforced rest in crate or place — impulse control follows exhaustion, not lectures.',
        useWhen: 'Cannot settle after insufficient physical work.',
        interrupts: ['frenetic arousal'],
        guideAnchors: ['puppy-daily-structure', 'access'],
        lifePhases: ['all'],
      },
      {
        id: 'sled-fence-threshold',
        title: 'Fence and threshold management',
        summary:
          'Fences and gates matter — escape drive is real. Earned access beats repetition drills for recall.',
        useWhen: 'Independent types bolt or fence-run when arousal builds.',
        interrupts: ['barrier frustration'],
        guideAnchors: ['breed-temperament', 'road-safety'],
        lifePhases: ['all'],
      },
    ],
  },
  {
    instinct: 'companion',
    headline: 'Earned proximity and check-in — not unlimited demand contact.',
    fixationNote:
      'Velcro bonding, demand paw, and handler focus — contact sought as currency without structure.',
    methods: [
      {
        id: 'companion-check-in',
        title: 'Seven-second check-in games',
        summary:
          'Reward spontaneous glances every ~7 seconds during engagement — proactive conditioning, not panic.',
        useWhen: 'Building pack awareness without anxiety-inducing hide tactics.',
        interrupts: ['anxious attachment', 'fixation away from handler'],
        guideAnchors: ['check-in-seven', 'puppy-check-in'],
        lifePhases: ['puppy', 'adolescent', 'adult'],
      },
      {
        id: 'companion-earned-proximity',
        title: 'Earned proximity vs demand lean',
        summary:
          'Calm four on floor or place earns contact; demand paw and lean at thresholds do not — see training vs living mode.',
        useWhen: 'Small companion breeds negotiate for contact at every threshold.',
        interrupts: ['anxious attachment', 'demand behaviours'],
        guideAnchors: ['context-of-contact', 'expectations'],
        lifePhases: ['all'],
      },
      {
        id: 'companion-living-mode',
        title: 'Living-mode contact rules',
        summary:
          'Distinguish calm rest contact from training-mode accountability — warmth is not permission for demand behaviours.',
        useWhen: 'Handler-attuned breeds blur rest and training boundaries.',
        interrupts: ['handler-sensitive loops'],
        guideAnchors: ['context-of-contact', 'owner-mindset'],
        lifePhases: ['all'],
      },
    ],
  },
];

const profileByInstinct = new Map(
  INSTINCT_LEVERAGE_PROFILES.map((profile) => [profile.instinct, profile])
);

/** Optional one-line breed notes keyed to breeds with non-obvious blends. */
export const BREED_LEVERAGE_NOTES: Partial<Record<string, Partial<Record<InstinctSubtype, string>>>> = {
  'Jack Russell Terrier': {
    hunt_dig:
      'High-drive terrier: backward runs and floor treats often outperform static hand lures when appetite is sharp.',
  },
  'German Wirehaired Pointer': {
    scent: 'Dual nose-and-retrieve blend: scent find-it can interrupt bird/fixation; pair with structured fetch wind-down.',
  },
  Beagle: {
    scent: 'Strong scent share: use find-it before dog-dog sessions — nose job as preferred reward over heel battle.',
  },
};

export function getInstinctLeverageProfile(instinct: InstinctSubtype): InstinctLeverageProfile | undefined {
  return profileByInstinct.get(instinct);
}

export function resolveTrainingLeverage(
  segments: TraitSegment[],
  opts?: {
    minWeight?: number;
    breedName?: string;
  }
): ResolvedLeverageBlock[] {
  const minWeight = opts?.minWeight ?? DEFAULT_LEVERAGE_MIN_WEIGHT;
  const breedNotes = opts?.breedName ? BREED_LEVERAGE_NOTES[opts.breedName] : undefined;

  const instinctSegments = segments.filter(
    (seg): seg is TraitSegment & { key: InstinctSubtype } =>
      profileByInstinct.has(seg.key as InstinctSubtype) && seg.weight >= minWeight
  );

  return instinctSegments
    .slice()
    .sort((a, b) => b.weight - a.weight)
    .map((seg) => {
      const instinct = seg.key as InstinctSubtype;
      const profile = profileByInstinct.get(instinct)!;
      const meta = instinctMetaByKey.get(instinct)!;
      return {
        instinct,
        label: meta.label,
        hue: meta.hue,
        weight: seg.weight,
        headline: profile.headline,
        fixationNote: profile.fixationNote,
        methods: profile.methods,
        breedNote: breedNotes?.[instinct],
      };
    });
}

export function formatLeverageInterrupts(methods: TrainingLeverageMethod[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const method of methods) {
    for (const item of method.interrupts ?? []) {
      if (!seen.has(item)) {
        seen.add(item);
        result.push(item);
      }
    }
  }
  return result;
}
