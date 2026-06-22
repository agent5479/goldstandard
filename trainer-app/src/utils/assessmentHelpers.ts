import type { Dog, Owner, TenantData } from '@/types';
import {
  DOG_SKILL_FOCUS_IDS,
  GRADUATION_MIN_DOG_SKILL_GRADE,
  GRADUATION_MIN_OWNER_CAPACITY_GRADE,
  OWNER_CAPACITY_DOMAINS,
  STALE_GRADE_DAYS,
  type OwnerCapacityDomain,
  type SkillGrade,
} from '@/data/assessmentTaxonomy';
import { resolveDogTrainingStage, isDogArchived } from '@/utils/householdHelpers';

export interface GraduationHint {
  ready: boolean;
  reasons: string[];
  missingSkills: string[];
  missingCapacity: OwnerCapacityDomain[];
}

export function getPinnedSkillIds(owner: Owner): string[] {
  const pinned = owner.pinnedFocusIds;
  if (pinned?.length) return pinned;
  return DOG_SKILL_FOCUS_IDS;
}

export function evaluateDogGraduationHint(owner: Owner, dog: Dog): GraduationHint {
  const reasons: string[] = [];
  const missingSkills: string[] = [];
  const missingCapacity: OwnerCapacityDomain[] = [];
  const pinnedIds = getPinnedSkillIds(owner);
  const stage = resolveDogTrainingStage(dog, owner);

  if (stage === 'Graduated') {
    return { ready: true, reasons: ['Already marked graduated'], missingSkills: [], missingCapacity: [] };
  }

  for (const focusId of pinnedIds) {
    const grade = dog.skillGrades?.[focusId];
    if (grade == null || grade < GRADUATION_MIN_DOG_SKILL_GRADE) {
      missingSkills.push(focusId);
    }
  }

  for (const domain of OWNER_CAPACITY_DOMAINS) {
    const grade = owner.ownerCapacity?.[domain.id];
    if (grade == null || grade < GRADUATION_MIN_OWNER_CAPACITY_GRADE) {
      missingCapacity.push(domain.id);
    }
  }

  if (missingSkills.length === 0 && missingCapacity.length === 0) {
    reasons.push('All pinned skills at Proficient+ and owner capacity at Competent+');
  } else {
    if (missingSkills.length) reasons.push(`${missingSkills.length} pinned skill(s) below Proficient`);
    if (missingCapacity.length) reasons.push(`${missingCapacity.length} owner capacity domain(s) below Competent`);
  }

  return {
    ready: missingSkills.length === 0 && missingCapacity.length === 0,
    reasons,
    missingSkills,
    missingCapacity,
  };
}

/** @deprecated Prefer evaluateDogGraduationHint per dog. */
export function evaluateGraduationHint(owner: Owner, dogs: Dog[]): GraduationHint {
  const activeDogs = dogs.filter((dog) => !isDogArchived(dog, owner));
  if (activeDogs.length === 0) {
    return evaluateDogGraduationHint(owner, { id: '', ownerId: String(owner.id), name: 'Dog' });
  }
  return evaluateDogGraduationHint(owner, activeDogs[0]);
}

export function isGradeStale(updatedAt?: string): boolean {
  if (!updatedAt) return true;
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(updated)) return true;
  const cutoff = Date.now() - STALE_GRADE_DAYS * 24 * 60 * 60 * 1000;
  return updated < cutoff;
}

export function collectStaleGradeIssues(data: TenantData): { level: 'warning'; message: string }[] {
  const issues: { level: 'warning'; message: string }[] = [];
  const activeOwners = data.owners.filter((o) => !o.archived && o.status !== 'archived');

  activeOwners.forEach((owner) => {
    const dogs = data.dogs.filter((d) => String(d.ownerId) === String(owner.id) && !isDogArchived(d, owner));
    const pinnedIds = getPinnedSkillIds(owner);

    dogs.forEach((dog) => {
      pinnedIds.forEach((focusId) => {
        const grade = dog.skillGrades?.[focusId];
        if (grade != null && grade > 0 && isGradeStale(dog.updatedAt)) {
          issues.push({
            level: 'warning',
            message: `${owner.name} · ${dog.name}: skill grades may be stale (last dog update ${dog.updatedAt?.slice(0, 10) || 'unknown'})`,
          });
        }
      });

      const hint = evaluateDogGraduationHint(owner, dog);
      if (hint.ready && resolveDogTrainingStage(dog, owner) !== 'Graduated') {
        issues.push({
          level: 'warning',
          message: `${owner.name} · ${dog.name}: graduation criteria met — consider updating training stage`,
        });
      }
    });

    OWNER_CAPACITY_DOMAINS.forEach((domain) => {
      const grade = owner.ownerCapacity?.[domain.id];
      if (grade != null && grade > 0 && isGradeStale(owner.updatedAt)) {
        issues.push({
          level: 'warning',
          message: `${owner.name}: owner capacity "${domain.label}" may be stale (last household update ${owner.updatedAt?.slice(0, 10) || 'unknown'})`,
        });
      }
    });

    const weakCapacity = OWNER_CAPACITY_DOMAINS.filter((d) => {
      const g = owner.ownerCapacity?.[d.id];
      return g === 1;
    });
    const overdueFollowUp = data.scheduledSessions.some(
      (s) =>
        String(s.ownerId) === String(owner.id) &&
        s.status !== 'completed' &&
        new Date(s.scheduledDate) < new Date()
    );
    if (weakCapacity.length > 0 && overdueFollowUp) {
      issues.push({
        level: 'warning',
        message: `${owner.name}: capacity at Needs support with overdue follow-up`,
      });
    }
  });

  return issues;
}

export function averageSkillGrade(grades: Record<string, SkillGrade> | undefined, focusIds: string[]): number | null {
  if (!grades || focusIds.length === 0) return null;
  const values = focusIds.map((id) => grades[id]).filter((g): g is SkillGrade => g != null);
  if (values.length === 0) return null;
  const sum = values.reduce<number>((a, b) => a + b, 0);
  return sum / values.length;
}

export function averageOwnerCapacity(owner: Owner): number | null {
  const values = OWNER_CAPACITY_DOMAINS.map((d) => owner.ownerCapacity?.[d.id]).filter(
    (g): g is SkillGrade => g != null
  );
  if (values.length === 0) return null;
  const sum = values.reduce<number>((a, b) => a + b, 0);
  return sum / values.length;
}
