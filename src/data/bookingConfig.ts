/** Fixed offering — customised session with Warwick on the day. */
export const STANDARD_SERVICE = 'Training session' as const;

export const ELITE_SERVICE = 'Private Household Transformations & Elite Coaching' as const;

export const SESSION_MINUTES = 55;
export const ELITE_SESSION_MINUTES = 150;
export const ELITE_CALENDAR_BLOCK_MINUTES = 240;
export const TRANSITION_MINUTES = 5;
export const SLOT_INTERVAL_MINUTES = 15;
export const MAX_BOOKING_DAYS_AHEAD = 60;
export const MIN_NOTICE_HOURS = 16;

export const STANDARD_SERVICE_SUMMARY = `${SESSION_MINUTES}-minute session with Warwick — customised to you and your dog on the day.`;

export const ELITE_SERVICE_SUMMARY =
  '2.5-hour session at your home or a custom location — $400. Warwick reserves 4 hours in his calendar for travel and preparation.';

export const ELITE_PRICING_NOTE =
  '$400 · 2.5-hour session. Warwick reserves a 4-hour calendar block for travel and preparation. Last start around 12:00 pm.';

export const ELITE_CLIENT_SLOT_HOURS =
  'Available from 9:00 am; last start around 12:00 pm so the 4-hour calendar block fits the working day (NZ time).';

/** @deprecated Standard path is beaches only — elite uses ELITE_PRICING_NOTE */
export const HOME_VISIT_PRICING_NOTE = ELITE_PRICING_NOTE;

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
  booking_window?: BookingWindowInfo;
  nelson_service_day?: boolean;
};

export type BookingSlot = {
  start: string;
  end: string;
  label: string;
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
export function getQuickDateOptions(count = 4): QuickDateOption[] {
  const options: QuickDateOption[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);

  while (options.length < count) {
    options.push({
      value: toLocalDateInput(cursor),
      label: cursor.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return options;
}

