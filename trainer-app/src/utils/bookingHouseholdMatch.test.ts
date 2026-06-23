import { describe, expect, it } from 'vitest';
import { SAMPLE_PENDING_BOOKING } from '@shared/bookingTestFixture';
import {
  findBookingHouseholdSuggestions,
  normalizeBookingEmail,
  normalizeBookingPhone,
  ownerMatchesSearch,
} from './bookingHouseholdMatch';
import type { Owner, TenantData } from '@/types';

const emptyTenant: TenantData = {
  owners: [],
  dogs: [],
  trainingLogs: [],
  scheduledSessions: [],
  trainingFocus: [],
  trainingSessions: [],
  clientReports: [],
  deletedRecords: {},
  activityLog: [],
};

function owner(overrides: Partial<Owner> & Pick<Owner, 'id'>): Owner {
  return {
    name: '',
    ...overrides,
  };
}

describe('bookingHouseholdMatch', () => {
  it('normalizes email and phone for comparison', () => {
    expect(normalizeBookingEmail('  Alex@Example.COM ')).toBe('alex@example.com');
    expect(normalizeBookingPhone('021-555-1234')).toBe('0215551234');
  });

  it('ranks phone match above partial name match', () => {
    const booking = {
      ...SAMPLE_PENDING_BOOKING,
      email: 'new@example.com',
      name: 'Alex Owner',
      phone: '0215551234',
    };

    const tenant: TenantData = {
      ...emptyTenant,
      owners: [
        owner({ id: 'owner_name', name: 'Alex Owner', phone: '0219999999', email: 'other@example.com' }),
        owner({ id: 'owner_phone', name: 'Different Name', phone: '0215551234', email: 'phone@example.com' }),
      ],
    };

    const suggestions = findBookingHouseholdSuggestions(booking, tenant);
    expect(suggestions[0]?.owner.id).toBe('owner_phone');
    expect(suggestions[0]?.reasons).toContain('Same phone');
  });

  it('surfaces phone suffix typo candidate', () => {
    const booking = {
      ...SAMPLE_PENDING_BOOKING,
      email: '',
      phone: '0215551234',
    };

    const tenant: TenantData = {
      ...emptyTenant,
      owners: [
        owner({ id: 'owner_suffix', name: 'Client', phone: '0395551234' }),
      ],
    };

    const suggestions = findBookingHouseholdSuggestions(booking, tenant);
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]?.reasons).toContain('Phone last 7 digits');
  });

  it('filters owners by search query', () => {
    const o = owner({ id: 'o1', name: 'Jane Smith', email: 'jane@example.com', phone: '0211112222' });
    expect(ownerMatchesSearch(o, 'jane@')).toBe(true);
    expect(ownerMatchesSearch(o, 'smith')).toBe(true);
    expect(ownerMatchesSearch(o, '021111')).toBe(true);
    expect(ownerMatchesSearch(o, 'nomatch')).toBe(false);
  });

  it('returns empty when no signal meets minimum score', () => {
    const booking = {
      ...SAMPLE_PENDING_BOOKING,
      email: 'unique@example.com',
      name: 'Nobody Here',
      phone: '0210000000',
    };

    const tenant: TenantData = {
      ...emptyTenant,
      owners: [
        owner({ id: 'o1', name: 'Completely Different', phone: '0219999999', email: 'other@example.com' }),
      ],
    };

    expect(findBookingHouseholdSuggestions(booking, tenant)).toHaveLength(0);
  });
});
