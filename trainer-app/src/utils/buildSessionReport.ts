import { getGuideAnchor, guideAnchorUrl } from '@/data/assessmentTaxonomy';
import {
  getSessionReportSnippet,
  SESSION_REPORT_SNIPPETS,
  type SessionReportSection,
  type SessionReportSnippet,
} from '@/data/sessionReportSnippets';
import type { Dog, Owner, SessionFlag, TrainingLog } from '@/types';
import { inferLifeStageFromDog, type LifeStageTagId } from '@/utils/dogLifeStage';

export interface SessionReportInput {
  owner?: Owner;
  dog?: Dog;
  sessionDate: string;
  trainingLogs: TrainingLog[];
  selectedSnippetIds: string[];
  customOpening?: string;
  customClosing?: string;
  includeGuideLinks?: boolean;
}

export interface SessionReportGuideLink {
  label: string;
  url: string;
}

export interface SessionReport {
  opening: string;
  accomplishmentsDog: string[];
  accomplishmentsHandler: string[];
  practice: string[];
  concerns: string[];
  guideLinks: SessionReportGuideLink[];
  body: string;
  trainerNotes?: string;
}

const DEFAULT_CLOSING =
  'Keep up the incredible work. Relentlessness isn\'t harshness — it is repeated clarity until the standard lands.\n\nQuestions between sessions? Call or text Warwick: 027 814 2222\n\nWarwick\nGold Standard Dog Training';

function interpolate(text: string, dogName: string, clientName: string): string {
  return text
    .replace(/\{\{dogName\}\}/g, dogName)
    .replace(/\{\{clientName\}\}/g, clientName);
}

function resolveNames(owner?: Owner, dog?: Dog): { dogName: string; clientName: string } {
  return {
    dogName: dog?.name?.trim() || 'your dog',
    clientName: owner?.name?.trim()?.split(/\s+/)[0] || 'there',
  };
}

function sessionFlag(trainingLogs: TrainingLog[]): SessionFlag | undefined {
  const flag = trainingLogs.find((l) => l.flag && l.flag !== 'none')?.flag;
  if (flag === 'breakthrough' || flag === 'setback' || flag === 'concern') return flag;
  return undefined;
}

function trainerNotesFromLogs(trainingLogs: TrainingLog[]): string | undefined {
  const notes = trainingLogs.map((l) => l.notes?.trim()).filter(Boolean);
  if (notes.length === 0) return undefined;
  return [...new Set(notes)].join('\n');
}

function defaultOpening(
  dogName: string,
  clientName: string,
  sessionDate: string,
  flag?: SessionFlag
): string {
  const formattedDate = sessionDate
    ? new Date(sessionDate + 'T12:00:00').toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : 'today';

  const lines: string[] = [];
  if (flag === 'breakthrough') {
    lines.push(`Great session with ${dogName} on ${formattedDate} — real breakthrough today.`);
  } else {
    lines.push(`Good session with ${dogName} on ${formattedDate}.`);
  }
  lines.push(`Hi ${clientName},`);
  return lines.join('\n');
}

function snippetVisible(
  snippet: SessionReportSnippet,
  lifeStage: LifeStageTagId | null,
  profileTags: Set<string>
): boolean {
  if (snippet.lifeStages?.length) {
    if (!lifeStage || !snippet.lifeStages.includes(lifeStage)) return false;
  }
  if (snippet.requireTags?.length) {
    if (!snippet.requireTags.some((tag) => profileTags.has(tag))) return false;
  }
  if (snippet.hideIfTags?.length) {
    if (snippet.hideIfTags.some((tag) => profileTags.has(tag))) return false;
  }
  return true;
}

export function filterSessionReportSnippets(
  dog?: Dog,
  options?: { commonOnly?: boolean; includeConcerns?: boolean }
): SessionReportSnippet[] {
  const lifeStage = inferLifeStageFromDog(dog || {});
  const profileTags = new Set(dog?.profileTags || []);

  return SESSION_REPORT_SNIPPETS.filter((snippet) => {
    if (options?.commonOnly && !snippet.common) return false;
    if (snippet.section === 'concern' && !options?.includeConcerns) return false;
    return snippetVisible(snippet, lifeStage, profileTags);
  });
}

