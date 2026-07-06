/** Booking wall-clock times — keep aligned with google-apps-script/Code.gs TIMEZONE. */

export const BOOKING_TIMEZONE = 'Pacific/Auckland';

function partsMap(date: Date, options: Intl.DateTimeFormatOptions): Record<string, string> {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en-NZ', { timeZone: BOOKING_TIMEZONE, ...options })
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  );
}

/** Calendar date (YYYY-MM-DD) for a booking instant in Pacific/Auckland. */
export function formatBookingDateOnly(date: Date): string {
  const parts = partsMap(date, { year: 'numeric', month: '2-digit', day: '2-digit' });
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Wall-clock time (HH:mm) for a booking instant in Pacific/Auckland. */
export function formatBookingTimeOnly(date: Date): string {
  const parts = partsMap(date, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${parts.hour}:${parts.minute}`;
}

export function parseBookingInstant(value?: string): Date | null {
  if (!value?.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function timeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  );

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - date.getTime();
}

/** Interpret stored YYYY-MM-DD + HH:mm as Pacific/Auckland wall clock. */
export function parseBookingWallDateTime(scheduledDate: string, startTime = '00:00'): Date | null {
  const dateMatch = scheduledDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const [hourRaw, minuteRaw] = startTime.split(':');
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if ([year, month, day, hour, minute].some((value) => Number.isNaN(value))) return null;

  let ms = Date.UTC(year, month - 1, day, hour, minute, 0);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const offset = timeZoneOffsetMs(new Date(ms), BOOKING_TIMEZONE);
    const corrected = Date.UTC(year, month - 1, day, hour, minute, 0) - offset;
    if (corrected === ms) break;
    ms = corrected;
  }

  const parsed = new Date(ms);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatBookingWhen(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }
): string {
  return date.toLocaleString('en-NZ', { timeZone: BOOKING_TIMEZONE, ...options });
}
