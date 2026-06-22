import type { Dog, ScheduledSession, TenantData } from '@/types';
import {
  DEFAULT_ADULT_THRESHOLD_YEARS,
  PUPPY_ADOLESCENT_THRESHOLD_MONTHS,
  formatDogAgeDisplay,
  parseDogAgeMonths,
  resolveCurrentAgeMonths,
  type DogAgeRecord,
} from '@/utils/dogLifeStage';

export { parseDogAgeMonths, PUPPY_ADOLESCENT_THRESHOLD_MONTHS as PUPPY_SEVEN_MONTH_THRESHOLD };
export const TWO_YEAR_THRESHOLD_MONTHS = DEFAULT_ADULT_THRESHOLD_YEARS * 12;

export const PUPPY_SEVEN_MONTH_CHECKIN_TASK_ID = 'focus_055';
export const PUPPY_SEVEN_MONTH_CHECKIN_TASK_NAME = '7-month puppy check-in';
export const PUPPY_SEVEN_MONTH_AUTO_NOTE_PREFIX = 'Auto: ~7-month puppy check-in';

export const TWO_YEAR_CHECKIN_TASK_ID = 'focus_056';
export const TWO_YEAR_CHECKIN_TASK_NAME = '2-year check-in';
export const TWO_YEAR_AUTO_NOTE_PREFIX = 'Auto: ~2-year check-in';

export function isPuppyUnderSevenMonths(ageText?: string): boolean {
  const months = parseDogAgeMonths(ageText);
  return months != null && months < PUPPY_ADOLESCENT_THRESHOLD_MONTHS;
}

export function isPuppyUnderSevenMonthsDog(dog: DogAgeRecord, asOf = new Date()): boolean {
  const months = resolveCurrentAgeMonths(dog, asOf);
  if (months != null) return months < PUPPY_ADOLESCENT_THRESHOLD_MONTHS;
  return isPuppyUnderSevenMonths(dog.age);
}

