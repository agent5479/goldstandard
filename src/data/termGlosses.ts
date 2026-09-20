/**
 * Conventional glosses for proprietary Gold Standard terms.
 * Preserve the original name; attach discoverable language beside it.
 */
export interface TermGloss {
  /** Canonical proprietary name. */
  term: string;
  /** Anchor id where the term is introduced (first heading). */
  anchor: string;
  /** Conventional concept for search / AI discovery. */
  gloss: string;
}

export const TERM_GLOSSES: TermGloss[] = [
  {
    term: 'Dog-Tantra',
    anchor: 'dog-tantra',
    gloss: 'handler–dog regulation and shared flow',
  },
  {
    term: 'Gold Standard Rule',
    anchor: 'gold-standard-rule',
    gloss: 'impulse control and handler focus — permission before action',
  },
  {
    term: 'Proactive deferential focus',
    anchor: 'gold-standard-rule',
    gloss: 'the dog looks to you as the sole decision-maker',
  },
  {
    term: 'Law of conservation of force',
    anchor: 'conservation-of-force',
    gloss: 'minimise total conflict over a lifetime — one clear correction over nagging',
  },
  {
    term: 'Anchor energy',
    anchor: 'pack-leader-energy',
    gloss: 'calm handler presence during dog training',
  },
  {
    term: 'Contextual receptivity',
    anchor: 'contextual-receptivity',
    gloss: 'do not correct unlearned skills under overload',
  },
  {
    term: 'One-second rule',
    anchor: 'timing',
    gloss: 'interrupt the live impulse within about one second',
  },
  {
    term: 'Controlled Confrontation',
    anchor: 'controlled-confrontation',
    gloss: 'structured dog-to-dog feedback with a balanced helper dog',
  },
  {
    term: 'Go-get recall',
    anchor: 'go-get-recall',
    gloss: 'reliable come-when-called that means leave and return',
  },
];

const byAnchor = new Map<string, TermGloss[]>();
for (const gloss of TERM_GLOSSES) {
  const list = byAnchor.get(gloss.anchor) ?? [];
  list.push(gloss);
  byAnchor.set(gloss.anchor, list);
}

export function getGlossesForAnchor(anchor: string): TermGloss[] {
  return byAnchor.get(anchor) ?? [];
}

/** Format “Term — conventional gloss” for UI. */
export function formatTermGloss(gloss: TermGloss): string {
  return `${gloss.term} — ${gloss.gloss}`;
}
