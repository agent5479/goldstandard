import { breeds } from './breeds';
import { getBreedLifePhaseNotes } from './breedSensitivityResolvers';
import { getBreedSizeClass, resolveBreedName } from './breedTraits';
import type { SizeClass } from './breedSizeGrades';
import {
  getPuppyDevelopmentStage,
  type PuppyDevelopmentStage,
  type PuppyDevelopmentStageId,
} from './puppyDevelopmentStages';

export interface PuppyPlanInput {
  ageWeeks: number;
  breedName: string;
  useHungerTraining: boolean;
  /** Default 7 — first wake of the day. */
  dayStartHour?: number;
}

export interface PuppyScheduleBlock {
  timeLabel: string;
  activity: string;
  toiletTrigger: boolean;
  notes?: string;
}

export interface PuppyPlanResult {
  ageWeeks: number;
  ageMonthsApprox: number;
  bladderHoldHours: number;
  awakeMinutes: number;
  napMinutes: number;
  sizeClass: SizeClass | null;
  breedLabel: string;
  breedPuppyNote?: string;
  sizeNote?: string;
  schedule: PuppyScheduleBlock[];
  earlySecurity: string[];
  separationNotes: string[];
  foodAccess: string[];
  milkGuidance: string[];
  trackingItems: string[];
  hungerTrainingActive: boolean;
  developmentStage: PuppyDevelopmentStageId;
  developmentStageLabel: string;
  developmentStageRange: string;
  developmentStageGoal: string;
  stagePriorities: string[];
  stageDefer: string[];
}

const VET_DISCLAIMER =
  'This planner is not veterinary advice. Confirm food amounts on your bag label and with your vet — especially if your puppy is underweight, vomiting, or lethargic.';

export function getPuppyPlanDisclaimer(): string {
  return VET_DISCLAIMER;
}

export function ageWeeksToMonthsApprox(weeks: number): number {
  return Math.max(0, weeks) / 4.345;
}

/** Bladder rule: one hour per month of age, plus one (whole months from weeks ÷ 4). */
export function computeBladderHoldHours(ageWeeks: number): number {
  const wholeMonths = Math.max(1, Math.floor(Math.max(0, ageWeeks) / 4));
  return wholeMonths + 1;
}

function computeRhythm(ageWeeks: number): { awakeMinutes: number; napMinutes: number } {
  if (ageWeeks <= 12) return { awakeMinutes: 45, napMinutes: 120 };
  if (ageWeeks <= 16) return { awakeMinutes: 50, napMinutes: 105 };
  if (ageWeeks <= 20) return { awakeMinutes: 55, napMinutes: 90 };
  if (ageWeeks <= 26) return { awakeMinutes: 60, napMinutes: 90 };
  return { awakeMinutes: 75, napMinutes: 75 };
}

function formatHour(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}:00 ${period}` : `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function addBlock(
  blocks: PuppyScheduleBlock[],
  startMinutes: number,
  durationMin: number,
  activity: string,
  toiletTrigger: boolean,
  notes?: string
): number {
  blocks.push({
    timeLabel: formatHour(startMinutes),
    activity,
    toiletTrigger,
    notes,
  });
  return startMinutes + durationMin;
}

export function buildDaySchedule(input: PuppyPlanInput): PuppyScheduleBlock[] {
  const { awakeMinutes, napMinutes } = computeRhythm(input.ageWeeks);
  const startHour = input.dayStartHour ?? 7;
  let cursor = startHour * 60;
  const blocks: PuppyScheduleBlock[] = [];
  const carryOnWake = input.ageWeeks <= 14;
  const cycles = input.ageWeeks <= 16 ? 4 : 3;

  for (let cycle = 0; cycle < cycles; cycle += 1) {
    const isFirst = cycle === 0;
    const isLast = cycle === cycles - 1;

    if (isFirst) {
      cursor = addBlock(
        blocks,
        cursor,
        0,
        carryOnWake
          ? 'Wake — carry straight out; paws do not touch floor inside'
          : 'Wake — immediate toilet trip on lead to same spot',
        true,
        'Golden window: first thing on wake'
      );
    } else {
      cursor = addBlock(blocks, cursor, 0, 'Wake from nap — immediate toilet trip', true);
    }

    const trainLabel =
      cycle === 0
        ? 'Hand-feeding and short training — first third of daily ration'
        : cycle === 1
          ? 'Low-arousal engagement on the ground — second third of ration'
          : 'Training and play — final third of ration';

    cursor = addBlock(blocks, cursor, 15, trainLabel, false);
    cursor = addBlock(
      blocks,
      cursor,
      Math.min(20, awakeMinutes - 15),
      isLast ? 'Calm play or chew — wind down' : 'Short vigorous play, then wind down',
      false,
      'Post-play toilet window is highest risk'
    );
    cursor = addBlock(
      blocks,
      cursor,
      0,
      'Toilet trip — directly when play stops',
      true,
      'Do not skip this transition'
    );

    if (!isLast) {
      cursor = addBlock(
        blocks,
        cursor,
        napMinutes,
        `Crate or pen nap (~${Math.round(napMinutes / 60)} hr)`,
        false,
        '18–20 hours sleep per day total'
      );
    } else {
      cursor = addBlock(blocks, cursor, 0, 'Last-call toilet before bedtime crate', true);
      addBlock(blocks, cursor, 0, 'Bedtime — crate for the night', false);
    }
  }

  return blocks;
}

