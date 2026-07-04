/**
 * Lint exam question bank for banned distractor patterns, length balance, and guide anchors.
 * Run: npm run lint:exam
 */
import { examQuestions } from './examQuestions';
import { isKnownGuideAnchor } from './guideAnchors';

const BANNED_PATTERNS = [
  /not the guide/i,
  /entitlement rather than earned/i,
  /primary frame for this/i,
  /a common misread that ignores/i,
  /without the structured exposure, reset, or repetition/i,
  /without reading stress, rank-testing/i,
  /handler shortcut/i,
  /not what the guide describes/i,
];

const ABSOLUTE_PATTERN = /\b(forever|always|never|every time|without exception)\b/i;

/** Phrases allowed in wrong options when they reflect guide-calibrated language in correct answers nearby. */
const ABSOLUTE_ALLOWLIST = [
  /never repeated/i,
  /never personal/i,
  /never overused/i,
  /never during reactivity/i,
  /never heard before/i,
  /never meets another dog until/i,
  /never appropriate for some individuals/i,
  /never learned the recall/i,
  /never leave the lower rungs/i,
  /never appropriate/i,
];

/** Stems that force negation are harder for mixed reading levels. */
const NEGATIVE_STEM_PATTERN = /\b(what should you not|what should you NOT|should you not)\b/i;

/** Wrong options should approach correct-answer depth (action + rationale). */
const MIN_LENGTH_RATIO = 0.8;
const MAX_LENGTH_RATIO = 1.5;

function isAllowedAbsolute(text: string): boolean {
  return ABSOLUTE_ALLOWLIST.some((p) => p.test(text));
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface LintIssue {
  question: string;
  optionIndex: number;
  option: string;
  reason: string;
}

const issues: LintIssue[] = [];

for (const q of examQuestions) {
  if (!isKnownGuideAnchor(q.guideLink)) {
    issues.push({
      question: q.text.slice(0, 80),
      optionIndex: -1,
      option: q.guideLink,
      reason: 'Unknown guideLink anchor',
    });
  }

  if (NEGATIVE_STEM_PATTERN.test(q.text)) {
    issues.push({
      question: q.text.slice(0, 80),
      optionIndex: -1,
      option: q.text,
      reason: 'Negative-framed stem — prefer positive framing (what to do, not what not to do)',
    });
  }

  const correctWords = wordCount(q.options[0] ?? '');

  q.options.forEach((opt, i) => {
    if (i === 0) return;

    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(opt)) {
        issues.push({
          question: q.text.slice(0, 80),
          optionIndex: i,
          option: opt,
          reason: `Banned pattern: ${pattern}`,
        });
      }
    }

    if (ABSOLUTE_PATTERN.test(opt) && !isAllowedAbsolute(opt)) {
      issues.push({
        question: q.text.slice(0, 80),
        optionIndex: i,
        option: opt,
        reason: 'Absurd absolute in wrong option',
      });
    }

    if (correctWords > 0) {
      const words = wordCount(opt);
      const ratio = words / correctWords;
      if (ratio < MIN_LENGTH_RATIO) {
        issues.push({
          question: q.text.slice(0, 80),
          optionIndex: i,
          option: opt,
          reason: `Wrong option too short (${words} words vs ${correctWords} correct; min ${Math.ceil(correctWords * MIN_LENGTH_RATIO)})`,
        });
      } else if (ratio > MAX_LENGTH_RATIO) {
        issues.push({
          question: q.text.slice(0, 80),
          optionIndex: i,
          option: opt,
          reason: `Wrong option too long (${words} words vs ${correctWords} correct; max ${Math.floor(correctWords * MAX_LENGTH_RATIO)})`,
        });
      }
    }
  });
}

if (issues.length > 0) {
  console.error(`examLint: ${issues.length} issue(s) found:\n`);
  for (const issue of issues) {
    console.error(`Q: ${issue.question}…`);
    console.error(`  [${issue.optionIndex}] ${issue.option}`);
    console.error(`  → ${issue.reason}\n`);
  }
  process.exit(1);
}

console.log(`examLint: OK — ${examQuestions.length} questions checked.`);
