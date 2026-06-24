/** Booking regions — keep in sync with google-apps-script/Code.gs REGIONS. */

import type { BookingServiceType } from './bookingServiceTypes';

export type BookingRegionId = 'golden-bay' | 'nelson-bays';

export type BookingRegionStatus = 'active' | 'coming_soon';

export interface BookingRegion {
  id: BookingRegionId;
  label: string;
  status: BookingRegionStatus;
}

export const BOOKING_REGIONS: BookingRegion[] = [
  { id: 'golden-bay', label: 'Golden Bay', status: 'active' },
  { id: 'nelson-bays', label: 'Nelson Bays', status: 'active' },
];

/** Flip to true when Nelson beach sessions open on advertised dates (NELSON calendar events). */
export const NELSON_STANDARD_ONLINE_BOOKING = false;

/** Flip to true when Nelson elite coaching accepts online slot booking. */
export const NELSON_ELITE_ONLINE_BOOKING = false;

export const NELSON_STANDARD_COMING_SOON_NOTE =
  'Nelson beach sessions will open on advertised dates — likely a weekend when Warwick runs a Nelson push. Enquire to hear when dates are set.';

export const NELSON_ELITE_CONTACT_NOTE =
  '$400 elite coaching at your home or a custom location in Nelson Bays — travel included. Arrange by enquiry rather than instant online booking.';

export function isRegionServiceBookableOnline(
  regionId: BookingRegionId,
  serviceType: BookingServiceType
): boolean {
  if (regionId === 'golden-bay') {
    return true;
  }
  if (regionId === 'nelson-bays') {
    if (serviceType === 'standard_beach') {
      return NELSON_STANDARD_ONLINE_BOOKING;
    }
    if (serviceType === 'elite_coaching') {
      return NELSON_ELITE_ONLINE_BOOKING;
    }
  }
  return false;
}

export const NELSON_BAYS_MAP_CENTER: [number, number] = [-41.27, 173.28];

export const GOLDEN_BAY_MAP_CENTER: [number, number] = [-40.8064, 172.794];

export function getRegionById(id: string): BookingRegion | undefined {
  return BOOKING_REGIONS.find((region) => region.id === id);
}

export function isValidRegionId(id: string): id is BookingRegionId {
  return BOOKING_REGIONS.some((region) => region.id === id);
}

/** Infer region from a stored location name (legacy sheet rows). */
export function inferRegionFromLocationName(locationName: string): BookingRegionId | '' {
  const name = locationName.trim().toLowerCase();
  if (!name) return '';
  if (name.includes('nelson')) return 'nelson-bays';
  const goldenBayNames = [
    'pohara beach',
    'rototai reserve',
    'rangihaeata beach',
    'patons rock',
  ];
  if (goldenBayNames.some((loc) => name === loc)) return 'golden-bay';
  return '';
}
