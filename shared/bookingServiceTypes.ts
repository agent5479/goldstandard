/** Public booking service offerings — keep in sync with google-apps-script/Code.gs BOOKING_TYPES. */

import {
  ELITE_CALENDAR_BLOCK_MINUTES,
  ELITE_PRICE_LABEL,
  ELITE_SESSION_MINUTES,
  formatElitePriceLine,
  HOME_VISIT_PRICE_LABEL,
  STANDARD_PRICE_LABEL,
  STANDARD_SESSION_MINUTES,
} from './bookingPricing';

export type BookingServiceType = 'standard_beach' | 'elite_coaching';

export interface BookingServiceTypeConfig {
  id: BookingServiceType;
  label: string;
  headline: string;
  sessionMinutes: number;
  calendarBlockMinutes: number;
  priceLabel: string | null;
}

export const BOOKING_SERVICE_TYPES: Record<BookingServiceType, BookingServiceTypeConfig> = {
  standard_beach: {
    id: 'standard_beach',
    label: 'Standard training session',
    headline: `Beach or reserve (${STANDARD_PRICE_LABEL} / ${STANDARD_SESSION_MINUTES} min) or private household (from ${HOME_VISIT_PRICE_LABEL}/hr) — Golden Bay pricing; Nelson by enquiry`,
    sessionMinutes: STANDARD_SESSION_MINUTES,
    calendarBlockMinutes: STANDARD_SESSION_MINUTES,
    priceLabel: STANDARD_PRICE_LABEL,
  },
  elite_coaching: {
    id: 'elite_coaching',
    label: 'Elite home visit',
    headline: `2.5-hour private session at your home or a custom location — ${formatElitePriceLine('golden-bay').split(' · ')[0]}`,
    sessionMinutes: ELITE_SESSION_MINUTES,
    calendarBlockMinutes: ELITE_CALENDAR_BLOCK_MINUTES,
    priceLabel: ELITE_PRICE_LABEL,
  },
};

export const BOOKING_SERVICE_TYPE_LIST: BookingServiceTypeConfig[] = [
  BOOKING_SERVICE_TYPES.standard_beach,
  BOOKING_SERVICE_TYPES.elite_coaching,
];

export function isBookingServiceType(value: string): value is BookingServiceType {
  return value === 'standard_beach' || value === 'elite_coaching';
}

export function getBookingServiceTypeConfig(
  serviceType: BookingServiceType
): BookingServiceTypeConfig {
  return BOOKING_SERVICE_TYPES[serviceType];
}
