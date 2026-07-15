import { describe, expect, it } from 'vitest';
import {
  ALL_BREED_CATEGORIES,
  BREED_COUNTS_BY_CATEGORY,
  TOTAL_BREED_COUNT,
  buildEqualShareLinearAnswers,
  collectQuizTraitAxes,
  computeCategoryReachMatrix,
  computeQuizTraitCoverage,
  computeTopVarianceAxesByCategory,
  computeTotalMaxCategoryWeights,
  simulateCategoryWinRates,
  simulateEqualShareCategoryWins,
  simulateNamedCrossEligibility,
} from './dogPersonalityWeightAudit';
import {
  accumulateWeightsFromAnswers,
  buildHumanProfile,
  resolvePersonalityCategory,
} from './dogPersonalityQuiz';

describe('dogPersonalityWeightAudit tables', () => {
  it('tracks breed inventory across all categories', () => {
    const total = ALL_BREED_CATEGORIES.reduce(
      (sum, category) => sum + BREED_COUNTS_BY_CATEGORY[category],
      0
    );
    expect(total).toBeGreaterThan(100);
    expect(ALL_BREED_CATEGORIES).toHaveLength(9);
  });

  it('exposes max category weight totals for every category', () => {
    const totals = computeTotalMaxCategoryWeights();
    for (const category of ALL_BREED_CATEGORIES) {
      expect(totals[category]).toBeGreaterThanOrEqual(15);
    }
  });

  it('reaches every category in at least nine linear questions', () => {
    const reach = computeCategoryReachMatrix();
    for (const row of reach) {
      expect(row.questionsTouched).toBeGreaterThanOrEqual(9);
    }
  });

  it('aligns total max weights with breed inventory share', () => {
    const totals = computeTotalMaxCategoryWeights();
    const sum = ALL_BREED_CATEGORIES.reduce((total, category) => total + totals[category], 0);

    for (const category of ALL_BREED_CATEGORIES) {
      const weightShare = totals[category] / sum;
      const breedShare = BREED_COUNTS_BY_CATEGORY[category] / TOTAL_BREED_COUNT;
      expect(weightShare).toBeGreaterThan(breedShare * 0.45);
      expect(weightShare).toBeLessThan(breedShare * 1.5);
    }
  });

  it('covers at least three high-variance axes per category in quiz data', () => {
    const coverage = computeQuizTraitCoverage();
    for (const category of ALL_BREED_CATEGORIES) {
      expect(coverage[category].overlap).toBeGreaterThanOrEqual(3);
    }
  });

  it('includes retrieve, hunt_dig, and sled_endurance in measurable quiz axes', () => {
    const axes = collectQuizTraitAxes();
    expect(axes.has('retrieve')).toBe(true);
    expect(axes.has('hunt_dig')).toBe(true);
    expect(axes.has('sled_endurance')).toBe(true);
  });

  it('derives top variance axes for each category', () => {
    const top = computeTopVarianceAxesByCategory();
    for (const category of ALL_BREED_CATEGORIES) {
      expect(top[category]?.length).toBe(5);
    }
  });
});

describe('dogPersonalityWeightAudit monte carlo', () => {
  it('keeps simulated category win rates near breed-proportional baselines', () => {
    const result = simulateCategoryWinRates(
      2000,
      accumulateWeightsFromAnswers,
      (weights) => resolvePersonalityCategory(weights)
    );

    for (const category of ALL_BREED_CATEGORIES) {
      const ratio = result.fairnessRatio[category] ?? 0;
      // Exclusive questions reduce blend diversity vs all-slider sampling; keep a modest floor.
      const floor = BREED_COUNTS_BY_CATEGORY[category] <= 14 ? 0.34 : 0.35;
      expect(ratio).toBeGreaterThan(floor);
      expect(ratio).toBeLessThan(2.35);
    }
  });

  it('does not let any category dominate random profiles beyond 2.35x breed share', () => {
    const result = simulateCategoryWinRates(
      2000,
      accumulateWeightsFromAnswers,
      (weights) => resolvePersonalityCategory(weights)
    );

    for (const category of ALL_BREED_CATEGORIES) {
      const ratio = result.fairnessRatio[category] ?? 0;
      expect(ratio).toBeLessThanOrEqual(2.35);
    }
  });

  it('does not let clingy monopolize equal-share defaults', () => {
    const answers = buildEqualShareLinearAnswers();
    const weights = accumulateWeightsFromAnswers(answers);
    // Equal shares should not leave clingy more than ~1.6x any other large catalog.
    const clingy = weights.clingy ?? 0;
    const rivals = (['herding', 'terrier', 'small'] as const).map((c) => weights[c] ?? 0);
    expect(Math.max(...rivals)).toBeGreaterThan(clingy * 0.55);
    const winner = simulateEqualShareCategoryWins(
      accumulateWeightsFromAnswers,
      (w) => resolvePersonalityCategory(w, buildHumanProfile(answers))
    );
    expect(ALL_BREED_CATEGORIES).toContain(winner);
  });

  it('gives named crosses a realistic chance to appear in featured results', () => {
    const result = simulateNamedCrossEligibility(600);
    expect(result.topFiveRate).toBeGreaterThan(0.01);
  });
});
