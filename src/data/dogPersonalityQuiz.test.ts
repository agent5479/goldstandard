import { describe, expect, it } from 'vitest';
import {
  PERSONALITY_QUESTIONS,
  PERSONALITY_QUESTION_IDS,
  PERSONALITY_START_ID,
  emptyCategoryWeights,
  mergeWeights,
  resolvePersonalityResult,
} from './dogPersonalityQuiz';
import type { BreedCategory } from './breeds';

type VisitState = 'unvisited' | 'visiting' | 'done';

function collectReachableResults(startId: string): Set<string> {
  const visited = new Set<string>();
  const results = new Set<string>();

  function walk(id: string, state: Map<string, VisitState>) {
    if (id === 'RESULT') {
      results.add('RESULT');
      return;
    }
    const nodeState = state.get(id);
    if (nodeState === 'visiting') return;
    if (nodeState === 'done') return;

    state.set(id, 'visiting');
    const question = PERSONALITY_QUESTIONS[id];
    if (!question) return;

    for (const option of question.options) {
      walk(option.next, state);
    }
    state.set(id, 'done');
    visited.add(id);
  }

  const state = new Map<string, VisitState>();
  walk(startId, state);
  return results;
}

function findOrphanNodes(): string[] {
  const referenced = new Set<string>([PERSONALITY_START_ID]);
  for (const question of Object.values(PERSONALITY_QUESTIONS)) {
    for (const option of question.options) {
      if (option.next !== 'RESULT') referenced.add(option.next);
    }
  }
  return PERSONALITY_QUESTION_IDS.filter((id) => !referenced.has(id));
}

function findDeadEnds(): string[] {
  const dead: string[] = [];
  for (const [id, question] of Object.entries(PERSONALITY_QUESTIONS)) {
    if (question.options.length === 0) dead.push(id);
    for (const option of question.options) {
      if (option.next !== 'RESULT' && !PERSONALITY_QUESTIONS[option.next]) {
        dead.push(`${id} → ${option.next}`);
      }
    }
  }
  return dead;
}

describe('dogPersonalityQuiz tree', () => {
  it('defines exactly 15 question nodes', () => {
    expect(PERSONALITY_QUESTION_IDS).toHaveLength(15);
  });

  it('has no orphan nodes', () => {
    expect(findOrphanNodes()).toEqual([]);
  });

  it('has no dead-end references', () => {
    expect(findDeadEnds()).toEqual([]);
  });

  it('reaches RESULT from start on every branch', () => {
    const results = collectReachableResults(PERSONALITY_START_ID);
    expect(results.has('RESULT')).toBe(true);
  });

  it('every question has at least two options', () => {
    for (const question of Object.values(PERSONALITY_QUESTIONS)) {
      expect(question.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('every option has at least one weight', () => {
    for (const question of Object.values(PERSONALITY_QUESTIONS)) {
      for (const option of question.options) {
        expect(Object.keys(option.weights).length).toBeGreaterThan(0);
      }
    }
  });
});

describe('resolvePersonalityResult', () => {
  it('picks clingy when clingy weights dominate', () => {
    const weights = mergeWeights(emptyCategoryWeights(), { clingy: 10, terrier: 1 });
    const result = resolvePersonalityResult(weights);
    expect(result.category).toBe('clingy');
    expect(result.archetype.headline).toMatch(/Velcro/i);
    expect(result.breeds.length).toBeGreaterThan(0);
    expect(result.breeds.every((b) => b.category === 'clingy')).toBe(true);
  });

  it('returns a valid category when all weights are zero', () => {
    const result = resolvePersonalityResult(emptyCategoryWeights());
    const valid: BreedCategory[] = [
      'clingy',
      'sighthound',
      'herding',
      'spitz',
      'terrier',
      'scenthound',
      'guardian',
      'giant',
      'small',
    ];
    expect(valid).toContain(result.category);
  });
});