export function isDogUnderTwoYears(dog: DogAgeRecord, asOf = new Date()): boolean {
  const months = resolveCurrentAgeMonths(dog, asOf);
  if (months == null) {
    const parsed = parseDogAgeMonths(dog.age);
    return parsed != null && parsed < TWO_YEAR_THRESHOLD_MONTHS;
  }
  return months < TWO_YEAR_THRESHOLD_MONTHS;
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function estimateAgeMilestoneDateForDog(
  dog: DogAgeRecord,
  targetMonths: number,
  fromDate = new Date()
): string | null {
  const months = resolveCurrentAgeMonths(dog, fromDate);
  const effectiveMonths =
    months ?? parseDogAgeMonths(dog.age);
  if (effectiveMonths == null || effectiveMonths >= targetMonths) return null;

  const monthsUntil = Math.max(1, Math.ceil(targetMonths - effectiveMonths));
  const target = new Date(fromDate);
  target.setMonth(target.getMonth() + monthsUntil);
  return formatDateOnly(target);
}

/** When the dog is under 7 months, estimate the date they turn ~7 months. */
export function estimateSevenMonthCheckInDate(ageText?: string, fromDate = new Date()): string | null {
  const months = parseDogAgeMonths(ageText);
  if (months == null || months >= PUPPY_ADOLESCENT_THRESHOLD_MONTHS) return null;

  const monthsUntilSeven = Math.max(1, Math.ceil(PUPPY_ADOLESCENT_THRESHOLD_MONTHS - months));
  const target = new Date(fromDate);
  target.setMonth(target.getMonth() + monthsUntilSeven);
  return formatDateOnly(target);
}

export function estimateSevenMonthCheckInDateForDog(dog: DogAgeRecord, fromDate = new Date()): string | null {
  return estimateAgeMilestoneDateForDog(dog, PUPPY_ADOLESCENT_THRESHOLD_MONTHS, fromDate);
}

export function estimateTwoYearCheckInDateForDog(dog: DogAgeRecord, fromDate = new Date()): string | null {
  return estimateAgeMilestoneDateForDog(dog, TWO_YEAR_THRESHOLD_MONTHS, fromDate);
}

function hasPendingMilestoneFollowUp(
  data: TenantData,
  dogId: string | number,
  taskId: string,
  notePrefix: string
): boolean {
  return data.scheduledSessions.some(
    (session) =>
      session.status !== 'completed' &&
      String(session.dogId) === String(dogId) &&
      (session.taskId === taskId || session.notes?.includes(notePrefix))
  );
}

export function hasPendingPuppySevenMonthCheckIn(data: TenantData, dogId: string | number): boolean {
  return hasPendingMilestoneFollowUp(
    data,
    dogId,
    PUPPY_SEVEN_MONTH_CHECKIN_TASK_ID,
    PUPPY_SEVEN_MONTH_AUTO_NOTE_PREFIX
  );
}

export function hasPendingTwoYearCheckIn(data: TenantData, dogId: string | number): boolean {
  return hasPendingMilestoneFollowUp(
    data,
    dogId,
    TWO_YEAR_CHECKIN_TASK_ID,
    TWO_YEAR_AUTO_NOTE_PREFIX
  );
}

export function buildPuppySevenMonthCheckInSession(params: {
  dog: Pick<Dog, 'id' | 'name' | 'age' | 'ageRecordedAt' | 'updatedAt'>;
  ownerId: string;
  scheduledDate: string;
  trainer?: string;
  id?: string;
}): ScheduledSession {
  const ageLabel = formatDogAgeDisplay(params.dog) || params.dog.age?.trim() || 'unknown';
  return {
    id: params.id || `followup_puppy7mo_${params.dog.id}_${Date.now()}`,
    ownerId: params.ownerId,
    dogId: String(params.dog.id),
    taskId: PUPPY_SEVEN_MONTH_CHECKIN_TASK_ID,
    taskName: PUPPY_SEVEN_MONTH_CHECKIN_TASK_NAME,
    scheduledDate: params.scheduledDate,
    priority: 'normal',
    status: 'pending',
    notes: `${PUPPY_SEVEN_MONTH_AUTO_NOTE_PREFIX} for ${params.dog.name || 'dog'} (age recorded: ${ageLabel}). Follow up around 7 months — adult-standard expectations.`,
    trainer: params.trainer,
  };
}

export function buildTwoYearCheckInSession(params: {
  dog: Pick<Dog, 'id' | 'name' | 'age' | 'ageRecordedAt' | 'updatedAt'>;
  ownerId: string;
  scheduledDate: string;
  trainer?: string;
  id?: string;
}): ScheduledSession {
  const ageLabel = formatDogAgeDisplay(params.dog) || params.dog.age?.trim() || 'unknown';
  return {
    id: params.id || `followup_2yr_${params.dog.id}_${Date.now()}`,
    ownerId: params.ownerId,
    dogId: String(params.dog.id),
    taskId: TWO_YEAR_CHECKIN_TASK_ID,
    taskName: TWO_YEAR_CHECKIN_TASK_NAME,
    scheduledDate: params.scheduledDate,
    priority: 'normal',
    status: 'pending',
    notes: `${TWO_YEAR_AUTO_NOTE_PREFIX} for ${params.dog.name || 'dog'} (age recorded: ${ageLabel}). Follow up around 2 years — young adult milestone.`,
    trainer: params.trainer,
  };
}

export function planPuppySevenMonthCheckIn(
  data: TenantData,
  dog: Dog,
  trainer?: string
): ScheduledSession | null {
  if (hasPendingPuppySevenMonthCheckIn(data, dog.id)) return null;

  const scheduledDate = estimateSevenMonthCheckInDateForDog(dog);
  if (!scheduledDate) return null;

  return buildPuppySevenMonthCheckInSession({
    dog,
    ownerId: String(dog.ownerId),
    scheduledDate,
    trainer,
  });
}

export function planTwoYearCheckIn(
  data: TenantData,
  dog: Dog,
  trainer?: string
): ScheduledSession | null {
  if (hasPendingTwoYearCheckIn(data, dog.id)) return null;

  const scheduledDate = estimateTwoYearCheckInDateForDog(dog);
  if (!scheduledDate) return null;

  return buildTwoYearCheckInSession({
    dog,
    ownerId: String(dog.ownerId),
    scheduledDate,
    trainer,
  });
}

/** Plan all age-milestone follow-ups that are still due for this dog. */
export function planDogAgeMilestoneFollowUps(
  data: TenantData,
  dog: Dog,
  trainer?: string
): ScheduledSession[] {
  const sessions: ScheduledSession[] = [];
  const puppy = planPuppySevenMonthCheckIn(data, dog, trainer);
  if (puppy) sessions.push(puppy);
  const twoYear = planTwoYearCheckIn(data, dog, trainer);
  if (twoYear) sessions.push(twoYear);
  return sessions;
}