function sizeClassPuppyNote(sizeClass: SizeClass): string {
  switch (sizeClass) {
    case 'toy':
    case 'small':
      return 'Small breeds: resist carrying and hand-feeding indulgence — ground-level structure from day one.';
    case 'giant':
    case 'large':
      return 'Large or giant breeds: carry thresholds longer if needed; jumping and pulling are not cute at full size.';
    default:
      return 'Match session length to attention — stop before saturation, not after meltdown.';
  }
}

function resolveBreedEntry(breedName: string) {
  const trimmed = breedName.trim();
  if (!trimmed) return null;
  const resolved = resolveBreedName(trimmed);
  return breeds.find((b) => b.name === resolved) ?? null;
}

export function buildPuppyPlan(input: PuppyPlanInput): PuppyPlanResult {
  const ageWeeks = Math.max(1, Math.min(52, Math.round(input.ageWeeks)));
  const breedEntry = resolveBreedEntry(input.breedName);
  const breedLabel = breedEntry?.name ?? (input.breedName.trim() || 'your breed');
  const size = breedEntry ? getBreedSizeClass(breedEntry) : null;
  const lifeNotes = breedEntry ? getBreedLifePhaseNotes(breedEntry.name) : undefined;
  const { awakeMinutes, napMinutes } = computeRhythm(ageWeeks);
  const bladderHoldHours = computeBladderHoldHours(ageWeeks);
  const ageMonthsApprox = ageWeeksToMonthsApprox(ageWeeks);

  const earlySecurity: string[] = [];
  if (ageWeeks <= 10) {
    earlySecurity.push(
      'Sleep close, warm, or in bed with you initially — mimic littermate security before standalone crate nights.'
    );
    earlySecurity.push(
      'Keep the puppy physically near you between naps — playpen, tether, or lap — not free roaming the house.'
    );
  } else if (ageWeeks <= 16) {
    earlySecurity.push(
      'Transition toward crate independence now that the nervous system knows it landed somewhere safe — not before.'
    );
  } else {
    earlySecurity.push(
      'Security is established; crate naps and structured independence replace constant contact.'
    );
  }

  const separationNotes = [
    'Separating from the litter at ~8 weeks is a real psychological hardship — loss of littermate co-regulation, not trauma in the damage sense.',
    'What may be missed: bite inhibition practice with siblings, thermal comfort of the pile, and learning to settle without constant contact.',
    'Early warmth is living-mode contact — see #eight-week-separation. Structure still arrives; it arrives after safety is felt.',
  ];

  const foodAccess: string[] = [
    'Total daily amount: follow your food bag feeding guide for age and expected adult weight — confirm with your vet.',
    'Fresh water available at all times.',
  ];

  if (input.useHungerTraining) {
    foodAccess.push(
      'Ditch the free bowl — measure the full daily ration and deliver it only through training sessions (roughly three blocks across the day).',
      'No grazing between sessions when using hunger for floor-proximity treats, walk-back jumping work, and backward recall.',
      'Schedule meals/training before appetite fades — not straight after a large meal.'
    );
  } else {
    foodAccess.push(
      'Ensure the puppy receives enough total food per the bag — hunger training is optional; if not using food as currency, structured mealtimes still help toilet predictability.'
    );
  }

  if (ageWeeks < 8) {
    foodAccess.push(
      'Under 8 weeks: feeding should be guided by your breeder or vet — not yet on a standard puppy kibble schedule alone.'
    );
  } else if (ageWeeks <= 12) {
    foodAccess.push(
      'Typical rhythm: 3–4 smaller meals spread across waking blocks — aligned with your schedule table, not left in a bowl.'
    );
  } else if (ageWeeks <= 20) {
    foodAccess.push(
      'Typical rhythm: 3 meals per day transitioning toward 2 by ~6 months — per bag guidance.'
    );
  } else {
    foodAccess.push('Typical rhythm: 2 meals per day for most puppies past ~5–6 months — per bag guidance.');
  }

  const milkGuidance: string[] = [];
  if (ageWeeks < 6) {
    milkGuidance.push(
      'Puppies under 6 weeks need breeder/veterinary milk replacer if not nursing — do not use cow milk.'
    );
  } else if (ageWeeks < 8) {
    milkGuidance.push(
      'Weaning should be underway — solid food introduced per breeder/vet; milk replacer only if prescribed.'
    );
  } else {
    milkGuidance.push(
      'From 8 weeks home: solid puppy food per bag label. No cow milk. Weaning should be complete — vet check if appetite is poor.'
    );
  }

  const trackingItems = [
    'Sleep total (target ~18–20 hr/day at this age)',
    'Toilet successes and accidents — note post-play misses',
    'Appetite and stool quality',
    'Weekly weigh-in — compare trend to bag growth chart',
    'Mouthing intensity and overtired yap',
    'Check-ins during play — aim for glance every ~7 seconds when training',
  ];

  if (ageWeeks <= 12) {
    trackingItems.push('Carry-out on wake still required? (paws off floor inside)');
  }

  const stage: PuppyDevelopmentStage = getPuppyDevelopmentStage(ageWeeks);

  if (stage.id === 'teething_satiation') {
    trackingItems.push('Chew toy rotation — is mouthing satiated or spilling onto hands/furniture?');
    trackingItems.push('Tolerant dog play sessions — frequency and recovery after');
  }

  if (stage.id === 'exercise_exposure') {
    trackingItems.push('Novel exposure log — what was new this week (markets, water, surfaces)?');
    trackingItems.push('Exercise volume vs blow-off at dog park — normal adolescent, not attitude');
  }

  return {
    ageWeeks,
    ageMonthsApprox,
    bladderHoldHours,
    awakeMinutes,
    napMinutes,
    sizeClass: size,
    breedLabel,
    breedPuppyNote: lifeNotes?.puppy,
    sizeNote: size ? sizeClassPuppyNote(size) : undefined,
    schedule: buildDaySchedule(input),
    earlySecurity,
    separationNotes,
    foodAccess,
    milkGuidance,
    trackingItems,
    hungerTrainingActive: input.useHungerTraining,
    developmentStage: stage.id,
    developmentStageLabel: stage.label,
    developmentStageRange: stage.ageRangeLabel,
    developmentStageGoal: stage.coreGoal,
    stagePriorities: stage.priorities,
    stageDefer: stage.defer,
  };
}

