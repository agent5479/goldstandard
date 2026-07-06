import { describe, expect, it } from 'vitest';
import {
  formatBookingDateOnly,
  formatBookingTimeOnly,
  formatBookingWhen,
  parseBookingInstant,
  parseBookingWallDateTime,
} from '@shared/bookingDateTime';

describe('bookingDateTime', () => {
  it('formats Pacific/Auckland calendar date from offset ISO instant', () => {
    const instant = parseBookingInstant('2026-07-17T11:00:00+12:00');
    expect(instant).not.toBeNull();
    expect(formatBookingDateOnly(instant!)).toBe('2026-07-17');
    expect(formatBookingTimeOnly(instant!)).toBe('11:00');
  });

  it('does not shift NZ morning appointments to the previous UTC day', () => {
    const instant = parseBookingInstant('2026-06-20T10:00:00+12:00');
    expect(instant).not.toBeNull();
    expect(formatBookingDateOnly(instant!)).toBe('2026-06-20');
    expect(formatBookingTimeOnly(instant!)).toBe('10:00');
  });

  it('round-trips Auckland wall clock through parseBookingWallDateTime', () => {
    const parsed = parseBookingWallDateTime('2026-07-17', '11:00');
    expect(parsed).not.toBeNull();
    expect(formatBookingWhen(parsed!)).toContain('17');
    expect(formatBookingTimeOnly(parsed!)).toBe('11:00');
  });
});
