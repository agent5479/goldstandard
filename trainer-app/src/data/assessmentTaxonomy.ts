import { DEFAULT_TRAINING_FOCUS } from '@/data/trainingFocus';

/** Public client guide base URL — anchor links open the matching section. */
export const PUBLIC_GUIDE_URL = 'https://agent5479.github.io/goldstandard/guide';

export type SkillGrade = 0 | 1 | 2 | 3 | 4;

export type OwnerCapacityDomain =
  | 'owner_mindset'
  | 'timing'
  | 'access_rewards'
  | 'routine_thresholds'
  | 'relationship_habits'
  | 'equipment'
  | 'adult_expectations'
  | 'reading_signals';

export interface GuideAnchor {
  id: string;
  label: string;
  icon?: string;
  groupId: string;
}

export interface GuideGroup {
  id: string;
  label: string;
  icon?: string;
}

export interface ExamTopic {
  id: string;
  label: string;
  ownerRelevant: boolean;
}

export interface OwnerCapacityDomainDef {
  id: OwnerCapacityDomain;
  label: string;
  description: string;
  examTopicIds: string[];
}

export const DOG_SKILL_GRADE_LABELS: Record<SkillGrade, string> = {
  0: 'Not started',
  1: 'Emerging',
  2: 'Developing',
  3: 'Proficient',
  4: 'Proofed',
};

export const OWNER_CAPACITY_GRADE_LABELS: Record<SkillGrade, string> = {
  0: 'Unassessed',
  1: 'Needs support',
  2: 'Building',
  3: 'Competent',
  4: 'Independent',
};

export const GUIDE_GROUPS: GuideGroup[] = [
  { id: 'foundation', label: 'Foundation', icon: 'bi-trophy' },
  { id: 'leadership', label: 'Leadership', icon: 'bi-person' },
  { id: 'understanding', label: 'Understanding', icon: 'bi-brain' },
  { id: 'social', label: 'Social needs', icon: 'bi-people' },
  { id: 'training', label: 'Training', icon: 'bi-tools' },
  { id: 'daily-life', label: 'Daily life', icon: 'bi-house' },
];

