import {
  ELITE_CALENDAR_BLOCK_MINUTES,
  ELITE_SESSION_MINUTES,
  formatElitePriceLine,
  formatHomeVisitPriceLine,
  formatStandardPriceLine,
  getGoldenBayPricingSummaryLines,
  HOME_VISIT_SESSION_MINUTES,
  PAYMENT_AT_MEETING_NOTE,
  STANDARD_SESSION_MINUTES,
} from '@shared/bookingPricing';

/** Fixed offering — customised session with Warwick on the day. */
export const STANDARD_SERVICE = 'Training session' as const;

export const ELITE_SERVICE = 'Private Household Transformations & Elite Coaching' as const;

export const SESSION_MINUTES = STANDARD_SESSION_MINUTES;
export { ELITE_SESSION_MINUTES, ELITE_CALENDAR_BLOCK_MINUTES, HOME_VISIT_SESSION_MINUTES };

export const TRANSITION_MINUTES = 5;
export const SLOT_INTERVAL_MINUTES = 15;
export const MAX_BOOKING_DAYS_AHEAD = 60;
export const MIN_NOTICE_HOURS = 16;
export const GOLDEN_BAY_MIN_NOTICE_HOURS = 12;

export const STANDARD_SERVICE_SUMMARY = `${SESSION_MINUTES}-minute session with Warwick — ${formatStandardPriceLine('golden-bay')}`;

export const STANDARD_PRICING_NOTE = formatStandardPriceLine('golden-bay');

export const HOME_VISIT_PRICING_NOTE = formatHomeVisitPriceLine('golden-bay');

export const HOME_VISIT_SERVICE_SUMMARY = HOME_VISIT_PRICING_NOTE;

export const ELITE_SERVICE_SUMMARY = formatElitePriceLine('golden-bay');

export const ELITE_PRICING_NOTE = formatElitePriceLine('golden-bay');

export const ELITE_CLIENT_SLOT_HOURS =
  'Available from 9:00 am; last start around 12:00 pm so the 4-hour calendar block fits the working day (NZ time).';

export { PAYMENT_AT_MEETING_NOTE, getGoldenBayPricingSummaryLines };

/** Client-facing slot window — fixed copy; seasonal extensions are handled server-side only. */
export const BOOKING_CLIENT_SLOT_HOURS =
  'Available from 9:00 am, with the last booking at 4:00 pm. Start times every 15 minutes (NZ time).';

/** Shared booking policy shown on the site and mirrored in Apps Script emails. */
export const BOOKING_POLICY = {
  weather:
    'Training is outdoors and weather dependent — Warwick may reschedule if conditions are unsuitable.',
  hours:
    'From 9:00 am, seven days a week. Start times every 15 minutes. Last booking at 4:00 pm.',
  noticeHours: MIN_NOTICE_HOURS
} as const;

export type BookingWindowInfo = {
  start_label: string;
  last_start_label: string;
  season: 'standard' | 'summer' | 'peak-summer';
};

export type AvailabilityResult = {
  slots: BookingSlot[];
  region?: string;
  min_notice_hours?: number;
  earliest_bookable?: string;
  booking_window?: BookingWindowInfo;
  nelson_service_day?: boolean;
};

export type BookingSlot = {
  start: string;
  end: string;
  label: string;
};

export type ReturningDogProfile = {
  dog_name: string;
  dog_breed?: string;
  dog_age?: string;
};

export type ReturningLookupResult = {
  found: boolean;
  name?: string;
  dogs?: ReturningDogProfile[];
};

/** YYYY-MM-DD in the visitor's local timezone. */
export function toLocalDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function minBookingDate(): string {
  return toLocalDateInput(new Date());
}

export function maxBookingDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + MAX_BOOKING_DAYS_AHEAD);
  return toLocalDateInput(date);
}

/** Sensible first date: tomorrow. */
export function defaultBookingDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toLocalDateInput(date);
}

export function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/** Show only the time portion from an API slot label. */
export function shortSlotLabel(label: string): string {
  const comma = label.lastIndexOf(', ');
  return comma >= 0 ? label.slice(comma + 2) : label;
}

export type QuickDateOption = {
  value: string;
  label: string;
};

/** Next few bookable days for quick-pick chips. */
export function getQuickDateOptions(count = 4, startFrom?: string): QuickDateOption[] {
  const options: QuickDateOption[] = [];
  const cursor = startFrom ? parseLocalDateInput(startFrom) : new Date();
  if (!startFrom) {
    cursor.setDate(cursor.getDate() + 1);
  } else {
    cursor.setDate(cursor.getDate() + 1);
  }

  while (options.length < count) {
    options.push({
      value: toLocalDateInput(cursor),
      label: cursor.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return options;
}

function parseLocalDateInput(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Add days to a YYYY-MM-DD string. */
export function addDaysToDateInput(dateStr: string, days: number): string {
  const date = parseLocalDateInput(dateStr);
  date.setDate(date.getDate() + days);
  return toLocalDateInput(date);
}

/** YYYY-MM-DD from an API slot_start value (local ISO). */
export function slotStartDateKey(slotStart: string): string {
  return slotStart.slice(0, 10);
}

/** True when another session in the package already uses this date. */
export function isDateUsedByOtherPackageSessions(
  sessions: ReadonlyArray<{ date: string }>,
  date: string,
  excludeIndex: number
): boolean {
  return sessions.some((session, index) => index !== excludeIndex && session.date === date);
}

/** Time label from slot_start ISO (e.g. "10:00 am"). */
export function formatSlotTimeFromIso(slotStart: string): string {
  const match = slotStart.match(/T(\d{2}):(\d{2})/);
  if (!match) return slotStart;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const stamp = new Date(2000, 0, 1, hours, minutes);
  return stamp.toLocaleTimeString('en-NZ', { hour: 'numeric', minute: '2-digit', hour12: true });
}
