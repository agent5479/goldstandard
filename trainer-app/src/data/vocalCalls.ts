import { guideAnchorUrl, PUBLIC_GUIDE_URL } from '@/data/assessmentTaxonomy';

/** Standard handler vocal functions — defaults from the GSDT guide; households may override. */
export type VocalCallId =
  | 'stop'
  | 'wait'
  | 'go'
  | 'heel'
  | 'recall'
  | 'leave_it'
  | 'sit'
  | 'down'
  | 'release'
  | 'car_alert'
  | 'check_in'
  | 'correction'
  | 'praise';

export interface VocalCallDef {
  id: VocalCallId;
  /** Trainer-facing function label */
  label: string;
  /** Default word or phrase (guide baseline) */
  defaultCall: string;
  description: string;
  guideAnchor?: string;
}

export const VOCAL_CALLS: VocalCallDef[] = [
  {
    id: 'stop',
    label: 'Stop / freeze',
    defaultCall: 'Stop',
    description: 'Immediate halt — feet still, no forward motion',
    guideAnchor: 'leash',
  },
  {
    id: 'wait',
    label: 'Wait',
    defaultCall: 'Wait',
    description: 'Hold position (door, bowl, threshold) until release',
    guideAnchor: 'front-door',
  },
  {
    id: 'go',
    label: 'Go / proceed',
    defaultCall: 'Go',
    description: 'Permission to move — after wait or check-in',
    guideAnchor: 'access',
  },
  {
    id: 'heel',
    label: 'Heel / close',
    defaultCall: 'Heel',
    description: 'Slack leash at handler side — structured walk',
    guideAnchor: 'leash',
  },
  {
    id: 'recall',
    label: 'Recall',
    defaultCall: 'Come',
    description: 'Return to handler — one cue, then enforce',
    guideAnchor: 'cue-once',
  },
  {
    id: 'leave_it',
    label: 'Leave it / off',
    defaultCall: 'Leave it',
    description: 'Disengage from scent, object, or distraction',
    guideAnchor: 'access',
  },
  {
    id: 'sit',
    label: 'Sit',
    defaultCall: 'Sit',
    description: 'Sit position — say once',
    guideAnchor: 'cue-once',
  },
  {
    id: 'down',
    label: 'Down',
    defaultCall: 'Down',
    description: 'Down position — say once',
    guideAnchor: 'cue-once',
  },
  {
    id: 'release',
    label: 'Release (access)',
    defaultCall: 'Okay',
    description: 'Earned release from wait or earned resource',
    guideAnchor: 'access',
  },
  {
    id: 'car_alert',
    label: 'Car / road alert',
    defaultCall: 'Car!',
    description: 'High-intent alert — gutter anchor, track vehicle',
    guideAnchor: 'road-safety',
  },
  {
    id: 'check_in',
    label: 'Check-in',
    defaultCall: 'Check',
    description: 'Seven-second off-lead check-in cue',
    guideAnchor: 'check-in-seven',
  },
  {
    id: 'correction',
    label: 'Verbal correction',
    defaultCall: 'Ah',
    description: 'Calm, matter-of-fact reset — not repeated nagging',
    guideAnchor: 'verbal-correction',
  },
  {
    id: 'praise',
    label: 'Affirming praise',
    defaultCall: 'Good — [behaviour]',
    description: 'Name the behaviour (calm, heel, check-in) — not generic excitement',
    guideAnchor: 'access',
  },
];

export type HouseholdVocalCalls = Partial<Record<VocalCallId, string>>;

export function getVocalCallDef(id: VocalCallId): VocalCallDef | undefined {
  return VOCAL_CALLS.find((c) => c.id === id);
}

export function getEffectiveVocalCall(id: VocalCallId, household?: HouseholdVocalCalls): string {
  const custom = household?.[id]?.trim();
  if (custom) return custom;
  return getVocalCallDef(id)?.defaultCall || id;
}

export function countCustomVocalCalls(household?: HouseholdVocalCalls): number {
  if (!household) return 0;
  return VOCAL_CALLS.filter((def) => household[def.id]?.trim()).length;
}

export function vocalCallGuideUrl(anchor?: string): string | undefined {
  if (!anchor) return PUBLIC_GUIDE_URL;
  return guideAnchorUrl(anchor);
}