export const GUIDE_ANCHORS: GuideAnchor[] = [
  { id: 'pillars', label: 'Three pillars', icon: 'bi-trophy', groupId: 'foundation' },
  { id: 'owner-mindset', label: 'Owner mindset', icon: 'bi-person', groupId: 'leadership' },
  { id: 'new-baseline', label: 'New baseline', icon: 'bi-brain', groupId: 'leadership' },
  { id: 'implementing-baseline-shift', label: 'Implementing the shift', icon: 'bi-tools', groupId: 'leadership' },
  { id: 'expectations', label: 'Expectations', icon: 'bi-bullseye', groupId: 'leadership' },
  { id: 'im-over-it', label: "I'm over it", icon: 'bi-stop-circle', groupId: 'leadership' },
  { id: 'i-dont-care', label: "I don't care (7+ months)", icon: 'bi-mortarboard', groupId: 'leadership' },
  { id: 'trust-not-just-love', label: 'Trust, not just love', icon: 'bi-heart', groupId: 'leadership' },
  { id: 'social-regulation', label: 'Self-regulation (training mode)', icon: 'bi-people', groupId: 'leadership' },
  { id: 'speaking-aloud', label: 'Speak it aloud', icon: 'bi-megaphone', groupId: 'leadership' },
  { id: 'cue-once', label: 'Say it once', icon: 'bi-1-circle', groupId: 'leadership' },
  { id: 'ready-stance', label: 'Ready stance', icon: 'bi-person-arms-up', groupId: 'leadership' },
  { id: 'front-door', label: 'Front door', icon: 'bi-door-open', groupId: 'leadership' },
  { id: 'home-return', label: 'Coming home', icon: 'bi-house', groupId: 'leadership' },
  { id: 'reading-dog', label: 'Reading your dog', icon: 'bi-book', groupId: 'understanding' },
  { id: 'three-second-pause', label: 'Three-second pause', icon: 'bi-pause-circle', groupId: 'understanding' },
  { id: 'context-of-contact', label: 'Context of contact', icon: 'bi-house-heart', groupId: 'understanding' },
  { id: 'breed-temperament', label: 'Breed variance', icon: 'bi-paw', groupId: 'understanding' },
  { id: 'breed-age-intensity', label: 'Age × temperament', icon: 'bi-sliders', groupId: 'understanding' },
  { id: 'distraction-processing', label: 'Distraction processing', icon: 'bi-eye', groupId: 'understanding' },
  { id: 'common-pitfalls', label: 'Common pitfalls', icon: 'bi-exclamation-triangle', groupId: 'understanding' },
  { id: 'symptom-glossary', label: 'Symptom glossary', icon: 'bi-journal-medical', groupId: 'understanding' },
  { id: 'trauma-signals', label: 'Trauma signals', icon: 'bi-heart-pulse', groupId: 'understanding' },
  { id: 'trauma-vs-hardship', label: 'Trauma vs hardship', icon: 'bi-sliders', groupId: 'understanding' },
  { id: 'true-canine-trauma', label: 'True canine trauma', icon: 'bi-volume-up', groupId: 'understanding' },
  { id: 'eight-week-separation', label: '8-week separation', icon: 'bi-moon', groupId: 'understanding' },
  { id: 'trauma-hardship-calibration', label: 'Correction scale', icon: 'bi-speedometer', groupId: 'understanding' },
  { id: 'pack-guarding', label: 'Pack guarding', icon: 'bi-shield', groupId: 'understanding' },
  { id: 'social-needs', label: 'Social world', icon: 'bi-people', groupId: 'social' },
  { id: 'dog-meetings', label: 'Dog meetings', icon: 'bi-people', groupId: 'social' },
  { id: 'intact-large-males', label: 'Intact large males', icon: 'bi-shield-exclamation', groupId: 'social' },
  { id: 'intact-health-baseline', label: 'Intact health baseline', icon: 'bi-heart-pulse', groupId: 'social' },
  { id: 'intact-three-paths', label: 'Three lifestyle paths', icon: 'bi-signpost-split', groupId: 'social' },
  { id: 'intact-social-penalty', label: 'Social penalty', icon: 'bi-lightning-charge', groupId: 'social' },
  { id: 'intact-environment-restrictions', label: 'Shrunk world', icon: 'bi-globe', groupId: 'social' },
  { id: 'biological-drive-fairness', label: 'Drive fairness', icon: 'bi-balance-scale', groupId: 'social' },
  { id: 'surgical-alternatives', label: 'Surgical alternatives', icon: 'bi-scissors', groupId: 'social' },
  { id: 'social-friction', label: 'Social friction signals', icon: 'bi-lightning', groupId: 'social' },
  { id: 'master-dog', label: 'Master dog', icon: 'bi-star', groupId: 'social' },
  { id: 'timing', label: 'Timing', icon: 'bi-stopwatch', groupId: 'training' },
  { id: 'rewards', label: 'Rewards', icon: 'bi-gift', groupId: 'training' },
  { id: 'go-get-recall', label: 'Go-get recall', icon: 'bi-arrow-repeat', groupId: 'training' },
  { id: 'treat-handler-reinforcement', label: 'Treat reinforcement', icon: 'bi-bullseye', groupId: 'training' },
  { id: 'corrections', label: 'Corrections overview', icon: 'bi-tools', groupId: 'training' },
  { id: 'unique-sound-touch', label: 'Unique sound & touch', icon: 'bi-soundwave', groupId: 'training' },
  { id: 'dog-language', label: 'Dog language & gruff correction', icon: 'bi-chat-dots', groupId: 'training' },
  { id: 'butt-push', label: 'Butt push', icon: 'bi-hand-index', groupId: 'training' },
  { id: 'leash-jerk', label: 'Downward leash jerk', icon: 'bi-arrow-down', groupId: 'training' },
  { id: 'verbal-correction', label: 'Verbal correction', icon: 'bi-megaphone', groupId: 'training' },
  { id: 'collar-snatch', label: 'Collar grab & forced sit', icon: 'bi-hand-index-thumb', groupId: 'training' },
  { id: 'pin-hold', label: 'Pin & hold (advanced)', icon: 'bi-exclamation-octagon', groupId: 'training' },
  { id: 'leash', label: 'Leash & line', icon: 'bi-link', groupId: 'training' },
  { id: 'leash-accountability', label: 'Choice to leave', icon: 'bi-magnet', groupId: 'training' },
  { id: 'collar-selection', label: 'Collar selection', icon: 'bi-shield', groupId: 'training' },
  { id: 'leash-selection', label: 'Leash selection', icon: 'bi-compass', groupId: 'training' },
  { id: 'leash-weight', label: 'Line weight & dangle', icon: 'bi-anchor', groupId: 'training' },
  { id: 'sniff-breaks', label: 'Sniff breaks', icon: 'bi-wind', groupId: 'training' },
  { id: 'access', label: 'Access training', icon: 'bi-unlock', groupId: 'training' },
  { id: 'baseline-expectation', label: 'Baseline expectation', icon: 'bi-rulers', groupId: 'training' },
  { id: 'controlled-crucible', label: 'Controlled crucible', icon: 'bi-fire', groupId: 'training' },
  { id: 'off-lead-intervention', label: 'Off-lead intervention', icon: 'bi-sign-stop', groupId: 'training' },
  { id: 'road-safety', label: 'Road safety (rural NZ)', icon: 'bi-sign-turn-right', groupId: 'training' },
  { id: 'semantic-hijacking', label: 'Car cue hijacking', icon: 'bi-car-front', groupId: 'training' },
  { id: 'car-protocol', label: 'Car protocol', icon: 'bi-car-front-fill', groupId: 'training' },
  { id: 'road-seven-months', label: 'Seven-month road crucible', icon: 'bi-hourglass', groupId: 'training' },
  { id: 'check-in-seven', label: '7-second check-in', icon: 'bi-eye', groupId: 'daily-life' },
  { id: 'daily', label: 'Daily practice', icon: 'bi-calendar-check', groupId: 'daily-life' },
  { id: 'graduation', label: 'Graduation', icon: 'bi-mortarboard', groupId: 'daily-life' },
];

