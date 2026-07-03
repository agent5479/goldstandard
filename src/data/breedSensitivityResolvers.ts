import {
  breedTraitProfiles,
  findBreedByName,
  getBreedSuggestedProfileTags,
  NEUROTICISM_LABELS,
  type NeuroticismInclination,
} from './breedTraits';
import {
  BREED_LIFE_PHASE_OVERRIDES,
  BREED_SENSITIVITY_OVERRIDES,
  CATEGORY_LIFE_PHASE_DEFAULTS,
  CATEGORY_SENSITIVITY_DEFAULTS,
  CATEGORY_SENSITIVITY_SUMMARIES,
  inclinationAtLeast,
  mergeSensitivityProfiles,
  SENSITIVITY_GUIDE_ANCHORS,
  SENSITIVITY_IDS,
  SENSITIVITY_LABELS,
  SLOW_MATURING_BREED_NAMES,
  TAG_SENSITIVITY_MINIMUMS,
  type BreedLifePhaseNotes,
  type BreedSensitivityDetail,
  type SensitivityId,
  type SensitivityInclination,
} from './breedSensitivities';

type SensitivityLevels = Record<SensitivityId, SensitivityInclination>;

const INCLINATION_RANK: Record<SensitivityInclination, number> = {
  low: 0,
  moderate: 1,
  elevated: 2,
  high: 3,
};

function resolveSensitivityLevels(breedName: string): SensitivityLevels {
  const breed = findBreedByName(breedName);
  if (!breed) {
    return CATEGORY_SENSITIVITY_DEFAULTS.clingy;
  }

  const categoryLevels = CATEGORY_SENSITIVITY_DEFAULTS[breed.category];
  const profile = breedTraitProfiles[breed.name] ?? {};
  const merged = mergeSensitivityProfiles(
    { levels: categoryLevels },
    profile.sensitivities,
    BREED_SENSITIVITY_OVERRIDES[breed.name]
  );

  const levels = { ...categoryLevels, ...merged.levels } as SensitivityLevels;

  for (const tag of getBreedSuggestedProfileTags(breedName)) {
    const mins = TAG_SENSITIVITY_MINIMUMS[tag];
    if (!mins) continue;
    for (const [id, minimum] of Object.entries(mins) as [SensitivityId, SensitivityInclination][]) {
      if (INCLINATION_RANK[levels[id]] < INCLINATION_RANK[minimum]) {
        levels[id] = minimum;
      }
    }
  }

  return levels;
}

export function getBreedSensitivitySummary(breedName: string): string {
  const breed = findBreedByName(breedName);
  if (!breed) return CATEGORY_SENSITIVITY_SUMMARIES.clingy;

  const profile = breedTraitProfiles[breed.name] ?? {};
  const override = BREED_SENSITIVITY_OVERRIDES[breed.name];
  return (
    profile.sensitivities?.summary ??
    override?.summary ??
    CATEGORY_SENSITIVITY_SUMMARIES[breed.category]
  );
}

export function getBreedSensitivityDetail(breedName: string): BreedSensitivityDetail[] {
  const breed = findBreedByName(breedName);
  if (!breed) return [];

  const levels = resolveSensitivityLevels(breedName);
  const profile = breedTraitProfiles[breed.name] ?? {};
  const override = BREED_SENSITIVITY_OVERRIDES[breed.name];
  const notes = {
    ...profile.sensitivities?.notes,
    ...override?.notes,
  };

  return SENSITIVITY_IDS.map((id) => ({
    id,
    label: SENSITIVITY_LABELS[id],
    level: levels[id] as NeuroticismInclination,
    levelLabel: NEUROTICISM_LABELS[levels[id]],
    note: notes[id],
    guideAnchors: SENSITIVITY_GUIDE_ANCHORS[id],
  }));
}

export function getBreedLifePhaseNotes(breedName: string): BreedLifePhaseNotes {
  const breed = findBreedByName(breedName);
  if (!breed) return CATEGORY_LIFE_PHASE_DEFAULTS.clingy;

  const profile = breedTraitProfiles[breed.name] ?? {};
  const categoryNotes = CATEGORY_LIFE_PHASE_DEFAULTS[breed.category];
  const override = BREED_LIFE_PHASE_OVERRIDES[breed.name];
  const profileNotes = profile.lifePhase;

  return {
    puppy: profileNotes?.puppy ?? override?.puppy ?? categoryNotes.puppy,
    adolescent: profileNotes?.adolescent ?? override?.adolescent ?? categoryNotes.adolescent,
    maturationNote:
      profileNotes?.maturationNote ??
      override?.maturationNote ??
      (SLOW_MATURING_BREED_NAMES.has(breed.name)
        ? categoryNotes.maturationNote ?? 'Slow to mature — adult expectations may apply later than two years.'
        : categoryNotes.maturationNote),
  };
}

export function assertTagSensitivityConsistency(breedName: string): string[] {
  const errors: string[] = [];
  const levels = resolveSensitivityLevels(breedName);
  for (const tag of getBreedSuggestedProfileTags(breedName)) {
    const mins = TAG_SENSITIVITY_MINIMUMS[tag];
    if (!mins) continue;
    for (const [id, minimum] of Object.entries(mins) as [SensitivityId, SensitivityInclination][]) {
      if (!inclinationAtLeast(levels[id], minimum)) {
        errors.push(`${breedName}: tag "${tag}" requires ${id} >= ${minimum}, got ${levels[id]}`);
      }
    }
  }
  return errors;
}
