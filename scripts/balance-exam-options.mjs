/**
 * Balance exam distractors toward ~78–100% of correct answer length (never exceed correct).
 */
import fs from 'fs';
import { examQuestions } from '../src/data/examQuestions.ts';

/** Longest fitting suffix wins; sorted longest-first per tier. */
const TOPIC_SUFFIXES = {
  'Off-leash social': [
    ' — skipping graded exposure where controlled mistakes should teach accountability and recall',
    ' — avoiding handler-led structure when freedom should be earned through repetition',
    ' — treating isolation or avoidance as a substitute for real social calibration',
    ' — leaving rank, safety, and boundaries to dogs alone instead of handler structure',
    ' — without the millisecond reads and access removal the guide expects off-lead',
  ],
  'Road safety': [
    ' — treating traffic like everyday calibration instead of a zero-tolerance reflex beside vehicles',
    ' — staying on the sealed edge instead of evacuating to gutter or verge as the guide requires',
    ' — assuming recall elsewhere transfers to rural road edges without months of on-lead drilling',
    ' — softening or delaying response when hesitation beside traffic is high-stakes failure',
    ' — granting off-lead access before the car protocol is automated through repetition',
  ],
  'Corrections': [
    ' — delivered after the moment has passed instead of inside the one-second window',
    ' — vented as anger, scolding, or moral judgment rather than a calm interruption',
    ' — repeated nagging or name-yelling instead of a unique sound and unique touch',
    ' — skipping lighter structure and jumping straight to heavy tools',
    ' — without the fast reset and handler calm the guide pairs with every correction',
  ],
  'Leash work': [
    ' — inviting opposition reflex through sustained pressure instead of spatial guidance',
    ' — letting the dog forge ahead because excitement or friendliness excuses position',
    ' — relying on equipment alone without handler position and reset mechanics',
    ' — treating leash tension as invisible or harmless to the dog\'s learning',
  ],
  'Reading signals': [
    ' — misreading the body signal as guilt, play, or hunger instead of stress or rank',
    ' — skipping the second-before context that tells you whether to intervene',
    ' — treating displacement or arousal as a unrelated cause without reading the whole picture',
    ' — correcting the symptom without lowering energy or rebuilding confidence first',
  ],
  'Body language': [
    ' — reading the signal in isolation without tail, movement, and what happens next',
    ' — treating a single posture as proof of play, guilt, or aggression every time',
    ' — missing the stress or rank subtext the guide tells you to read first',
  ],
  'Relationship habits': [
    ' — collapsing the standard because excitement, age, or friendliness feels like an excuse',
    ' — rewarding the wrong state with affection, chatter, or access at the wrong moment',
    ' — skipping reset, wait, or permission mechanics the guide treats as non-negotiable',
  ],
  'Owner mindset': [
    ' — projecting handler anxiety or performative anger instead of calm certainty',
    ' — treating difficulty as failure to avoid rather than controlled training opportunity',
    ' — rewarding with excited energy when the guide expects low, grounded release',
  ],
  'Access & rewards': [
    ' — withholding structure or running the treat diagnostic backwards',
    ' — granting access as entitlement before behaviour earns it on your terms',
    ' — mismatching reward currency or timing to what the individual dog values',
  ],
  'Timing': [
    ' — outside the one-second window where the dog can still connect cause and effect',
    ' — nagging, repeating, or lecturing instead of one cue and one consequence',
  ],
  'Breed temperament': [
    ' — applying a one-size rule without calibrating to breed, age, or individual drive',
    ' — assuming maturity alone will replace structure, outlets, and handler consistency',
  ],
};

const UNIVERSAL = [
  ' — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
  ' — treating the symptom without the calibration and accountability standard in this section',
  ' — not the guide\'s primary frame for this situation, age, or context',
  ' — without the structured exposure, reset, or repetition the guide describes',
  ' — assuming equipment, maturity, or avoidance alone will replace handler leadership',
  ' — delivered at the wrong moment or with the wrong energy for the guide\'s standard',
  ' — missing the individual dog, trauma history, or breed calibration the guide names',
  ' — as if this narrow case overrides the wider handler standard elsewhere in the guide',
  ' — not what the guide describes as the primary standard in this context',
  ' — a common misread that ignores context, timing, and what happened just before',
  ' — though structure and calibration still apply throughout training',
  ' — without reading stress, rank-testing, or denied outlets first',
  ' — even when lighter tools have not been tried consistently first',
  ' — as entitlement rather than earned access on your terms',
  ' — not the guide\'s frame for this',
  ' — a common handler misread here',
  ' — misses context and timing',
];

function suffixPool(question) {
  const topic = TOPIC_SUFFIXES[question.topic] ?? [];
  return [...new Set([...topic, ...UNIVERSAL])].sort((a, b) => b.length - a.length);
}

function expandWrong(wrong, correctLen, question, wrongIndex = 0) {
  const base = wrong.replace(/\s+$/, '');
  const floor = Math.floor(correctLen * 0.78);
  if (base.length >= floor) return base;

  const pool = suffixPool(question);
  const rotated = [...pool.slice(wrongIndex % pool.length), ...pool.slice(0, wrongIndex % pool.length)];
  let best = base;

  for (const suffix of rotated) {
    const candidate = base + suffix;
    if (candidate.length <= correctLen && candidate.length > best.length) best = candidate;
    if (best.length >= floor) return best;
  }

  // Last resort: only use complete suffixes that fit remaining room
  const room = correctLen - base.length;
  if (room >= 20 && best === base) {
    const complete = UNIVERSAL.filter((s) => base.length + s.length <= correctLen).sort(
      (a, b) => b.length - a.length
    );
    if (complete[0]) best = base + complete[0];
  }

  return best;
}

function balanceQuestion(question) {
  const correct = question.options[0];
  const cLen = correct.length;
  return [correct, ...question.options.slice(1).map((w, i) => expandWrong(w, cLen, question, i))];
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const srcPath = 'src/data/examQuestions.ts';
let src = fs.readFileSync(srcPath, 'utf8');
const eol = src.includes('\r\n') ? '\r\n' : '\n';

function formatOptions(options) {
  return (
    '    options: [' +
    eol +
    options.map((o) => `      '${esc(o)}',`).join(eol) +
    eol +
    '    ]'
  );
}

let qIndex = 0;
src = src.replace(/    options: \[[\s\S]*?    \]/g, () =>
  formatOptions(balanceQuestion(examQuestions[qIndex++]))
);
fs.writeFileSync(srcPath, src);

let flagged = 0;
let tooLong = 0;
for (const q of examQuestions) {
  const opts = balanceQuestion(q);
  const c = opts[0].length;
  const w = opts.slice(1).map((o) => o.length);
  const avg = w.reduce((a, b) => a + b, 0) / 3;
  const maxW = Math.max(...w);
  if (c / avg >= 1.25 || c - maxW >= 12) flagged++;
  if (maxW > c) tooLong++;
}
console.log('Processed:', qIndex);
console.log('Still flagged (ratio>=1.25 or diff>=12):', flagged);
console.log('Wrong longer than correct:', tooLong);
