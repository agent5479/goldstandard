export const ALLOCATION_SCALE_P = 10;
export const ALLOCATION_SCALE_TOTAL = 1000;

export function parseAllocationPercentInput(display: number): number {
  if (!Number.isFinite(display)) return 0;
  return Math.max(0, Math.min(ALLOCATION_SCALE_TOTAL, Math.round(display * ALLOCATION_SCALE_P)));
}

export function formatAllocationPercent(
  weight: number,
  total: number = ALLOCATION_SCALE_TOTAL
): string {
  if (total <= 0) return '0';
  return String(Math.round((weight / total) * 100 * 10) / 10);
}

export function createEmptyWeights(memberIds: string[], total: number = ALLOCATION_SCALE_TOTAL): Record<string, number> {
  return splitEvenly(memberIds, total);
}

export function splitEvenly(
  memberIds: string[],
  budget: number,
  prior?: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = { ...(prior ?? {}) };
  for (const id of memberIds) {
    if (result[id] === undefined) result[id] = 0;
  }
  if (memberIds.length === 0 || budget <= 0) return result;

  const n = memberIds.length;
  const base = Math.floor(budget / n);
  const remainder = budget - base * n;

  for (const id of memberIds) {
    result[id] = (result[id] ?? 0) + base;
  }

  const sorted = [...memberIds].sort((a, b) => a.localeCompare(b));
  for (let i = 0; i < remainder; i++) {
    const id = sorted[i % sorted.length]!;
    result[id] = (result[id] ?? 0) + 1;
  }

  return result;
}

export function splitProportionalDeltaSpread(
  activeIds: string[],
  prior: Record<string, number>,
  budget: number
): Record<string, number> {
  const spread: Record<string, number> = {};
  for (const id of activeIds) spread[id] = 0;

  if (budget <= 0 || activeIds.length === 0) return spread;

  const n = activeIds.length;
  let remaining = budget;

  if (remaining >= n) {
    const sortedByPrior = [...activeIds].sort((a, b) => {
      const diff = (prior[a] ?? 0) - (prior[b] ?? 0);
      if (diff !== 0) return diff;
      return a.localeCompare(b);
    });
    for (const id of sortedByPrior) {
      spread[id] = (spread[id] ?? 0) + 1;
      remaining -= 1;
      if (remaining <= 0) return spread;
    }
  }

  while (remaining > 0) {
    let bestId = activeIds[0]!;
    let bestScore = -1;

    for (const id of activeIds) {
      const score = (prior[id] ?? 0) / ((spread[id] ?? 0) + 1);
      if (score > bestScore || (score === bestScore && id.localeCompare(bestId) < 0)) {
        bestScore = score;
        bestId = id;
      }
    }

    spread[bestId] = (spread[bestId] ?? 0) + 1;
    remaining -= 1;
  }

  return spread;
}

export function applyStagnationGuard(
  prior: Record<string, number>,
  out: Record<string, number>,
  activeOthers: string[],
  delta: number
): void {
  const threshold = Math.max(2, activeOthers.length);
  if (Math.abs(delta) < threshold) return;

  const maxIterations = activeOthers.length * Math.abs(delta) + 8;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const stuck = activeOthers.filter((id) => (out[id] ?? 0) === (prior[id] ?? 0));
    if (stuck.length === 0) return;

    let maxMoverId = activeOthers[0]!;
    let maxMove = -1;
    for (const id of activeOthers) {
      const move = Math.abs((out[id] ?? 0) - (prior[id] ?? 0));
      if (move > maxMove) {
        maxMove = move;
        maxMoverId = id;
      }
    }

    let stuckRecipient = stuck[0]!;
    let largestPrior = -1;
    for (const id of stuck) {
      const value = prior[id] ?? 0;
      if (value > largestPrior) {
        largestPrior = value;
        stuckRecipient = id;
      }
    }

    if (maxMoverId === stuckRecipient) return;

    if (delta > 0) {
      if ((out[maxMoverId] ?? 0) <= (prior[maxMoverId] ?? 0)) return;
      out[maxMoverId] = (out[maxMoverId] ?? 0) - 1;
      out[stuckRecipient] = (out[stuckRecipient] ?? 0) + 1;
    } else {
      if ((out[maxMoverId] ?? 0) >= (prior[maxMoverId] ?? 0)) return;
      out[maxMoverId] = (out[maxMoverId] ?? 0) + 1;
      out[stuckRecipient] = (out[stuckRecipient] ?? 0) - 1;
    }
  }
}

export function redistributeOnChange(
  changedId: string,
  clampedWeight: number,
  priorWeights: Record<string, number>,
  total: number = ALLOCATION_SCALE_TOTAL,
  memberIds?: string[]
): Record<string, number> {
  const ids = memberIds ?? Object.keys(priorWeights);
  const prior = Object.fromEntries(ids.map((id) => [id, priorWeights[id] ?? 0])) as Record<string, number>;
  const out = { ...prior };

  const clamped = Math.max(0, Math.min(total, Math.round(clampedWeight)));
  const oldValue = prior[changedId] ?? 0;
  const delta = clamped - oldValue;

  out[changedId] = clamped;

  if (clamped === total) {
    for (const id of ids) {
      if (id !== changedId) out[id] = 0;
    }
    return out;
  }

  if (delta === 0) return out;

  const otherIds = ids.filter((id) => id !== changedId);
  const activeOthers = otherIds.filter((id) => (prior[id] ?? 0) > 0);
  const zeroOthers = otherIds.filter((id) => (prior[id] ?? 0) === 0);
  for (const id of zeroOthers) out[id] = 0;

  const budget = Math.abs(delta);

  if (activeOthers.length === 0) {
    const bootstrap = splitEvenly(otherIds, budget);
    if (delta > 0) {
      for (const id of otherIds) {
        out[id] = (out[id] ?? 0) + (bootstrap[id] ?? 0);
      }
    } else {
      for (const id of otherIds) {
        out[id] = bootstrap[id] ?? 0;
      }
    }
    return out;
  }

  const spread = splitProportionalDeltaSpread(activeOthers, prior, budget);

  if (delta > 0) {
    for (const id of activeOthers) {
      out[id] = Math.max(0, (prior[id] ?? 0) - (spread[id] ?? 0));
    }
  } else {
    for (const id of activeOthers) {
      out[id] = Math.min(total, (prior[id] ?? 0) + (spread[id] ?? 0));
    }
  }

  applyStagnationGuard(prior, out, activeOthers, delta);

  return out;
}
