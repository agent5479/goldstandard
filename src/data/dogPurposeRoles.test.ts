import { describe, expect, it } from 'vitest';
import { PURPOSE_ROLES } from './dogPurposeRoles';
import { buildRoleFitInputFromMix } from '../utils/roleFit';

describe('dogPurposeRoles', () => {
  it('defines ten purpose roles in two groups', () => {
    expect(PURPOSE_ROLES).toHaveLength(10);
    expect(PURPOSE_ROLES.filter((role) => role.group === 'trainer_pack')).toHaveLength(7);
    expect(PURPOSE_ROLES.filter((role) => role.group === 'family')).toHaveLength(3);
  });

  it('resolves every curated blend recipe against the intelligence tables', () => {
    for (const role of PURPOSE_ROLES) {
      for (const recipe of role.blendRecipes) {
        const input = buildRoleFitInputFromMix(recipe.parents);
        expect(input, recipe.title).toBeTruthy();
        expect(input?.ranges?.length).toBeGreaterThan(0);
      }
    }
  });
});
