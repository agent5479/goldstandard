export const HOUSEHOLD_TYPES: Record<string, { name: string; color: string; icon: string }> = {
  single_dog: { name: 'Single Dog', color: '#2d4a2d', icon: 'bi-dog' },
  multi_dog: { name: 'Multi-Dog', color: '#4a6741', icon: 'bi-heart-pulse-fill' },
  rehabilitation: { name: 'Rehabilitation', color: '#b8832a', icon: 'bi-shield-heart' },
  graduated: { name: 'Graduated', color: '#5c3d1e', icon: 'bi-award-fill' },
  other: { name: 'Other', color: '#adb5bd', icon: 'bi-house-heart-fill' },
};

export const DOG_TRAINING_STAGES = [
  'Intake',
  'Foundations',
  'In Training',
  'Proofing',
  'Graduated',
] as const;

export const ARCHIVED_DOG_STAGE = 'Archived';

export const ALL_DOG_STAGES = [...DOG_TRAINING_STAGES, ARCHIVED_DOG_STAGE] as const;

export type DogTrainingStage = (typeof ALL_DOG_STAGES)[number];

export const DOG_TRAINING_STAGE_META: Record<DogTrainingStage, { icon: string; color: string }> = {
  Intake: { icon: 'bi-clipboard-plus', color: '#3d8b9e' },
  Foundations: { icon: 'bi-layers', color: '#2d4a2d' },
  'In Training': { icon: 'bi-arrow-repeat', color: '#4a6741' },
  Proofing: { icon: 'bi-bullseye', color: '#b8832a' },
  Graduated: { icon: 'bi-award-fill', color: '#2e7d4f' },
  Archived: { icon: 'bi-archive', color: '#6c757d' },
};

/** @deprecated Use DOG_TRAINING_STAGES */
export const TRAINING_STAGES = DOG_TRAINING_STAGES;

export const DEFAULT_TRAINING_STAGE: DogTrainingStage = 'Intake';
