/** Guide module metadata and anchor routing — shared by public site and trainer app. */

export type GuideModuleId =
  | 'foundation'
  | 'leadership'
  | 'understanding'
  | 'social'
  | 'training'
  | 'daily-life';

export interface GuideModuleMeta {
  id: GuideModuleId;
  route: string;
  part: string;
  title: string;
  description: string;
  readMinutes: number;
  primaryAnchors: string[];
  anchors: string[];
}

const FOUNDATION_ANCHORS = ['pillars', 'pack-leader-energy'] as const;

const LEADERSHIP_ANCHORS = [
  'guide-theme-leadership',
  'owner-mindset',
  'new-baseline',
  'transforming-standards',
  'old-new-baseline',
  'implementing-baseline-shift',
  'expectations',
  'go-get-recall',
  'im-over-it',
  'i-dont-care',
  'trust-not-just-love',
  'social-regulation',
  'speaking-aloud',
  'cue-once',
  'ready-stance',
  'dog-ready-stance',
  'front-door',
  'home-return',
] as const;

const UNDERSTANDING_ANCHORS = [
  'guide-theme-understanding',
  'reading-dog',
  'three-second-pause',
  'context-of-contact',
  'breed-temperament',
  'breed-age-intensity',
  'common-pitfalls',
  'symptom-glossary',
  'trauma-signals',
  'trauma-vs-hardship',
  'true-canine-trauma',
  'eight-week-separation',
  'trauma-hardship-calibration',
  'pack-guarding',
  'distraction-processing',
  'rehabilitation-patterns',
  'behavior-driver-calibration',
  'substitute-not-suppress',
  'genetic-leverage',
  'behavioral-decoupling',
  'proactive-guidance',
  'empathetic-causality',
  'pattern-playbook-table',
  'symptom-expression-index',
  'case-compulsive-licking',
  'pattern-playbook-handler-sensitive',
  'pattern-playbook-anxious-attachment',
  'pattern-playbook-separation',
  'pattern-playbook-hyper-vigilant',
  'pattern-playbook-fixation-loop',
  'pattern-playbook-frenetic-arousal',
  'pattern-playbook-frustration-reactive',
  'pattern-playbook-barrier-frustration',
  'pattern-playbook-territorial-vigilance',
  'pattern-playbook-noise-reactive',
  'pattern-playbook-fear-reactive',
  'symptom-compulsive-lick-handler',
  'symptom-compulsive-lick-self',
  'symptom-compulsive-lick-environment',
  'symptom-repetitive-paw-chew',
  'symptom-tail-chase-spin',
  'symptom-demand-paw-handler',
  'symptom-demand-lean-threshold',
  'symptom-velcro-follow-handler',
  'symptom-lip-lick-displacement',
  'symptom-whale-eye-handler',
  'symptom-submissive-urination-greeting',
  'symptom-pacing-perimeter',
  'symptom-helicopter-greeting',
  'symptom-nudge-mouth-bump',
  'symptom-stare-lock-trigger',
  'symptom-barrier-lunge',
  'symptom-vocal-demand-alone',
  'symptom-destructive-outburst',
  'symptom-digging-compulsive',
] as const;

const SOCIAL_ANCHORS = [
  'guide-theme-social-needs',
  'social-needs',
  'dog-meetings',
  'dog-meetings-leash',
  'dominance-navigation',
  'social-friction',
  'other-dog-ready-stance',
  'intact-muzzle-protocol',
  'master-dog',
  'intact-large-males',
  'intact-health-baseline',
  'intact-large-males-mindset',
  'intact-large-males-mechanics',
  'intact-large-males-recall',
  'intact-large-males-meetings',
  'intact-large-males-outlets',
  'intact-three-paths',
  'intact-social-penalty',
  'intact-environment-restrictions',
  'biological-drive-fairness',
  'surgical-alternatives',
] as const;

const TRAINING_ANCHORS = [
  'guide-theme-training',
  'timing',
  'rewards',
  'treat-diagnostic',
  'orientation-signals',
  'corrections',
  'architecture-of-clarity',
  'conservation-of-force',
  'contextual-receptivity',
  'correction-redirection',
  'neutral-baseline-praise',
  'correction-praise-trap',
  'expectation-of-excellence',
  'unique-sound-touch',
  'dog-language',
  'not-a-game',
  'when-firmer',
  'when-not-firmer',
  'correction-intensity',
  'escalation-ladder',
  'butt-push',
  'leash-jerk',
  'verbal-correction',
  'collar-snatch',
  'jumping-up',
  'pin-hold',
  'collar-selection',
  'head-halter',
  'collars-excluded',
  'leash',
  'leash-accountability',
  'leash-selection',
  'leash-weight',
  'leash-handling',
  'sniff-breaks',
  'access',
  'baseline-expectation',
  'controlled-crucible',
  'off-lead-intervention',
  'road-safety',
  'semantic-hijacking',
  'car-protocol',
  'road-seven-months',
  'treat-handler-reinforcement',
] as const;

