import { ALLOCATION_SCALE_TOTAL } from '../utils/allocationScales';
import { defaultLinkedShares } from '../utils/linkedSliders';

export interface AllocationPole {
  id: string;
  label: string;
  sublabel?: string;
}

export interface AllocationDimension {
  id: string;
  label: string;
  poles: AllocationPole[];
}

export interface AllocationQuestion {
  id: string;
  prompt: string;
  /** Single linked group (default). */
  poles?: AllocationPole[];
  /** Independent linked groups, each summing to 100%. */
  dimensions?: AllocationDimension[];
}

export function getQuestionDimensions(question: AllocationQuestion): AllocationDimension[] {
  if (question.dimensions?.length) return question.dimensions;
  return [{ id: question.id, label: '', poles: question.poles ?? [] }];
}

export function flattenPoles(question: AllocationQuestion): AllocationPole[] {
  return getQuestionDimensions(question).flatMap((dimension) => dimension.poles);
}

export function getDefaultSharesForQuestion(
  question: AllocationQuestion,
  total = ALLOCATION_SCALE_TOTAL
): number[] {
  return getQuestionDimensions(question).flatMap((dimension) =>
    defaultLinkedShares(dimension.poles.length, total)
  );
}

export function shareFraction(share: number, total = ALLOCATION_SCALE_TOTAL): number {
  if (total <= 0) return 0;
  return share / total;
}

export function blendFromShares<T extends Record<string, number>>(
  poles: AllocationPole[],
  shares: number[],
  blendField: (pole: AllocationPole, fraction: number, acc: T) => void,
  initial: T,
  total = ALLOCATION_SCALE_TOTAL
): T {
  const result = { ...initial };

  for (let i = 0; i < poles.length; i++) {
    const fraction = shareFraction(shares[i] ?? 0, total);
    if (fraction <= 0) continue;
    blendField(poles[i]!, fraction, result);
  }

  return result;
}

export function dominantPoleId(poles: AllocationPole[], shares: number[]): string | undefined {
  let bestId: string | undefined;
  let bestShare = -1;

  for (let i = 0; i < poles.length; i++) {
    const share = shares[i] ?? 0;
    if (share > bestShare) {
      bestShare = share;
      bestId = poles[i]!.id;
    }
  }

  return bestId;
}

export function buildFieldWeightsFromShares(
  question: AllocationQuestion,
  shares: number[]
): Record<string, number> {
  const poles = flattenPoles(question);
  const weights: Record<string, number> = {};

  for (let i = 0; i < poles.length; i++) {
    weights[poles[i]!.id] = shares[i] ?? 0;
  }

  return weights;
}
