export interface HouseholdNavState {
  returnTo?: string;
}

export function householdReturnPath(ownerId: string, hash = ''): string {
  return `/households/${ownerId}${hash}`;
}

export function resolveHouseholdReturnTo(
  returnTo: string | undefined,
  ownerId: string,
  hash = ''
): string {
  const fallback = householdReturnPath(ownerId, hash);
  if (!returnTo) return fallback;
  if (returnTo.startsWith(`/households/${ownerId}`)) return returnTo;
  return fallback;
}