const DAILY_LIFE_ANCHORS = [
  'guide-theme-daily-life',
  'check-in-seven',
  'daily',
  'graduation',
] as const;

export const GUIDE_MODULES: GuideModuleMeta[] = [
  {
    id: 'foundation',
    route: '/guide/foundation',
    part: 'Part 1',
    title: 'Foundation',
    description: 'Four pillars — authority, preparation, consistency, and real-world wins.',
    readMinutes: 8,
    primaryAnchors: ['pillars'],
    anchors: [...FOUNDATION_ANCHORS],
  },
  {
    id: 'leadership',
    route: '/guide/leadership',
    part: 'Part 2',
    title: 'Leadership',
    description: 'Who leads, and how you show up — mindset, vocal and physical readiness, and the door ritual.',
    readMinutes: 25,
    primaryAnchors: ['owner-mindset', 'expectations', 'front-door'],
    anchors: [...LEADERSHIP_ANCHORS],
  },
  {
    id: 'understanding',
    route: '/guide/understanding',
    part: 'Part 3',
    title: 'Understanding',
    description: 'Read your dog — stress, breed, signals, trauma calibration, and rehabilitation patterns.',
    readMinutes: 35,
    primaryAnchors: ['reading-dog', 'rehabilitation-patterns', 'symptom-glossary'],
    anchors: [...UNDERSTANDING_ANCHORS],
  },
  {
    id: 'social',
    route: '/guide/social',
    part: 'Part 4',
    title: 'Social needs',
    description: 'Dog-to-dog dynamics, meetings, friction signals, and intact large males.',
    readMinutes: 30,
    primaryAnchors: ['social-needs', 'intact-large-males'],
    anchors: [...SOCIAL_ANCHORS],
  },
  {
    id: 'training',
    route: '/guide/training',
    part: 'Part 5',
    title: 'Training',
    description: 'Timing and motivation first — then corrections, equipment, techniques, and earned access.',
    readMinutes: 45,
    primaryAnchors: ['timing', 'corrections', 'access'],
    anchors: [...TRAINING_ANCHORS],
  },
  {
    id: 'daily-life',
    route: '/guide/daily-life',
    part: 'Part 6',
    title: 'Daily life',
    description: 'Sustain the standard — check-in, practice rhythm, graduation.',
    readMinutes: 12,
    primaryAnchors: ['check-in-seven', 'daily', 'graduation'],
    anchors: [...DAILY_LIFE_ANCHORS],
  },
];

export const GUIDE_MODULE_ORDER: GuideModuleId[] = GUIDE_MODULES.map((m) => m.id);

const moduleById = new Map(GUIDE_MODULES.map((m) => [m.id, m]));

export const ANCHOR_TO_MODULE: Record<string, GuideModuleId> = Object.fromEntries(
  GUIDE_MODULES.flatMap((module) => module.anchors.map((anchor) => [anchor, module.id])),
);

export function normalizeGuideAnchor(anchor: string): string {
  return anchor.replace(/^#/, '').trim();
}

export function getGuideModule(id: GuideModuleId): GuideModuleMeta {
  const module = moduleById.get(id);
  if (!module) throw new Error(`Unknown guide module: ${id}`);
  return module;
}

export function getGuideModuleByAnchor(anchor: string): GuideModuleMeta | undefined {
  const id = ANCHOR_TO_MODULE[normalizeGuideAnchor(anchor)];
  return id ? getGuideModule(id) : undefined;
}

export function isGuideModuleId(value: string): value is GuideModuleId {
  return moduleById.has(value as GuideModuleId);
}

export function getAdjacentModules(id: GuideModuleId): {
  prev: GuideModuleMeta | null;
  next: GuideModuleMeta | null;
} {
  const index = GUIDE_MODULE_ORDER.indexOf(id);
  return {
    prev: index > 0 ? getGuideModule(GUIDE_MODULE_ORDER[index - 1]) : null,
    next:
      index >= 0 && index < GUIDE_MODULE_ORDER.length - 1
        ? getGuideModule(GUIDE_MODULE_ORDER[index + 1])
        : null,
  };
}
