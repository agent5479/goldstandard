import { describe, expect, it } from 'vitest';
import { breeds } from './breeds';
import { CATEGORY_NEURO_BLEND, resolveNeuroBlend } from './breedTraits';
import {
  blendTraitSegments,
  buildNeuroSegments,
  capSegmentBlend,
  getResolvedNeuroBlend,
} from './dogIntelligence';

describe('resolveNeuroBlend', () => {
  it('returns multi-pattern blends for Border Collie with fixation and anxious attachment', () => {
    const blend = capSegmentBlend(getResolvedNeuroBlend('Border Collie', 'herding'));
    const keys = Object.keys(blend);

    expect(keys.length).toBeLessThanOrEqual(3);
    expect(blend.fixation_loop).toBeGreaterThan(0);
    expect(blend.anxious_attachment).toBeGreaterThan(0);
    expect(blend.separation).toBeUndefined();

    const total = Object.values(blend).reduce((sum, w) => sum + w, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('returns category default multi-pattern blend when no breed override', () => {
    const breedWithoutOverride = breeds.find(
      (b) => b.category === 'scenthound' && !['Beagle', 'Basset Hound', 'Bloodhound', 'Coonhound', 'Foxhound (English / American)'].includes(b.name)
    );
    expect(breedWithoutOverride).toBeDefined();

    const blend = capSegmentBlend(
      getResolvedNeuroBlend(breedWithoutOverride!.name, breedWithoutOverride!.category)
    );
    expect(Object.keys(blend).length).toBeLessThanOrEqual(3);

    const total = Object.values(blend).reduce((sum, w) => sum + w, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('Golden Retriever skews toward lower-arousal patterns vs Border Collie', () => {
    const golden = capSegmentBlend(getResolvedNeuroBlend('Golden Retriever', 'clingy'));
    const collie = capSegmentBlend(getResolvedNeuroBlend('Border Collie', 'herding'));

    expect(golden.fixation_loop ?? 0).toBeLessThan(collie.fixation_loop ?? 0);
    expect((golden.handler_sensitive ?? 0) + (golden.separation ?? 0)).toBeGreaterThan(0.5);
  });

  it('applies tag boosts on top of base blend', () => {
    const base = { ...CATEGORY_NEURO_BLEND.clingy };
    const boosted = resolveNeuroBlend('Miniature Poodle', base);

    expect(boosted.anxious_attachment).toBeGreaterThan(base.anxious_attachment!);
    expect(boosted.hyper_vigilant ?? 0).toBeGreaterThan(0);
    expect(Object.values(boosted).reduce((sum, w) => sum + w, 0)).toBeCloseTo(1, 5);
  });
});

describe('buildNeuroSegments', () => {
  it('produces at most 3 segment weights matching capped resolved blend', () => {
    const segments = buildNeuroSegments('Border Collie', 'herding', 6.8);
    const blend = capSegmentBlend(getResolvedNeuroBlend('Border Collie', 'herding'));

    expect(segments.length).toBeLessThanOrEqual(3);
    expect(segments.find((s) => s.key === 'separation')).toBeUndefined();

    for (const seg of segments) {
      expect(blend[seg.key as keyof typeof blend]).toBeCloseTo(seg.weight, 5);
      expect(seg.score).toBe(6.8);
    }

    const weightSum = segments.reduce((sum, s) => sum + s.weight, 0);
    expect(weightSum).toBeCloseTo(1, 5);
  });

  it('caps tag-boosted Miniature Poodle to 3 segments', () => {
    const segments = buildNeuroSegments('Miniature Poodle', 'clingy', 7.0);
    expect(segments.length).toBeLessThanOrEqual(3);
    expect(segments.reduce((sum, s) => sum + s.weight, 0)).toBeCloseTo(1, 5);
  });
});

describe('blendTraitSegments', () => {
  it('caps mixed segment blends to 3 patterns', () => {
    const collieSegments = buildNeuroSegments('Border Collie', 'herding', 6.8);
    const poodleSegments = buildNeuroSegments('Miniature Poodle', 'clingy', 7.0);
    const blended = blendTraitSegments([
      { segments: collieSegments, fraction: 0.5 },
      { segments: poodleSegments, fraction: 0.5 },
    ]);

    expect(blended.length).toBeLessThanOrEqual(3);
    expect(blended.reduce((sum, s) => sum + s.weight, 0)).toBeCloseTo(1, 5);
  });
});
