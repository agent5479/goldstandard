/** Split `total` into `count` integer shares as evenly as possible. */
export function equalSplit(count: number, total = 100): number[] {
  if (count <= 0) return [];
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}

/** Default starting shares for a linked-slider question. */
export function defaultLinkedShares(poleCount: number, total = 100): number[] {
  return equalSplit(poleCount, total);
}

const MIN_WEIGHT = 1e-4;
/** At full drag, weights use position^MAX_DYNAMIC_EXPONENT (linear at 0%). */
const MAX_DYNAMIC_EXPONENT = 3;

/**
 * Exponent ramps with the active slider: linear proportions near 0,
 * increasingly exponential as the dragged slider moves higher.
 */
export function redistributionExponent(activeValue: number, total: number): number {
  const activeRatio = Math.max(0, Math.min(1, activeValue / total));
  return 1 + (MAX_DYNAMIC_EXPONENT - 1) * activeRatio * activeRatio;
}

/** Weight for sharing a delta — higher positions absorb more as exponent grows. */
export function redistributionWeight(value: number, total: number, exponent: number): number {
  const normalized = Math.max(value, 0) / total;
  return Math.pow(Math.max(normalized, MIN_WEIGHT), exponent);
}

function distributeProportionally(
  indices: number[],
  weights: number[],
  amount: number
): number[] {
  const weightSum = weights.reduce((sum, w) => sum + w, 0);
  if (weightSum <= 0 || amount <= 0) return indices.map(() => 0);

  const shares = indices.map((_, j) => Math.round((amount * weights[j]!) / weightSum));
  let drift = amount - shares.reduce((a, b) => a + b, 0);
  let j = 0;
  while (drift !== 0 && j < shares.length * 2) {
    const idx = j % shares.length;
    const step = drift > 0 ? 1 : -1;
    if (shares[idx]! + step >= 0) {
      shares[idx]! += step;
      drift -= step;
    }
    j++;
  }
  return shares;
}

function takeFromOthers(
  values: number[],
  otherIndices: number[],
  amount: number,
  exponent: number,
  total: number
): number {
  let remaining = amount;
  const next = [...values];

  while (remaining > 0) {
    const donors = otherIndices.filter((i) => next[i]! > 0);
    if (donors.length === 0) break;

    const weights = donors.map((i) => redistributionWeight(next[i]!, total, exponent));
    const shares = distributeProportionally(donors, weights, remaining);

    let took = 0;
    for (let j = 0; j < donors.length; j++) {
      const idx = donors[j]!;
      const actual = Math.min(next[idx]!, shares[j]!);
      next[idx] = next[idx]! - actual;
      took += actual;
    }

    if (took === 0) break;
    remaining -= took;
  }

  for (let i = 0; i < next.length; i++) {
    values[i] = next[i]!;
  }
  return amount - remaining;
}

function giveToOthers(
  values: number[],
  otherIndices: number[],
  amount: number,
  exponent: number,
  total: number
): void {
  const weights = otherIndices.map((i) =>
    redistributionWeight(Math.max(values[i]!, total * MIN_WEIGHT), total, exponent)
  );
  const shares = distributeProportionally(otherIndices, weights, amount);
  otherIndices.forEach((idx, j) => {
    values[idx] = values[idx]! + shares[j]!;
  });
}

function fixTotal(values: number[], index: number, total: number): number[] {
  const otherIndices = values.map((_, i) => i).filter((i) => i !== index);
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum === total) return values;

  const diff = total - sum;
  const adjustIdx =
    otherIndices.find((i) => values[i]! + diff >= 0 && values[i]! + diff <= total) ??
    otherIndices[0];
  if (adjustIdx === undefined) return values;

  const next = [...values];
  next[adjustIdx] = next[adjustIdx]! + diff;
  return next;
}

/**
 * Redistribute a fixed budget when one pole changes.
 * Delta is shared across other sliders with weights proportional to position^exponent,
 * where exponent grows as the active slider moves (exponential response curve).
 */
export function redistributeLinkedSliders(
  values: number[],
  index: number,
  nextValue: number,
  total = 100
): number[] {
  const n = values.length;
  if (n === 0) return [];
  if (index < 0 || index >= n) return [...values];

  const clamped = Math.max(0, Math.min(total, Math.round(nextValue)));

  if (clamped === total) {
    return values.map((_, i) => (i === index ? total : 0));
  }

  const oldValue = values[index] ?? 0;
  const delta = clamped - oldValue;
  if (delta === 0) return [...values];

  const result = [...values];
  const otherIndices = [...Array(n).keys()].filter((i) => i !== index);
  const exponent = redistributionExponent(clamped, total);

  if (delta > 0) {
    const taken = takeFromOthers(result, otherIndices, delta, exponent, total);
    result[index] = oldValue + taken;
  } else {
    result[index] = clamped;
    const gift = -delta;

    if (otherIndices.every((i) => result[i]! === 0)) {
      const split = equalSplit(otherIndices.length, gift);
      otherIndices.forEach((oi, j) => {
        result[oi] = split[j]!;
      });
    } else {
      giveToOthers(result, otherIndices, gift, exponent, total);
    }
  }

  for (let i = 0; i < n; i++) {
    result[i] = Math.max(0, Math.min(total, result[i]!));
  }

  return fixTotal(result, index, total);
}
