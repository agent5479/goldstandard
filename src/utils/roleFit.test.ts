import { describe, expect, it } from 'vitest';
import {
  rankBreedsForRole,
  scoreSubjectAllRoles,
  scoreSubjectForRole,
} from './roleFit';
import { classifyMixGambit } from './intelligenceMix';

describe('roleFit', () => {
  it('ranks German Shepherd as guardian, not ESD', () => {
    const guardian = scoreSubjectForRole({ kind: 'breed', breed: 'German Shepherd' }, 'guardian');
    const esd = scoreSubjectForRole({ kind: 'breed', breed: 'German Shepherd' }, 'esd_humans');
    expect(guardian).toBeTruthy();
    expect(esd).toBeTruthy();
    expect(guardian!.fit).toBeGreaterThan(esd!.fit);
    expect(guardian!.fit).toBeGreaterThan(55);

    const all = scoreSubjectAllRoles({ kind: 'breed', breed: 'German Shepherd' });
    expect(all?.roles[0]?.roleId).toBe('guardian');
  });

  it('ranks Golden Retriever as family/ESD, not boundary enforcer', () => {
    const esd = scoreSubjectForRole({ kind: 'breed', breed: 'Golden Retriever' }, 'esd_humans');
    const anchor = scoreSubjectForRole(
      { kind: 'breed', breed: 'Golden Retriever' },
      'family_emotional_anchor'
    );
    const enforcer = scoreSubjectForRole(
      { kind: 'breed', breed: 'Golden Retriever' },
      'helper_boundary_enforcer'
    );
    expect(esd!.fit).toBeGreaterThan(enforcer!.fit);
    expect(anchor!.fit).toBeGreaterThan(enforcer!.fit);
    expect(enforcer!.fit).toBeLessThan(55);

    const all = scoreSubjectAllRoles({ kind: 'breed', breed: 'Golden Retriever' });
    const topIds = all!.roles.slice(0, 3).map((role) => role.roleId);
    expect(
      topIds.some((id) => id === 'esd_humans' || id === 'family_emotional_anchor' || id === 'gold_standard_role_model')
    ).toBe(true);
    expect(topIds).not.toContain('helper_boundary_enforcer');
  });

  it('lists guardian specialists near the top of guardian ranking', () => {
    const ranked = rankBreedsForRole('guardian', { limit: 12 });
    const names = ranked.map((item) => item.breed);
    expect(names).toContain('German Shepherd');
    expect(ranked[0].fit.fit).toBeGreaterThan(60);
  });

  it('down-weights mix confidence when parent scores diverge', () => {
    const aligned = scoreSubjectAllRoles({
      kind: 'mix',
      parents: [
        { breed: 'Golden Retriever', fraction: 0.5 },
        { breed: 'Labrador Retriever', fraction: 0.5 },
      ],
    });
    const wide = scoreSubjectAllRoles({
      kind: 'mix',
      parents: [
        { breed: 'Border Collie', fraction: 0.5 },
        { breed: 'Afghan Hound', fraction: 0.5 },
      ],
    });
    expect(aligned).toBeTruthy();
    expect(wide).toBeTruthy();
    expect(wide!.input.mixGambit?.level).not.toBe('aligned');
    expect(wide!.roles[0].confidence).toBeLessThan(aligned!.roles[0].confidence);
  });

  it('flags a guardian parent in an ESD mix as conflict', () => {
    const fit = scoreSubjectForRole(
      {
        kind: 'mix',
        parents: [
          { breed: 'Golden Retriever', fraction: 0.5 },
          { breed: 'German Shepherd', fraction: 0.5 },
        ],
      },
      'esd_humans'
    );
    expect(fit?.gambitLevel).toBe('conflict');
    expect(fit?.cautions.some((caution) => /German Shepherd/i.test(caution))).toBe(true);
  });
});

describe('classifyMixGambit', () => {
  it('treats Golden × Labrador as aligned or moderate, not wide', () => {
    const result = classifyMixGambit([
      { breed: 'Golden Retriever', fraction: 0.5 },
      { breed: 'Labrador Retriever', fraction: 0.5 },
    ]);
    expect(result.level).not.toBe('wide');
  });

  it('flags GSD × Labrador opposing drives as a wide lottery', () => {
    const result = classifyMixGambit([
      { breed: 'German Shepherd', fraction: 0.5 },
      { breed: 'Labrador Retriever', fraction: 0.5 },
    ]);
    expect(result.level).toBe('wide');
    expect(result.signals.some((signal) => signal.source === 'instinct' || signal.source === 'dimension')).toBe(
      true
    );
  });
});
