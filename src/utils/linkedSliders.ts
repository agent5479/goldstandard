import {
  ALLOCATION_SCALE_TOTAL,
  createEmptyWeights,
  parseAllocationPercentInput,
  redistributeOnChange,
} from './allocationScales';

export const ALLOCATION_BUDGET = ALLOCATION_SCALE_TOTAL;

export { ALLOCATION_SCALE_TOTAL, parseAllocationPercentInput, formatAllocationPercent } from './allocationScales';

/** Split `total` into `count` integer shares as evenly as possible. */
export function equalSplit(count: number, total: number = ALLOCATION_BUDGET): number[] {
  if (count <= 0) return [];
  const ids = Array.from({ length: count }, (_, i) => String(i));
  const weights = createEmptyWeights(ids, total);
  return ids.map((id) => weights[id] ?? 0);
}

/** Default starting shares for a linked-slider question. */
export function defaultLinkedShares(poleCount: number, total: number = ALLOCATION_BUDGET): number[] {
  return equalSplit(poleCount, total);
}

/**
 * Redistribute a fixed budget when one pole changes.
 * `nextDisplayPercent` is a display percent (0–100, 0.1 steps); converted to internal weights.
 */
export function redistributeLinkedSliders(
  values: number[],
  index: number,
  nextDisplayPercent: number,
  total: number = ALLOCATION_BUDGET
): number[] {
  const n = values.length;
  if (n === 0) return [];
  if (index < 0 || index >= n) return [...values];

  const ids = Array.from({ length: n }, (_, i) => String(i));
  const prior = Object.fromEntries(ids.map((id, i) => [id, values[i] ?? 0])) as Record<string, number>;
  const nextWeight = parseAllocationPercentInput(nextDisplayPercent);
  const result = redistributeOnChange(String(index), nextWeight, prior, total, ids);
  return ids.map((id) => result[id] ?? 0);
}