export const EXAM_TOPICS: ExamTopic[] = [
  { id: 'foundations', label: 'Foundations', ownerRelevant: true },
  { id: 'owner_mindset', label: 'Owner mindset', ownerRelevant: true },
  { id: 'reading_signals', label: 'Reading signals', ownerRelevant: true },
  { id: 'trauma_meetings', label: 'Trauma & meetings', ownerRelevant: false },
  { id: 'off_leash_social', label: 'Off-leash social', ownerRelevant: false },
  { id: 'road_safety', label: 'Road safety', ownerRelevant: true },
  { id: 'corrections', label: 'Corrections', ownerRelevant: false },
  { id: 'leash_work', label: 'Leash work', ownerRelevant: true },
  { id: 'access_rewards', label: 'Access & rewards', ownerRelevant: true },
  { id: 'timing', label: 'Timing', ownerRelevant: true },
  { id: 'routine_thresholds', label: 'Routine & thresholds', ownerRelevant: true },
  { id: 'calibration_escalation', label: 'Calibration & escalation', ownerRelevant: false },
  { id: 'breed_temperament', label: 'Breed temperament', ownerRelevant: false },
  { id: 'relationship_habits', label: 'Relationship habits', ownerRelevant: true },
  { id: 'equipment', label: 'Equipment', ownerRelevant: true },
  { id: 'adult_expectations', label: 'Adult expectations', ownerRelevant: true },
  { id: 'trainer_calibration', label: 'Trainer calibration', ownerRelevant: false },
];

