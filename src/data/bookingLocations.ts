import {
  GOLDEN_BAY_MAP_CENTER,
  NELSON_BAYS_MAP_CENTER,
  type BookingRegionId,
  inferRegionFromLocationName,
} from '@shared/bookingRegions';

export type { BookingRegionId };

export type BookingLocationKind = 'standard' | 'home_visit' | 'elite_coaching';

export type BookingLocation = {
  id: string;
  name: string;
  regionId: BookingRegionId;
  lat: number;
  lng: number;
  kind?: BookingLocationKind;
  /** When true, used for API/sheet only — not shown as a map pin. */
  mapHidden?: boolean;
};

export const NELSON_BAYS_PLACEHOLDER_ID = 'nelson-bays-tbc';
export const GOLDEN_BAY_ELITE_ID = 'golden-bay-elite-coaching';
export const NELSON_BAYS_ELITE_ID = 'nelson-bays-elite-coaching';

/** @deprecated Use GOLDEN_BAY_ELITE_ID */
export const GOLDEN_BAY_HOME_VISIT_ID = GOLDEN_BAY_ELITE_ID;
/** @deprecated Use NELSON_BAYS_ELITE_ID */
export const NELSON_BAYS_HOME_VISIT_ID = NELSON_BAYS_ELITE_ID;

export const BOOKING_LOCATIONS: BookingLocation[] = [
  {
    id: 'pohara-beach',
    name: 'Pohara Beach',
    regionId: 'golden-bay',
    lat: -40.833616999861626,
    lng: 172.87812116840615,
  },
  {
    id: 'rototai-reserve',
    name: 'Rototai Reserve',
    regionId: 'golden-bay',
    lat: -40.83335723736718,
    lng: 172.83987286746938,
  },
  {
    id: 'rangihaeata-beach',
    name: 'Rangihaeata Beach',
    regionId: 'golden-bay',
    lat: -40.79828176324812,
    lng: 172.78051321002076,
  },
  {
    id: 'patons-rock',
    name: 'Patons Rock',
    regionId: 'golden-bay',
    lat: -40.78749415603961,
    lng: 172.76151432229932,
  },
  {
    id: GOLDEN_BAY_ELITE_ID,
    name: 'Elite coaching — Golden Bay',
    regionId: 'golden-bay',
    lat: GOLDEN_BAY_MAP_CENTER[0],
    lng: GOLDEN_BAY_MAP_CENTER[1],
    kind: 'elite_coaching',
    mapHidden: true,
  },
  {
    id: NELSON_BAYS_PLACEHOLDER_ID,
    name: 'Nelson Bays — location to be confirmed',
    regionId: 'nelson-bays',
    lat: NELSON_BAYS_MAP_CENTER[0],
    lng: NELSON_BAYS_MAP_CENTER[1],
    mapHidden: true,
  },
  {
    id: NELSON_BAYS_ELITE_ID,
    name: 'Elite coaching — Nelson Bays',
    regionId: 'nelson-bays',
    lat: NELSON_BAYS_MAP_CENTER[0],
    lng: NELSON_BAYS_MAP_CENTER[1],
    kind: 'elite_coaching',
    mapHidden: true,
  },
];

export const BOOKING_MAP_CENTER = GOLDEN_BAY_MAP_CENTER;

export function getMapCenterForRegion(regionId: BookingRegionId): [number, number] {
  return regionId === 'nelson-bays' ? NELSON_BAYS_MAP_CENTER : GOLDEN_BAY_MAP_CENTER;
}

function isMapPinLocation(location: BookingLocation): boolean {
  return location.kind !== 'home_visit' && location.kind !== 'elite_coaching';
}

export function getLocationsByRegion(regionId: BookingRegionId, includeHidden = false): BookingLocation[] {
  return BOOKING_LOCATIONS.filter(
    (location) =>
      location.regionId === regionId &&
      isMapPinLocation(location) &&
      (includeHidden || !location.mapHidden)
  );
}

export function getEliteLocationId(regionId: BookingRegionId): string {
  return regionId === 'nelson-bays' ? NELSON_BAYS_ELITE_ID : GOLDEN_BAY_ELITE_ID;
}

export function getEliteLocation(regionId: BookingRegionId): BookingLocation | undefined {
  return getLocationById(getEliteLocationId(regionId));
}

/** @deprecated Use getEliteLocationId */
export function getHomeVisitLocationId(regionId: BookingRegionId): string {
  return getEliteLocationId(regionId);
}

/** @deprecated Use getEliteLocation */
export function getHomeVisitLocation(regionId: BookingRegionId): BookingLocation | undefined {
  return getEliteLocation(regionId);
}

export function isEliteCoachingLocation(idOrName: string): boolean {
  const byId = getLocationById(idOrName);
  if (byId?.kind === 'elite_coaching') return true;
  const byName = getLocationByName(idOrName);
  return byName?.kind === 'elite_coaching';
}

export function isAddressBasedLocation(idOrName: string): boolean {
  const byId = getLocationById(idOrName);
  if (byId?.kind === 'elite_coaching' || byId?.kind === 'home_visit') return true;
  const byName = getLocationByName(idOrName);
  return byName?.kind === 'elite_coaching' || byName?.kind === 'home_visit';
}

/** @deprecated Use isAddressBasedLocation or isEliteCoachingLocation */
export function isHomeVisitLocation(idOrName: string): boolean {
  return isAddressBasedLocation(idOrName);
}

export function getLocationById(id: string): BookingLocation | undefined {
  return BOOKING_LOCATIONS.find((location) => location.id === id);
}

export function getLocationByName(name: string): BookingLocation | undefined {
  return BOOKING_LOCATIONS.find((location) => location.name === name);
}

export function isValidLocationForRegion(locationName: string, regionId: BookingRegionId): boolean {
  const location = getLocationByName(locationName);
  return Boolean(location && location.regionId === regionId);
}

export function getLocationMapsUrl(location: BookingLocation): string {
  return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
}

export { inferRegionFromLocationName };
