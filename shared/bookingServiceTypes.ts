/** Public booking service offerings — keep in sync with google-apps-script/Code.gs BOOKING_TYPES. */

import { STANDARD_PRICE_LABEL } from './bookingPricing';

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
    headline: `55-minute session at a public beach or reserve — ${STANDARD_PRICE_LABEL}`,
    sessionMinutes: 55,
    calendarBlockMinutes: 55,
    priceLabel: STANDARD_PRICE_LABEL,
  },
  elite_coaching: {
    id: 'elite_coaching',
    label: 'Private Household Transformations & Elite Coaching',
    headline: '2.5-hour session at your home or a custom location — $400',
    sessionMinutes: 150,
    calendarBlockMinutes: 240,
    priceLabel: '$400',
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