export const OWNER_CAPACITY_DOMAINS: OwnerCapacityDomainDef[] = [
  {
    id: 'owner_mindset',
    label: 'Owner mindset',
    description: 'Calm leadership, cue-once, trust-building habits',
    examTopicIds: ['owner_mindset', 'foundations'],
  },
  {
    id: 'timing',
    label: 'Timing',
    description: 'Correction and reward timing in real sessions',
    examTopicIds: ['timing'],
  },
  {
    id: 'access_rewards',
    label: 'Access & rewards',
    description: 'Nothing for Free, earned permissions, life rewards',
    examTopicIds: ['access_rewards'],
  },
  {
    id: 'routine_thresholds',
    label: 'Routine & thresholds',
    description: 'Daily practice, front door, check-in protocols',
    examTopicIds: ['routine_thresholds', 'relationship_habits'],
  },
  {
    id: 'relationship_habits',
    label: 'Relationship habits',
    description: 'Home return, outings, guest behaviour',
    examTopicIds: ['relationship_habits'],
  },
  {
    id: 'equipment',
    label: 'Equipment',
    description: 'Collar, leash, and line handling choices',
    examTopicIds: ['equipment', 'leash_work'],
  },
  {
    id: 'adult_expectations',
    label: 'Adult expectations',
    description: 'Household consistency and adult handler standards',
    examTopicIds: ['adult_expectations'],
  },
  {
    id: 'reading_signals',
    label: 'Reading signals',
    description: 'Body language, stress, and dog communication',
    examTopicIds: ['reading_signals'],
  },
];

/** Primary dog skill focus items (Skills category). */
export const DOG_SKILL_FOCUS_IDS = ['focus_050', 'focus_051', 'focus_052', 'focus_053'];

export const ALL_FOCUS_ITEMS = DEFAULT_TRAINING_FOCUS;

export function getGuideAnchor(id: string): GuideAnchor | undefined {
  return GUIDE_ANCHORS.find((a) => a.id === id);
}

export function getGuideGroup(id: string): GuideGroup | undefined {
  return GUIDE_GROUPS.find((g) => g.id === id);
}

export function guideAnchorUrl(anchorId: string): string {
  return `${PUBLIC_GUIDE_URL}#${anchorId}`;
}

export function getFocusById(id: string) {
  return ALL_FOCUS_ITEMS.find((f) => String(f.id) === id);
}

export function getDogSkillFocusItems() {
  return ALL_FOCUS_ITEMS.filter((f) => DOG_SKILL_FOCUS_IDS.includes(String(f.id)));
}

export function getOwnerCapacityDomain(id: OwnerCapacityDomain) {
  return OWNER_CAPACITY_DOMAINS.find((d) => d.id === id);
}

export function skillGradeLabel(grade: SkillGrade | undefined, kind: 'dog' | 'owner' = 'dog'): string {
  if (grade == null) return kind === 'owner' ? OWNER_CAPACITY_GRADE_LABELS[0] : DOG_SKILL_GRADE_LABELS[0];
  return kind === 'owner' ? OWNER_CAPACITY_GRADE_LABELS[grade] : DOG_SKILL_GRADE_LABELS[grade];
}

export function skillGradeVariant(grade: SkillGrade | undefined): string {
  if (grade == null || grade === 0) return 'secondary';
  if (grade === 1) return 'danger';
  if (grade === 2) return 'warning';
  if (grade === 3) return 'info';
  return 'success';
}

/** Minimum grades for graduation suggestion (pinned skills + owner capacity). */
export const GRADUATION_MIN_DOG_SKILL_GRADE: SkillGrade = 3;
export const GRADUATION_MIN_OWNER_CAPACITY_GRADE: SkillGrade = 3;

/** Days without grade update while household is active training. */
export const STALE_GRADE_DAYS = 90;
