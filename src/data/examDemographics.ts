/** Owner exam dog profile — mirrors booking demographics where useful. */

import type { ClientDesexedStatus, ClientDogSex } from './bookingSelfAssessment';
import {
  CLIENT_DOG_DESEXED_OPTIONS,
  CLIENT_DOG_SEX_OPTIONS,
} from './bookingSelfAssessment';

/** Exam requires a definite reproductive status (no unknown). */
export type ExamReproductiveStatus = 'intact' | 'neutered';

export type ExamStructureLevel = 'building' | 'solid';

export interface ExamDogProfile {
  reproductiveStatus: ExamReproductiveStatus;
  sex: ClientDogSex;
  structureLevel: ExamStructureLevel;
}

export const EXAM_REPRODUCTIVE_OPTIONS: { value: ExamReproductiveStatus; label: string }[] = [
  { value: 'intact', label: 'Intact' },
  { value: 'neutered', label: 'Neutered / spayed' },
];

export const EXAM_STRUCTURE_OPTIONS: { value: ExamStructureLevel; label: string; note: string }[] = [
  {
    value: 'building',
    label: 'Still building structure',
    note: 'Recall, thresholds, and leash culture are not established yet — the intensive playbook applies.',
  },
  {
    value: 'solid',
    label: 'Solid structure in place',
    note: 'Core boundaries already hold — exam skews toward maintenance and edge cases.',
  },
];

export function examReproductiveFromBooking(desexed: ClientDesexedStatus | undefined): ExamReproductiveStatus | null {
  if (desexed === 'no') return 'intact';
  if (desexed === 'yes') return 'neutered';
  return null;
}

/** Labels reused from booking form for consistency. */
export { CLIENT_DOG_SEX_OPTIONS, CLIENT_DOG_DESEXED_OPTIONS };

export function formatExamProfileLabel(profile: ExamDogProfile): string {
  const repro = profile.reproductiveStatus === 'intact' ? 'Intact' : 'Neutered / spayed';
  const sex = profile.sex === 'male' ? 'Male' : 'Female';
  const structure =
    profile.structureLevel === 'building' ? 'Building structure' : 'Solid structure';
  return `${repro} · ${sex} · ${structure}`;
}
