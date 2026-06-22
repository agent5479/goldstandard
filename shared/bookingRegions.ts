/** Booking regions — keep in sync with google-apps-script/Code.gs REGIONS. */

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
