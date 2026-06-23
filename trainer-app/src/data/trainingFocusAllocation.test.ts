import { describe, expect, it } from 'vitest';
import {
  FOCUS_TO_GUIDE_ANCHOR,
  mergeCompetencyFocusIntoGuideTags,
  normalizeOwnerGuideTags,
} from '@/data/trainingFocusAllocation';

describe('trainingFocusAllocation', () => {
  it('maps every household competency focus to a guide anchor', () => {
    for (const [focusId, anchorId] of Object.entries(FOCUS_TO_GUIDE_ANCHOR)) {
      expect(focusId).toMatch(/^focus_/);
      expect(anchorId.length).toBeGreaterThan(0);
    }
  });

  it('mergeCompetencyFocusIntoGuideTags adds anchors without duplicates', () => {
    const tags = mergeCompetencyFocusIntoGuideTags(['timing'], ['focus_002', 'focus_004']);
    expect(tags).toContain('timing');
    expect(tags).toContain('ready-stance');
    expect(tags.filter((t) => t === 'timing')).toHaveLength(1);
  });

  it('normalizeOwnerGuideTags migrates owner and dog competency ticks into guideTags', () => {
    const result = normalizeOwnerGuideTags(
      { guideTags: [], competencyAchievementIds: ['focus_011', 'focus_021'] },
      [['focus_004']]
    );
    expect(result.changed).toBe(true);
    expect(result.competencyAchievementIds).toEqual([]);
    expect(result.guideTags).toEqual(
      expect.arrayContaining(['leash-jerk', 'leash', 'ready-stance'])
    );
  });
});