export function formatPuppyPlanText(plan: PuppyPlanResult): string {
  const lines: string[] = [
    `Puppy plan — ${plan.breedLabel}, ~${plan.ageWeeks} weeks`,
    '',
    VET_DISCLAIMER,
    '',
    `Development stage: ${plan.developmentStageLabel} (${plan.developmentStageRange})`,
    plan.developmentStageGoal,
    '',
    `Bladder hold (approx): ${plan.bladderHoldHours} hour(s) — more frequent when active`,
    `Awake block: ~${plan.awakeMinutes} min | Nap: ~${plan.napMinutes} min`,
    '',
    'Daily rhythm',
    ...plan.schedule.map(
      (b) =>
        `${b.timeLabel}: ${b.activity}${b.toiletTrigger ? ' [TOILET]' : ''}${b.notes ? ` (${b.notes})` : ''}`
    ),
    '',
    'Early security',
    ...plan.earlySecurity.map((s) => `- ${s}`),
    '',
    'Food & water',
    ...plan.foodAccess.map((s) => `- ${s}`),
    '',
    'Track this week',
    ...plan.trackingItems.map((s) => `- ${s}`),
  ];
  if (plan.breedPuppyNote) {
    lines.push('', `Breed note: ${plan.breedPuppyNote}`);
  }
  return lines.join('\n');
}
