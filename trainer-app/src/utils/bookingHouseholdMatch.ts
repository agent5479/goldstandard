import type { PendingBooking } from '@/services/bookingImport';
import { countOwnerTrainingSessions } from '@/services/bookingImport';
import type { Owner, TenantData } from '@/types';

export const SUGGESTION_MIN_SCORE = 15;
export const SUGGESTION_MAX_RESULTS = 5;

export function normalizeBookingEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeBookingPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export interface HouseholdMatchSuggestion {
  owner: Owner;
  score: number;
  reasons: string[];
  priorSessionCount: number;
}

function nameTokens(name: string): string[] {
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length >= 2);
}

function scoreOwnerMatch(
  booking: PendingBooking,
  owner: Owner,
  data: TenantData
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const bookingEmail = booking.email?.trim();
  const bookingPhone = booking.phone?.trim();
  const bookingName = booking.name?.trim().toLowerCase() || '';
  const ownerEmail = owner.email?.trim();
  const ownerPhone = owner.phone?.trim();
  const ownerName = owner.name?.trim().toLowerCase() || '';

  if (bookingEmail && ownerEmail) {
    if (normalizeBookingEmail(bookingEmail) === normalizeBookingEmail(ownerEmail)) {
      score += 100;
      reasons.push('Same email');
    }
  }

  if (bookingPhone && ownerPhone) {
    const bookingDigits = normalizeBookingPhone(bookingPhone);
    const ownerDigits = normalizeBookingPhone(ownerPhone);
    if (bookingDigits && ownerDigits && bookingDigits === ownerDigits) {
      score += 90;
      reasons.push('Same phone');
    } else if (
      bookingDigits.length >= 7 &&
      ownerDigits.length >= 7 &&
      bookingDigits.slice(-7) === ownerDigits.slice(-7)
    ) {
      score += 25;
      reasons.push('Phone last 7 digits');
    }
  }

  if (bookingName && ownerName) {
    if (bookingName === ownerName) {
      score += 40;
      reasons.push('Same name');
    } else if (ownerName.includes(bookingName) || bookingName.includes(ownerName)) {
      score += 30;
      reasons.push('Similar name');
    } else {
      const bookingParts = nameTokens(booking.name || '');
      const ownerParts = nameTokens(owner.name || '');
      const overlap = bookingParts.filter((part) => ownerParts.includes(part));
      if (overlap.length > 0) {
        score += 20;
        reasons.push('Name overlap');
      }
    }
  }

  const dogName = booking.dogName?.trim().toLowerCase();
  if (dogName) {
    const sameDog = data.dogs.some(
      (dog) =>
        String(dog.ownerId) === String(owner.id) &&
        dog.name?.trim().toLowerCase() === dogName
    );
    if (sameDog) {
      score += 15;
      reasons.push('Same dog name');
    }
  }

  return { score, reasons };
}

export function findBookingHouseholdSuggestions(
  booking: PendingBooking,
  data: TenantData
): HouseholdMatchSuggestion[] {
  const scored = data.owners
    .map((owner) => {
      const { score, reasons } = scoreOwnerMatch(booking, owner, data);
      return {
        owner,
        score,
        reasons,
        priorSessionCount: countOwnerTrainingSessions(data, String(owner.id)),
      };
    })
    .filter((entry) => entry.score >= SUGGESTION_MIN_SCORE)
    .sort((a, b) => b.score - a.score || (a.owner.name || '').localeCompare(b.owner.name || ''));

  return scored.slice(0, SUGGESTION_MAX_RESULTS);
}

export function topBookingHouseholdSuggestion(
  booking: PendingBooking,
  data: TenantData
): HouseholdMatchSuggestion | null {
  return findBookingHouseholdSuggestions(booking, data)[0] ?? null;
}

export function ownerMatchesSearch(owner: Owner, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    owner.name,
    owner.email,
    owner.phone,
    String(owner.id),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (haystack.includes(q)) return true;

  const queryDigits = normalizeBookingPhone(q);
  if (queryDigits.length >= 3) {
    const phoneHaystack = normalizeBookingPhone(haystack);
    return phoneHaystack.includes(queryDigits);
  }

  return false;
}
