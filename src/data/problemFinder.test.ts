import { describe, expect, it } from 'vitest';
import { ALLOCATION_SCALE_TOTAL } from '../utils/allocationScales';
import {
  buildEnquiryMessageFromShares,
  getContextAllocationQuestion,
  getDefaultContextShares,
  getIssueAllocationQuestion,
  mergeOutcomesWeighted,
  resolveImpactFromShares,
} from './problemFinder';

describe('problemFinder allocation', () => {
  it('builds context allocation question with four poles', () => {
    const question = getContextAllocationQuestion();
    expect(question.poles?.length).toBe(4);
    expect(getDefaultContextShares().reduce((a, b) => a + b, 0)).toBe(ALLOCATION_SCALE_TOTAL);
  });

  it('unions issue poles from active contexts', () => {
    const contextShares = { walks: 600, home: 400, social: 0, basics: 0 };
    const issueQuestion = getIssueAllocationQuestion(contextShares);
    expect((issueQuestion.poles?.length ?? 0) > 0).toBe(true);
  });

  it('resolves weighted impact level', () => {
    const impactShares = [0, 0, 0, 800, 200];
    expect(resolveImpactFromShares(impactShares)).toBe(4);
  });

  it('merges outcomes by weight threshold', () => {
    const outcomes = mergeOutcomesWeighted({ pull_lead: 700, recall: 300 });
    expect(outcomes.map((entry) => entry.id)).toEqual(['pull_lead', 'recall']);
  });

  it('builds enquiry message from share vectors', () => {
    const message = buildEnquiryMessageFromShares(
      { walks: 1000, home: 0, social: 0, basics: 0 },
      { pull_lead: 800, recall: 200 },
      4
    );
    expect(message).toMatch(/Problem Finder summary/);
    expect(message).toMatch(/pull/i);
  });
});
