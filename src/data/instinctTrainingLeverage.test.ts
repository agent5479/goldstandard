import { describe, expect, it } from 'vitest';
import { buildInstinctSegments } from './dogIntelligence';
import {
  getInstinctLeverageProfile,
  INSTINCT_LEVERAGE_PROFILES,
  resolveTrainingLeverage,
} from './instinctTrainingLeverage';

describe('instinctTrainingLeverage', () => {
  it('defines one profile per instinct subtype', () => {
    expect(INSTINCT_LEVERAGE_PROFILES).toHaveLength(8);
    const keys = new Set(INSTINCT_LEVERAGE_PROFILES.map((p) => p.instinct));
    expect(keys.size).toBe(8);
  });

  it('returns scent methods first for Beagle', () => {
    const segments = buildInstinctSegments('Beagle', 'scenthound', 9);
    const blocks = resolveTrainingLeverage(segments, { breedName: 'Beagle' });
    expect(blocks[0]?.instinct).toBe('scent');
    expect(blocks[0]?.methods.some((m) => m.id === 'scent-hand-hidden-find')).toBe(true);
    expect(blocks[0]?.breedNote).toMatch(/find-it|scent/i);
  });

  it('includes backward-run method for Jack Russell hunt_dig', () => {
    const segments = buildInstinctSegments('Jack Russell Terrier', 'terrier', 8.2);
    const blocks = resolveTrainingLeverage(segments, { breedName: 'Jack Russell Terrier' });
    expect(blocks[0]?.instinct).toBe('hunt_dig');
    expect(blocks[0]?.methods.some((m) => m.id === 'hunt-backward-proximity')).toBe(true);
  });

  it('returns a single block for category-default breeds', () => {
    const segments = buildInstinctSegments('Bloodhound', 'scenthound', 9);
    const blocks = resolveTrainingLeverage(segments);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.weight).toBeCloseTo(1, 2);
  });

  it('returns multiple blocks ordered by weight for blended segments', () => {
    const segments = [
      { key: 'scent' as const, label: 'Scent', hue: '#D99A45', weight: 0.5, score: 9 },
      { key: 'retrieve' as const, label: 'Retrieve', hue: '#4DB892', weight: 0.5, score: 8 },
    ];
    const blocks = resolveTrainingLeverage(segments);
    expect(blocks).toHaveLength(2);
    expect(blocks.map((b) => b.instinct)).toEqual(['scent', 'retrieve']);
  });

  it('omits segments below minimum weight', () => {
    const segments = [
      { key: 'scent' as const, label: 'Scent', hue: '#D99A45', weight: 0.85, score: 9 },
      { key: 'companion' as const, label: 'Companion', hue: '#E88AA8', weight: 0.1, score: 7 },
    ];
    const blocks = resolveTrainingLeverage(segments);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.instinct).toBe('scent');
  });

  it('getInstinctLeverageProfile returns scent profile', () => {
    const profile = getInstinctLeverageProfile('scent');
    expect(profile?.methods.length).toBeGreaterThan(0);
    expect(profile?.headline).toMatch(/scent/i);
  });
});
