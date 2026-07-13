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

/**
 * Redistribute a fixed budget across linked sliders when one pole changes.
 * If a pole hits max, all others become 0. Freeing budget restarts others from an equal split.
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

  const otherIndices = [...Array(n).keys()].filter((i) => i !== index);
  const newOthersBudget = total - clamped;

  if (newOthersBudget === 0) {
    return values.map((_, i) => (i === index ? clamped : 0));
  }

  const othersSum = otherIndices.reduce((sum, i) => sum + values[i]!, 0);
  const result = [...values];
  result[index] = clamped;

  if (othersSum === 0) {
    const split = equalSplit(otherIndices.length, newOthersBudget);
    otherIndices.forEach((oi, j) => {
      result[oi] = split[j]!;
    });
    return result;
  }

  let allocated = 0;
  for (let j = 0; j < otherIndices.length; j++) {
    const oi = otherIndices[j]!;
    if (j === otherIndices.length - 1) {
      result[oi] = newOthersBudget - allocated;
    } else {
      const proportion = values[oi]! / othersSum;
      const share = Math.round(proportion * newOthersBudget);
      result[oi] = share;
      allocated += share;
    }
  }

  const sum = result.reduce((a, b) => a + b, 0);
  if (sum !== total) {
    const diff = total - sum;
    const adjustIdx =
      otherIndices.find((i) => result[i]! + diff >= 0 && result[i]! + diff <= total) ??
      otherIndices[0]!;
    result[adjustIdx] = result[adjustIdx]! + diff;
  }

  return result;
}
