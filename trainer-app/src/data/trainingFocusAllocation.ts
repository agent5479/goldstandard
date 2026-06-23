import type { DogProfileTagId } from '@/data/dogProfileTags';
import { getFocusById, type OwnerCapacityDomain } from '@/data/assessmentTaxonomy';

/** Focus areas demonstrated by the household / handler — merged into guideTags (see FOCUS_TO_GUIDE_ANCHOR). */
export const HOUSEHOLD_COMPETENCY_FOCUS_IDS = [
  'focus_001', // Access Training → access
  'focus_002', // Timing → timing
  'focus_003', // Rewards → rewards
  'focus_004', // Ready Stance → ready-stance
  'focus_010', // Verbal Correction → verbal-correction
  'focus_011', // Leash Jerk → leash-jerk
  'focus_020', // Collar Selection → collar-selection
  'focus_021', // Leash Work → leash
  'focus_030', // Front Door → front-door
  'focus_031', // Check-In Seven → check-in-seven
  'focus_032', // Daily Practice → daily
  'focus_040', // Reading Dog → reading-dog
  'focus_041', // Dog Language → dog-language
] as const;

/** Maps legacy household competency focus IDs to public guide anchor IDs. */
export const FOCUS_TO_GUIDE_ANCHOR: Record<string, string> = {
  focus_001: 'access',
  focus_002: 'timing',
  focus_003: 'rewards',
  focus_004: 'ready-stance',
  focus_010: 'verbal-correction',
  focus_011: 'leash-jerk',
  focus_020: 'collar-selection',
  focus_021: 'leash',
  focus_030: 'front-door',
  focus_031: 'check-in-seven',
  focus_032: 'daily',
  focus_040: 'reading-dog',
  focus_041: 'dog-language',
};

/** Legacy dog skill achievement IDs (removed from UI — migrated to profile tags). */
export const LEGACY_DOG_SKILL_ACHIEVEMENT_IDS = [
  'focus_050',
  'focus_051',
  'focus_052',
  'focus_053',
  'focus_054',
] as const;

const HOUSEHOLD_COMPETENCY_SET = new Set<string>(HOUSEHOLD_COMPETENCY_FOCUS_IDS);
const LEGACY_DOG_SKILL_ACHIEVEMENT_SET = new Set<string>(LEGACY_DOG_SKILL_ACHIEVEMENT_IDS);

/** Maps legacy skill-achievement ticks to profile tags. */
const LEGACY_ACHIEVEMENT_PROFILE_TAGS: Record<string, DogProfileTagId[]> = {
  focus_050: ['recall_priority'],
  focus_051: ['reactivity_priority', 'leash_heel_priority', 'leash_reactive', 'reactive', 'dog_reactive'],
  focus_052: ['impulse_priority', 'high_drive', 'prey_drive', 'trigger_movement'],
  focus_053: ['socialisation_priority'],
  focus_054: ['rehabituation', 'trauma_history', 'fearful', 'anxious'],
};

/** Maps household focus achievements to owner capacity domains for grouped UI. */
export const FOCUS_TO_OWNER_CAPACITY_DOMAIN: Record<string, OwnerCapacityDomain> = {
  focus_001: 'access_rewards',
  focus_002: 'timing',
  focus_003: 'access_rewards',
  focus_004: 'owner_mindset',
  focus_010: 'owner_mindset',
  focus_011: 'equipment',
  focus_020: 'equipment',
  focus_021: 'equipment',
  focus_030: 'routine_thresholds',
  focus_031: 'routine_thresholds',
  focus_032: 'routine_thresholds',
  focus_040: 'reading_signals',
  focus_041: 'reading_signals',
};

export function guideAnchorForCompetencyFocus(focusId: string): string | undefined {
  return FOCUS_TO_GUIDE_ANCHOR[focusId];
}

export function mergeCompetencyFocusIntoGuideTags(
  guideTags: string[] | undefined,
  competencyFocusIds: string[]
): string[] {
  const tags = new Set(guideTags || []);
  for (const focusId of competencyFocusIds) {
    const anchorId = guideAnchorForCompetencyFocus(focusId);
    if (anchorId) tags.add(anchorId);
  }
  return [...tags];
}

/** Merge legacy competencyAchievementIds (and dog copies) into guideTags; clear the old field. */
export function normalizeOwnerGuideTags(
  owner: { guideTags?: string[]; competencyAchievementIds?: string[] },
  dogAchievementIds: string[][] = []
): { guideTags: string[]; competencyAchievementIds: string[]; changed: boolean } {
  const competencyIds = resolveOwnerCompetencyAchievementIds(
    owner.competencyAchievementIds,
    dogAchievementIds
  );
  const guideTags = mergeCompetencyFocusIntoGuideTags(owner.guideTags, competencyIds);
  const changed =
    competencyIds.length > 0 ||
    guideTags.length !== (owner.guideTags || []).length ||
    (owner.competencyAchievementIds || []).length > 0;
  return { guideTags, competencyAchievementIds: [], changed };
}

export function isHouseholdCompetencyFocus(focusId: string): boolean {
  return HOUSEHOLD_COMPETENCY_SET.has(focusId);
}

export function isLegacyDogSkillAchievementFocus(focusId: string): boolean {
  return LEGACY_DOG_SKILL_ACHIEVEMENT_SET.has(focusId);
}

export function getHouseholdAchievementsForDomain(domainId: OwnerCapacityDomain): string[] {
  return HOUSEHOLD_COMPETENCY_FOCUS_IDS.filter(
    (focusId) => FOCUS_TO_OWNER_CAPACITY_DOMAIN[focusId] === domainId
  );
}

export function resolveOwnerCompetencyAchievementIds(
  competencyAchievementIds: string[] | undefined,
  legacyDogAchievementIds: string[][] = []
): string[] {
  const ids = new Set<string>();
  for (const id of competencyAchievementIds || []) {
    if (isHouseholdCompetencyFocus(id)) ids.add(id);
  }
  for (const legacy of legacyDogAchievementIds) {
    for (const id of legacy) {
      if (isHouseholdCompetencyFocus(id)) ids.add(id);
    }
  }
  return [...ids];
}

/** @deprecated Legacy — use profile tags. Returns only household competency IDs still stored on dogs. */
export function resolveDogSkillAchievementIds(achievementFocusIds: string[] | undefined): string[] {
  return (achievementFocusIds || []).filter((id) => isLegacyDogSkillAchievementFocus(id));
}

/** Merge legacy dog skill achievement IDs into profile tags; strip skill achievements from storage. */
export function migrateLegacyDogSkillAchievements(
  profileTags: DogProfileTagId[] | undefined,
  achievementFocusIds: string[] | undefined
): { profileTags: DogProfileTagId[]; achievementFocusIds: string[] } {
  const tagSet = new Set(profileTags || []);
  const remainingAchievements: string[] = [];

  for (const id of achievementFocusIds || []) {
    if (isLegacyDogSkillAchievementFocus(id)) {
      for (const tag of LEGACY_ACHIEVEMENT_PROFILE_TAGS[id] || []) {
        tagSet.add(tag);
      }
    } else if (isHouseholdCompetencyFocus(id)) {
      remainingAchievements.push(id);
    }
  }

  return {
    profileTags: [...tagSet],
    achievementFocusIds: remainingAchievements,
  };
}

export function householdAchievementLabel(focusId: string): string {
  return getFocusById(focusId)?.name || focusId;
}
