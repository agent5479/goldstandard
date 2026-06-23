import { describe, expect, it } from 'vitest';
import { isTraitQuestion } from '../../data/examQuestions';
import {
  OWNER_TOTAL,
  buildOwnerExam,
  meetsNeuroticismMin,
  selectTraitQuestions,
} from './engine';

describe('exam engine', () => {
  it('buildOwnerExam returns 24 questions for a named breed', () => {
    const exam = buildOwnerExam(['herding'], 'Border Collie');
    expect(exam).toHaveLength(OWNER_TOTAL);
  });

  it('buildOwnerExam has no duplicate prompt text in a session', () => {
    const exam = buildOwnerExam(['clingy'], 'Miniature Poodle');
    const texts = exam.map((q) => q.source.text);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it('selectTraitQuestions includes breed-named questions for Border Collie', () => {
    const used = new Set<string>();
    const trait = selectTraitQuestions('Border Collie', ['herding'], used, 4);
    expect(trait.length).toBe(4);
    expect(trait.some((q) => q.breedNames?.includes('Border Collie'))).toBe(true);
  });

  it('selectTraitQuestions includes tag pool for Miniature Poodle', () => {
    const used = new Set<string>();
    const trait = selectTraitQuestions('Miniature Poodle', ['clingy'], used, 4);
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
    const used = new Set<string>();
    const trait = selectTraitQuestions('Golden Retriever', ['clingy', 'herding', 'large'], used, 4);
    expect(trait.some((q) => q.breedNames?.includes('Golden Retriever'))).toBe(true);
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
  });
});
