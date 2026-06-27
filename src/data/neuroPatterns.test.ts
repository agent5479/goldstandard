import { describe, expect, it } from 'vitest';
import { breeds } from './breeds';
import { CATEGORY_NEURO_BLEND, resolveNeuroBlend } from './breedTraits';
import {
  buildNeuroSegments,
  getResolvedNeuroBlend,
} from './dogIntelligence';

describe('resolveNeuroBlend', () => {
  it('returns multi-pattern blends for Border Collie with fixation and anxious attachment', () => {
    const blend = getResolvedNeuroBlend('Border Collie', 'herding');
    const keys = Object.keys(blend);

    expect(keys.length).toBeGreaterThanOrEqual(3);
    expect(blend.fixation_loop).toBeGreaterThan(0);
    expect(blend.anxious_attachment).toBeGreaterThan(0);

    const total = Object.values(blend).reduce((sum, w) => sum + w, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('returns category default multi-pattern blend when no breed override', () => {
    const breedWithoutOverride = breeds.find(
      (b) => b.category === 'scenthound' && !['Beagle', 'Basset Hound'].includes(b.name)
    );
    expect(breedWithoutOverride).toBeDefined();

    const blend = getResolvedNeuroBlend(breedWithoutOverride!.name, breedWithoutOverride!.category);
    expect(Object.keys(blend).length).toBeGreaterThanOrEqual(3);

    const total = Object.values(blend).reduce((sum, w) => sum + w, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('Golden Retriever skews toward lower-arousal patterns vs Border Collie', () => {
    const golden = getResolvedNeuroBlend('Golden Retriever', 'clingy');
    const collie = getResolvedNeuroBlend('Border Collie', 'herding');

    expect(golden.fixation_loop ?? 0).toBeLessThan(collie.fixation_loop ?? 0);
    expect((golden.handler_sensitive ?? 0) + (golden.separation ?? 0)).toBeGreaterThan(0.8);
  });

  it('applies tag boosts on top of base blend', () => {
    const base = { ...CATEGORY_NEURO_BLEND.clingy };
    const boosted = resolveNeuroBlend('Miniature Poodle', base);

    expect(boosted.anxious_attachment).toBeGreaterThan(base.anxious_attachment!);
    expect(boosted.hyper_vigilant).toBeGreaterThan(base.hyper_vigilant!);
  });
});

describe('buildNeuroSegments', () => {
  it('produces segment weights matching resolved blend', () => {
    const segments = buildNeuroSegments('Border Collie', 'herding', 6.8);
    const blend = getResolvedNeuroBlend('Border Collie', 'herding');

    for (const seg of segments) {
      expect(blend[seg.key as keyof typeof blend]).toBeCloseTo(seg.weight, 5);
      expect(seg.score).toBe(6.8);
    }

    const weightSum = segments.reduce((sum, s) => sum + s.weight, 0);
    expect(weightSum).toBeCloseTo(1, 5);
  });
});