export function suggestSessionReportSnippetIds(trainingLogs: TrainingLog[]): string[] {
  const focusIds = new Set(
    trainingLogs.map((l) => String(l.taskId)).filter(Boolean)
  );
  const flag = sessionFlag(trainingLogs);

  const suggested = new Set<string>();
  for (const snippet of SESSION_REPORT_SNIPPETS) {
    if (snippet.relatedFocusIds?.some((id) => focusIds.has(id))) {
      suggested.add(snippet.id);
    }
  }

  if (flag === 'setback') suggested.add('conc_setback');
  if (flag === 'concern') {
    suggested.add('conc_setback');
    suggested.add('conc_escalation');
  }

  return [...suggested];
}

function linesForSection(
  section: SessionReportSection,
  selectedIds: string[],
  dogName: string,
  clientName: string
): string[] {
  return selectedIds
    .map((id) => getSessionReportSnippet(id))
    .filter((s): s is SessionReportSnippet => s != null && s.section === section)
    .map((s) => interpolate(s.text, dogName, clientName));
}

function collectGuideLinks(selectedIds: string[]): SessionReportGuideLink[] {
  const seen = new Set<string>();
  const links: SessionReportGuideLink[] = [];

  for (const id of selectedIds) {
    const snippet = getSessionReportSnippet(id);
    if (!snippet?.guideAnchor || seen.has(snippet.guideAnchor)) continue;
    seen.add(snippet.guideAnchor);
    const anchor = getGuideAnchor(snippet.guideAnchor);
    links.push({
      label: anchor?.label || snippet.guideAnchor,
      url: guideAnchorUrl(snippet.guideAnchor),
    });
  }

  return links;
}

function assembleBody(parts: {
  opening: string;
  accomplishmentsDog: string[];
  accomplishmentsHandler: string[];
  practice: string[];
  concerns: string[];
  closing: string;
  guideLinks: SessionReportGuideLink[];
  includeGuideLinks: boolean;
}): string {
  const sections: string[] = [parts.opening, ''];

  if (parts.accomplishmentsDog.length > 0) {
    sections.push('What went well today:');
    parts.accomplishmentsDog.forEach((line) => sections.push(`- ${line}`));
    sections.push('');
  }

  if (parts.accomplishmentsHandler.length > 0) {
    sections.push('You did well:');
    parts.accomplishmentsHandler.forEach((line) => sections.push(`- ${line}`));
    sections.push('');
  }

  if (parts.practice.length > 0) {
    sections.push('Practice at home:');
    parts.practice.forEach((line) => sections.push(`- ${line}`));
    sections.push('');
  }

  if (parts.concerns.length > 0) {
    sections.push('Worth noting:');
    parts.concerns.forEach((line) => sections.push(`- ${line}`));
    sections.push('');
  }

  sections.push(parts.closing);

  if (parts.includeGuideLinks && parts.guideLinks.length > 0) {
    sections.push('');
    sections.push('In the guide:');
    parts.guideLinks.forEach((link) => sections.push(`${link.label}: ${link.url}`));
  }

  return sections.join('\n').trim();
}

export function buildSessionReport(input: SessionReportInput): SessionReport {
  const { dogName, clientName } = resolveNames(input.owner, input.dog);
  const flag = sessionFlag(input.trainingLogs);
  const opening =
    input.customOpening?.trim() ||
    defaultOpening(dogName, clientName, input.sessionDate, flag);
  const closing = input.customClosing?.trim() || DEFAULT_CLOSING;

  const accomplishmentsDog = linesForSection(
    'accomplishment_dog',
    input.selectedSnippetIds,
    dogName,
    clientName
  );
  const accomplishmentsHandler = linesForSection(
    'accomplishment_handler',
    input.selectedSnippetIds,
    dogName,
    clientName
  );
  const practice = linesForSection('practice', input.selectedSnippetIds, dogName, clientName);
  const concerns = linesForSection('concern', input.selectedSnippetIds, dogName, clientName);
  const guideLinks = collectGuideLinks(input.selectedSnippetIds);
  const includeGuideLinks = input.includeGuideLinks !== false;

  const body = assembleBody({
    opening,
    accomplishmentsDog,
    accomplishmentsHandler,
    practice,
    concerns,
    closing,
    guideLinks,
    includeGuideLinks,
  });

  return {
    opening,
    accomplishmentsDog,
    accomplishmentsHandler,
    practice,
    concerns,
    guideLinks,
    body,
    trainerNotes: trainerNotesFromLogs(input.trainingLogs),
  };
}
