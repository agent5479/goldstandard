import { describe, expect, it } from 'vitest';
import {
  CULTIVATION_CHECKPOINTS,
  resolveCultivationTimeline,
} from './nervousSystemCultivation';

describe('nervousSystemCultivation', () => {
  it('defines the named checkpoints including 7 weeks, 12 weeks, and 7 months', () => {
    const ids = CULTIVATION_CHECKPOINTS.map((checkpoint) => checkpoint.id);
    expect(ids).toEqual(['w7', 'w8', 'w12', 'm4', 'm7', 'm12', 'm18']);
    expect(CULTIVATION_CHECKPOINTS.find((checkpoint) => checkpoint.id === 'w7')?.ageWeeks).toBe(7);
    expect(CULTIVATION_CHECKPOINTS.find((checkpoint) => checkpoint.id === 'w12')?.ageWeeks).toBe(12);
    expect(CULTIVATION_CHECKPOINTS.find((checkpoint) => checkpoint.id === 'm7')?.ageWeeks).toBe(30);
  });

  it('defers hard corrections at 12 weeks', () => {
    const timeline = resolveCultivationTimeline({ breedNames: ['Golden Retriever'] });
    const twelve = timeline.find((row) => row.meta.id === 'w12');
    expect(twelve?.defer.join(' ')).toMatch(/hard correction/i);
    expect(twelve?.stage.id).toBe('safety_routine');
  });

  it('ramps accountability at 7 months', () => {
    const timeline = resolveCultivationTimeline({ breedNames: ['Labrador Retriever'] });
    const seven = timeline.find((row) => row.meta.id === 'm7');
    expect(seven?.cultivate.join(' ')).toMatch(/adult standard|seven months/i);
    expect(seven?.meta.lifePhase).toBe('adolescent');
  });

  it('adds herding eye-lock overlay for Border Collies at 12 weeks', () => {
    const timeline = resolveCultivationTimeline({ breedNames: ['Border Collie'] });
    const twelve = timeline.find((row) => row.meta.id === 'w12');
    expect(twelve?.observed.join(' ') + twelve?.cultivate.join(' ')).toMatch(/eye-lock|stare/i);
  });

  it('flags mix category divergence as a cultivation gambit', () => {
    const timeline = resolveCultivationTimeline({
      breedNames: ['Golden Retriever', 'German Shepherd'],
      roleId: 'esd_humans',
    });
    expect(timeline[0]?.divergence).toMatch(/Mix cultivation gambit/i);
    expect(timeline.find((row) => row.meta.id === 'w12')?.roleOverlay?.defer.join(' ')).toMatch(
      /comfort object|needy/i
    );
  });
});
