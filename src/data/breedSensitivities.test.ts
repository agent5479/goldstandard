import { describe, expect, it } from 'vitest';
import { breeds } from './breeds';
import {
  CATEGORY_LIFE_PHASE_DEFAULTS,
  CATEGORY_SENSITIVITY_DEFAULTS,
  SENSITIVITY_IDS,
  SLOW_MATURING_BREED_NAMES,
} from './breedSensitivities';
import {
  assertTagSensitivityConsistency,
  getBreedLifePhaseNotes,
  getBreedSensitivityDetail,
} from './breedSensitivityResolvers';

describe('breed sensitivities', () => {
  it('defines category defaults for every sensitivity dimension', () => {
    for (const category of Object.keys(CATEGORY_SENSITIVITY_DEFAULTS) as (keyof typeof CATEGORY_SENSITIVITY_DEFAULTS)[]) {
      for (const id of SENSITIVITY_IDS) {
        expect(CATEGORY_SENSITIVITY_DEFAULTS[category][id]).toBeDefined();
      }
    }
  });

  it('defines life-phase defaults for every category', () => {
    for (const category of Object.keys(CATEGORY_LIFE_PHASE_DEFAULTS) as (keyof typeof CATEGORY_LIFE_PHASE_DEFAULTS)[]) {
      const notes = CATEGORY_LIFE_PHASE_DEFAULTS[category];
      expect(notes.puppy).toBeTruthy();
      expect(notes.adolescent).toBeTruthy();
    }
  });

  it('resolves eight sensitivity dimensions for every breed', () => {
    for (const breed of breeds) {
      const details = getBreedSensitivityDetail(breed.name);
      expect(details).toHaveLength(8);
      expect(details.map((d) => d.id).sort()).toEqual([...SENSITIVITY_IDS].sort());
    }
  });

  it('resolves life-phase notes for every breed', () => {
    for (const breed of breeds) {
      const notes = getBreedLifePhaseNotes(breed.name);
      expect(notes.puppy).toBeTruthy();
      expect(notes.adolescent).toBeTruthy();
    }
  });

  it('assigns maturation notes to slow-maturing breeds', () => {
    for (const name of SLOW_MATURING_BREED_NAMES) {
      const breed = breeds.find((b) => b.name === name);
      if (!breed) continue;
      const notes = getBreedLifePhaseNotes(name);
      expect(notes.maturationNote).toBeTruthy();
    }
  });

  it('keeps suggested profile tags consistent with sensitivity levels', () => {
    const errors = breeds.flatMap((breed) => assertTagSensitivityConsistency(breed.name));
    expect(errors).toEqual([]);
  });

  it('elevates noise sensitivity for Miniature Poodle via tags', () => {
    const noise = getBreedSensitivityDetail('Miniature Poodle').find((d) => d.id === 'noise');
    expect(noise?.level).toBeDefined();
    const handler = getBreedSensitivityDetail('Miniature Poodle').find((d) => d.id === 'handler_mood');
    expect(['elevated', 'high']).toContain(handler?.level);
  });

  it('gives Border Collie high movement_visual sensitivity', () => {
    const movement = getBreedSensitivityDetail('Border Collie').find((d) => d.id === 'movement_visual');
    expect(movement?.level).toBe('high');
  });
});
