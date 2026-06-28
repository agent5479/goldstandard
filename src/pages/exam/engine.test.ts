import { describe, expect, it } from 'vitest';
import { isTraitQuestion } from '../../data/examQuestions';
import type { ExamDogProfile } from '../../data/examDemographics';
import {
  OWNER_TOTAL,
  buildOwnerExam,
  createSamplingState,
  isWrongBreedQuestion,
  isWrongProfileQuestion,
  meetsNeuroticismMin,
  selectTraitQuestions,
} from './engine';

const gwhpPlaybookProfile: ExamDogProfile = {
  reproductiveStatus: 'intact',
  sex: 'male',
  structureLevel: 'building',
};

describe('exam engine', () => {
  it('buildOwnerExam returns 24 questions for a named breed', () => {
    const exam = buildOwnerExam(['herding'], 'Border Collie', gwhpPlaybookProfile);
    expect(exam).toHaveLength(OWNER_TOTAL);
  });

  it('buildOwnerExam has no duplicate prompt text in a session', () => {
    const exam = buildOwnerExam(['clingy'], 'Miniature Poodle', gwhpPlaybookProfile);
    const texts = exam.map((q) => q.source.text);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it('buildOwnerExam has no duplicate dedupGroup in a session', () => {
    for (let i = 0; i < 20; i++) {
      const exam = buildOwnerExam(['herding'], 'Border Collie', gwhpPlaybookProfile);
      const groups = exam.map((q) => q.source.dedupGroup).filter(Boolean) as string[];
      expect(new Set(groups).size).toBe(groups.length);
    }
  });

  it('Border Collie exam never includes another breed-named question', () => {
    for (let i = 0; i < 50; i++) {
      const exam = buildOwnerExam(['herding'], 'Border Collie', gwhpPlaybookProfile);
      for (const q of exam) {
        if (q.source.breedNames?.length) {
          expect(q.source.breedNames).toContain('Border Collie');
        }
        expect(q.source.text).not.toMatch(/You have a Staffy/);
      }
    }
  });

  it('selectTraitQuestions includes breed-named questions for Border Collie', () => {
    const state = createSamplingState();
    const trait = selectTraitQuestions('Border Collie', ['herding'], state, gwhpPlaybookProfile, 4);
    expect(trait.length).toBe(4);
    expect(trait.some((q) => q.breedNames?.includes('Border Collie'))).toBe(true);
  });

  it('selectTraitQuestions excludes other breeds from fallbacks', () => {
    const state = createSamplingState();
    const trait = selectTraitQuestions('Border Collie', ['herding'], state, gwhpPlaybookProfile, 4);
    for (const q of trait) {
      expect(isWrongBreedQuestion(q, 'Border Collie')).toBe(false);
    }
  });

  it('selectTraitQuestions excludes all breed-named questions when breed is null', () => {
    const state = createSamplingState();
    const trait = selectTraitQuestions(null, ['herding'], state, gwhpPlaybookProfile, 4);
    for (const q of trait) {
      expect(q.breedNames?.length ?? 0).toBe(0);
    }
  });

  it('selectTraitQuestions includes tag pool for Miniature Poodle', () => {
    const state = createSamplingState();
    const trait = selectTraitQuestions('Miniature Poodle', ['clingy'], state, gwhpPlaybookProfile, 4);
    expect(
      trait.some(
        (q) =>
          q.breedNames?.includes('Miniature Poodle') ||
          q.profileTags?.includes('puzzle_driven') ||
          q.neuroticismMin === 'elevated'
      )
    ).toBe(true);
  });

  it('selectTraitQuestions uses personality-source breed for mixes', () => {
    const state = createSamplingState();
    const trait = selectTraitQuestions(
      'Golden Retriever',
      ['clingy', 'herding', 'large'],
      state,
      {
        reproductiveStatus: 'neutered',
        sex: 'female',
        structureLevel: 'solid',
      },
      4
    );
    expect(trait.some((q) => q.breedNames?.includes('Golden Retriever'))).toBe(true);
  });

  it('GWHP intact male building exam includes playbook questions', () => {
    for (let i = 0; i < 30; i++) {
      const exam = buildOwnerExam(['clingy'], 'German Wirehaired Pointer', gwhpPlaybookProfile);
      expect(
        exam.some(
          (q) =>
            q.source.requiresIntact &&
            q.source.requiresMale &&
            q.source.requiresStructureBuilding
        )
      ).toBe(true);
    }
  });

  it('neutered profile excludes intact-only questions', () => {
    const neuteredProfile: ExamDogProfile = {
      reproductiveStatus: 'neutered',
      sex: 'male',
      structureLevel: 'building',
    };
    for (let i = 0; i < 30; i++) {
      const exam = buildOwnerExam(['clingy'], 'German Wirehaired Pointer', neuteredProfile);
      for (const q of exam) {
        expect(q.source.requiresIntact).toBeFalsy();
      }
    }
  });

  it('female profile excludes male-only playbook questions', () => {
    const femaleProfile: ExamDogProfile = {
      reproductiveStatus: 'intact',
      sex: 'female',
      structureLevel: 'building',
    };
    for (let i = 0; i < 30; i++) {
      const exam = buildOwnerExam(['clingy'], 'German Wirehaired Pointer', femaleProfile);
      for (const q of exam) {
        expect(q.source.requiresMale).toBeFalsy();
      }
    }
  });

  it('isWrongProfileQuestion gates playbook metadata', () => {
    const gated = {
      topic: 'x',
      breedCategory: 'all' as const,
      track: 'both' as const,
      text: 'x',
      options: ['a', 'b', 'c', 'd'],
      explanation: 'e',
      guideLink: '#intact-large-males-mindset',
      requiresIntact: true,
      requiresMale: true,
      requiresStructureBuilding: true,
    };
    expect(isWrongProfileQuestion(gated, gwhpPlaybookProfile)).toBe(false);
    expect(
      isWrongProfileQuestion(gated, { ...gwhpPlaybookProfile, sex: 'female' })
    ).toBe(true);
  });

  it('meetsNeuroticismMin compares inclination levels', () => {
    expect(meetsNeuroticismMin('high', 'elevated')).toBe(true);
    expect(meetsNeuroticismMin('low', 'elevated')).toBe(false);
    expect(meetsNeuroticismMin('elevated', 'elevated')).toBe(true);
  });

  it('isTraitQuestion identifies trait metadata', () => {
    expect(
      isTraitQuestion({
        topic: 'Breed trait',
        breedCategory: 'all',
        track: 'both',
        text: 'x',
        options: ['a', 'b', 'c', 'd'],
        explanation: 'e',
        guideLink: '#x',
        breedNames: ['Border Collie'],
      })
    ).toBe(true);
    expect(
      isTraitQuestion({
        topic: 'Breed trait',
        breedCategory: 'all',
        track: 'both',
        text: 'x',
        options: ['a', 'b', 'c', 'd'],
        explanation: 'e',
        guideLink: '#intact-three-paths',
        requiresIntact: true,
      })
    ).toBe(true);
  });
});
