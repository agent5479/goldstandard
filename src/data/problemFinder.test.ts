import { describe, expect, it } from 'vitest';
import { ALLOCATION_SCALE_TOTAL } from '../utils/allocationScales';
import {
  buildEnquiryMessageFromShares,
  getContextAllocationQuestion,
  getDefaultContextShares,
  getIssueAllocationQuestion,
  mergeOutcomesWeighted,
  resolveImpactFromShares,
  selectFocusOutcomeIds,
  selectFocusOutcomes,
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
    expect(issueQuestion.poles?.every((pole) => !('sublabel' in pole && pole.sublabel))).toBe(true);
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

describe('problemFinder focus selection', () => {
  it('keeps up to three issues at or above 10%', () => {
    const outcomes = selectFocusOutcomes({
      pull_lead: 400,
      recall: 300,
      barking: 200,
      jumping: 100,
      anxious: 0,
    });
    expect(outcomes.map((entry) => entry.id)).toEqual([
      'pull_lead',
      'recall',
      'barking',
    ]);
  });

  it('drops issues below the 10% floor even when under the cap', () => {
    const ids = selectFocusOutcomeIds({
      pull_lead: 850,
      recall: 90,
      barking: 60,
    });
    expect(ids).toEqual(['pull_lead']);
  });

  it('falls back to the single top-weighted issue when none clear 10%', () => {
    const outcomes = selectFocusOutcomes({
      pull_lead: 80,
      recall: 70,
      barking: 60,
      jumping: 50,
      anxious: 40,
      separation: 40,
      doors_guests: 40,
      impulse: 40,
      yard_boundaries: 40,
      puppy: 40,
      dog_issues: 40,
      obedience: 40,
      repetitive_soothing: 40,
      handling_touch: 40,
      leash_reactive: 40,
    });
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0]!.id).toBe('pull_lead');
  });

  it('returns an empty list when every share is zero', () => {
    expect(selectFocusOutcomes({ pull_lead: 0, recall: 0 })).toEqual([]);
  });

  it('includes equal 10% issues up to the cap of three', () => {
    const ids = selectFocusOutcomeIds({
      pull_lead: 100,
      recall: 100,
      barking: 100,
      jumping: 100,
      anxious: 600,
    });
    expect(ids).toEqual(['anxious', 'pull_lead', 'recall']);
  });
});
