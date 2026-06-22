import { breedCategories, breeds } from '../data/breeds';
import type { BreedCategory } from '../data/breeds';
import {
  findColloquialMixForBreedName,
  resolveColloquialMixTitle,
  resolveCrossParentNames,
} from '../data/colloquialMixNames';
import {
  findBreedByName,
  getBreedMixAxisProfile,
  getCategoryAxisHint,
} from '../data/breedTraits';
import type { MixParentSource, MixSelection } from '../pages/exam/MixPicker';

export { isKnownCrossBreed, resolveCrossParentNamesFromBreed } from '../data/colloquialMixNames';

/** Drop an unset third parent and remap trait sources that referenced it. */
export function normalizeMixSelection(selection: MixSelection): MixSelection {
  if (selection.parentC) return selection;

  const remap = (
    source: MixParentSource,
    category: BreedCategory
  ): { source: MixParentSource; category: BreedCategory } => {
    if (source === 'c') return { source: 'other', category };
    if (source === 'b' && !selection.parentB) return { source: 'other', category };
    return { source, category };
  };

  const personality = remap(selection.personalitySource, selection.personality);
  const working = remap(selection.workingSource, selection.working);
  const physical = remap(selection.physicalSource, selection.physical);

  return {
    ...selection,
    parentC: null,
    personality: personality.category,
    working: working.category,
    physical: physical.category,
    personalitySource: personality.source,
    workingSource: working.source,
    physicalSource: physical.source,
  };
}

function formatMixParents(selection: MixSelection): string {
  const parts = [selection.parentA.name, selection.parentB?.name ?? 'unknown'];
  if (selection.parentC) parts.push(selection.parentC.name);
  return parts.join(' × ');
}

function mixParentNames(selection: MixSelection) {
  return {
    parentA: selection.parentA.name,
    parentB: selection.parentB?.name ?? null,
    parentC: selection.parentC?.name ?? null,
  };
}

/** Breed title for a mix — colloquial name when the cross is a known deliberate mix. */
export function formatMixTitle(selection: MixSelection): string {
  return resolveColloquialMixTitle(mixParentNames(selection)) ?? formatMixParents(selection);
}

function formatMixAxis(
  selection: MixSelection,
  axis: 'personality' | 'working' | 'physical',
  audience: 'client' | 'trainer'
): string {
  const sourceKey = `${axis}Source` as const;
  const source = selection[sourceKey];
  const category = selection[axis];
  const axisDetail = (breedName: string) => {
    const breed = findBreedByName(breedName);
    if (!breed) return breedName;
    return getBreedMixAxisProfile(breed, axis, audience);
  };

  if (source === 'a') {
    return `${selection.parentA.name} (${axisDetail(selection.parentA.name)})`;
  }
  if (source === 'b' && selection.parentB) {
    return `${selection.parentB.name} (${axisDetail(selection.parentB.name)})`;
  }
  if (source === 'c' && selection.parentC) {
    return `${selection.parentC.name} (${axisDetail(selection.parentC.name)})`;
  }
  return getCategoryAxisHint(category, axis);
}

export function formatMixBreedLabel(
  selection: MixSelection,
  audience: 'client' | 'trainer' = 'client'
): string {
  const normalized = normalizeMixSelection(selection);
  const title = formatMixTitle(normalized);
  const personality = formatMixAxis(normalized, 'personality', audience);
  const working = formatMixAxis(normalized, 'working', audience);
  const physical = formatMixAxis(normalized, 'physical', audience);
  return `${title} mix (${personality} / ${working} / ${physical})`;
}

export function formatTemperamentBreedLabel(category: BreedCategory): string {
  return `Mixed / unlisted — closest: ${breedCategories[category].label}`;
}

const STRUCTURED_MIX_LABEL_RE = /^(.+?) mix \((.+)\)$/;

/** Short breed line for cards and chips — drops stored mix trait detail. */
export function formatBreedDisplayLabel(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return '';
  const match = trimmed.match(STRUCTURED_MIX_LABEL_RE);
  if (match) return match[1].trim();
  return trimmed;
}

export interface ParsedMixAxisSegment {
  source?: string;
  detail: string;
}

export interface ParsedMixBreedLabel {
  title: string;
  personality: ParsedMixAxisSegment;
  working: ParsedMixAxisSegment;
  physical: ParsedMixAxisSegment;
}

function parseMixAxisSegment(segment: string): ParsedMixAxisSegment {
  const trimmed = segment.trim();
  const parenMatch = trimmed.match(/^(.+?) \((.+)\)$/s);
  if (parenMatch) {
    return { source: parenMatch[1].trim(), detail: parenMatch[2].trim() };
  }
  return { detail: trimmed };
}

/** Parse a structured mix label produced by formatMixBreedLabel. */
export function parseStructuredMixLabel(label: string): ParsedMixBreedLabel | null {
  const match = label.trim().match(STRUCTURED_MIX_LABEL_RE);
  if (!match) return null;

  const parts = match[2].split('/').map((part) => part.trim());
  if (parts.length !== 3) return null;

  return {
    title: match[1].trim(),
    personality: parseMixAxisSegment(parts[0]),
    working: parseMixAxisSegment(parts[1]),
    physical: parseMixAxisSegment(parts[2]),
  };
}

/** Build a default mix selection when a deliberate cross breed is picked as a single breed. */
export function buildDefaultMixSelectionFromCross(breedName: string): MixSelection | null {
  const entry = findColloquialMixForBreedName(breedName);
  if (!entry) return null;

  const [nameA, nameB] = resolveCrossParentNames(entry);
  const parentA = breeds.find((breed) => breed.name === nameA);
  const parentB = breeds.find((breed) => breed.name === nameB);
  if (!parentA || !parentB) return null;

  return {
    parentA,
    parentB,
    parentC: null,
    personality: parentA.category,
    working: parentB.category,
    physical: parentA.category,
    personalitySource: 'a',
    workingSource: 'b',
    physicalSource: 'a',
  };
}
