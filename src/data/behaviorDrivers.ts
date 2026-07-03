/** Behavior drivers — calibrate what is driving a behaviour before opening a neuro playbook. */

export type BehaviorDriver =
  | 'skill_gap'
  | 'owner_dynamics'
  | 'breed_expression'
  | 'age_development'
  | 'entitlement_hardship'
  | 'trauma_security'
  | 'social_dominance'
  | 'neuro_stress_loop';

export interface BehaviorDriverDef {
  id: BehaviorDriver;
  label: string;
  summary: string;
  keyQuestions: string[];
  looksLike: string[];
  notThisWhen: string[];
  primaryResponse: string;
  guideAnchors: string[];
  playbookEligible: boolean;
  order: number;
}

export const BEHAVIOR_DRIVERS: BehaviorDriverDef[] = [
  {
    id: 'skill_gap',
    label: 'Skill gap — never taught',
    order: 1,
    summary:
      'The dog has not reliably learned the standard. Behaviour improves quickly once structure is applied in low distraction.',
    keyQuestions: [
      'Has this cue or boundary been taught to proof in a quiet room first?',
      'Does the behaviour resolve within the first few structured sessions?',
      'Is the dog simply rehearsing what has been allowed, not what has been forbidden?',
    ],
    looksLike: [
      'Inconsistent recall or heel with no prior proofing',
      'Optional commands — the dog sometimes complies when convenient',
      'Puppy or new adopter who has never had clear household rules',
    ],
    notThisWhen: [
      'The dog shuts down or flinches when corrected — see trauma_security',
      'The behaviour worsens under No/Stop despite prior training — see neuro_stress_loop',
    ],
    primaryResponse:
      'Train basics first — pillars, cue-once, access, and real-world proofing. Do not open a rehabilitation playbook until structure has been attempted consistently.',
    guideAnchors: ['pillars', 'cue-once', 'access', 'expectations'],
    playbookEligible: false,
  },
  {
    id: 'owner_dynamics',
    label: 'Owner dynamics',
    order: 2,
    summary:
      'Handler energy, yo-yo praise, anxious anticipation, or indulgence is amplifying or creating the behaviour.',
    keyQuestions: [
      'Does the behaviour track your mood — worse when you are anxious or excited?',
      'Do you match the dog\'s arousal at greetings or on walks?',
      'Is dramatic praise or baby-talk reinforcing the exact moment you want to suppress?',
    ],
    looksLike: [
      'Dog fills a leadership gap when handler broadcasts tension down the leash',
      'Greeting chaos that mirrors owner excitement',
      'Velcro or demand behaviour that gets intermittent reward',
    ],
    notThisWhen: [
      'Handler is calm and consistent but behaviour persists on the substitution path — layer neuro_stress_loop',
      'Dog-dog rank signals with calm handler — see social_dominance',
    ],
    primaryResponse:
      'Reset owner baseline — new subconscious standard, neutral accountability, no yo-yo. Fix handler contribution before blaming the dog.',
    guideAnchors: ['owner-mindset', 'new-baseline', 'correction-praise-trap', 'common-pitfalls', 'pack-leader-energy'],
    playbookEligible: false,
  },
  {
    id: 'breed_expression',
    label: 'Breed expression',
    order: 3,
    summary:
      'Normal genetic blueprint — adjust delivery and outlets, do not pathologize. The behaviour matches what the breed was built for.',
    keyQuestions: [
      'Does this match the breed\'s instinct subtype — retrieve, scent, herding eye, guard?',
      'Does it reduce when given an appropriate genetic outlet?',
      'Would another dog of this breed show the same tendency with the same upbringing?',
    ],
    looksLike: [
      'Retriever carrying objects — mouth job, not disorder',
      'Scenthound scent lock — biology, not defiance',
      'Herding eye on movement — precursor to fixation, not personal attack',
      'Guard breed perimeter awareness — context for structure, not excuse for chaos',
    ],
    notThisWhen: [
      'Behaviour worsens under calm structure and No/Stop deepens insecurity — neuro_stress_loop may be layered',
      'Pushy boundary sport in a privileged adult — entitlement_hardship',
    ],
    primaryResponse:
      'Match motivator and outlet to breed blueprint. See breed variance and Breed Analysis — then hold the universal standard with adjusted delivery.',
    guideAnchors: ['breed-temperament', 'breed-age-intensity'],
    playbookEligible: false,
  },
  {
    id: 'age_development',
    label: 'Age & development',
    order: 4,
    summary:
      'Puppy elasticity, adolescent testing, or slow giant maturation — temporal stage, not a chronic neuro loop.',
    keyQuestions: [
      'Is the dog in puppy, adolescent, or slow-maturing giant phase?',
      'Did mounting, barging, or selective deafness spike recently with age?',
      'Will firm, non-personal structure likely resolve this within months?',
    ],
    looksLike: [
      'Adolescent mounting, shoulder barging, selective deafness',
      'Puppy forgetfulness under load — elastic recovery',
      'Giant breed independence before social maturity — slow arc, not stubbornness',
    ],
    notThisWhen: [
      'Adult with entrenched entitled habits after a privileged life — entitlement_hardship',
      'Shutdown, flinch, or context shock regardless of age — trauma_security',
    ],
    primaryResponse:
      'Calibrate firmness to age × temperament. Hold the standard; soften the drama. See breed-age intensity and symptom glossary.',
    guideAnchors: ['breed-age-intensity', 'symptom-glossary'],
    playbookEligible: false,
  },
  {
    id: 'entitlement_hardship',
    label: 'Entitlement & hardship',
    order: 5,
    summary:
      'Pampered life, boundary negotiation as sport — pushy confident adult who needs intentional hardship, not trauma-soft handling.',
    keyQuestions: [
      'Has this dog had too easy a life — counter-surfing, attention on demand, no consequences?',
      'Does the dog escalate when challenged rather than shut down?',
      'Is mouthing or licking pushy with a hard body, not soft appeasement?',
    ],
    looksLike: [
      'Counter-surfer, door dasher, attention sport after privileged upbringing',
      'Pushy mouthing that escalates under correction — not sad, negotiating',
      'Confident adolescent or adult turning recall into a game',
    ],
    notThisWhen: [
      'Dog gets sad, shuts down, or licks more under No/Stop — insecurity loop, not entitlement',
      'Whale eye, flinch, refusing food under load — trauma_security',
    ],
    primaryResponse:
      'Intentional hardship — collar grab, verbal correction, frustration tolerance. Not the substitution playbook. See trauma-hardship calibration (pampered card).',
    guideAnchors: ['trauma-hardship-calibration', 'collar-snatch', 'verbal-correction', 'access'],
    playbookEligible: false,
  },
  {
    id: 'trauma_security',
    label: 'Trauma & security-first',
    order: 6,
    summary:
      'Nervous system damage or acute overload — security-first structure, intensity drops, never shocking correction on trauma signals.',
    keyQuestions: [
      'Does the dog flinch, shutdown, cower, bolt from contact, or refuse food under load?',
      'Is there acoustic overload, cargo shock, or context shock history?',
      'Does firmer correction confirm the world is unsafe rather than clarify?',
    ],
    looksLike: [
      'Shutdown — still, unresponsive, refusing food',
      'Context shock — hardwood, fans, glass panic in rescue',
      'Whale eye when handler looms — safety read, not sass',
    ],
    notThisWhen: [
      'Pushy entitlement with no trauma history — hardship path',
      'Rehearsed velcro licking without trauma — may be neuro_stress_loop on substitution path',
    ],
    primaryResponse:
      'Security-first — controlled exposure, exits and wins, calm certainty not assault. See trauma vs hardship and when-not-firmer.',
    guideAnchors: ['trauma-signals', 'trauma-vs-hardship', 'true-canine-trauma', 'when-not-firmer', 'trauma-hardship-calibration'],
    playbookEligible: false,
  },
  {
    id: 'social_dominance',
    label: 'Social dominance (dog-dog)',
    order: 7,
    summary:
      'Dog-to-dog rank navigation — mounting, T-bone, barging. Distinct from handler anxiety and not fixed by softer handling.',
    keyQuestions: [
      'Is this behaviour directed at other dogs, not handler skin or contact?',
      'Is there T-bone posture, mounting, rough sniffing, or rank barging?',
      'Is the dog confident and pushy in social space rather than appeasing?',
    ],
    looksLike: [
      'Mounting, shoulder barging, chin-over-shoulder on other dogs',
      'Perpendicular approach with rank posturing',
      'Rough play that ignores other dog\'s cut-off signals',
    ],
    notThisWhen: [
      'Fearful defensive snap to escape spatial pressure — fear_reactive pattern',
      'Handler-directed licking or velcro — anxious_attachment, not dominance',
    ],
    primaryResponse:
      'Structured social exposure with sharp boundaries — dominance navigation, social friction, meetings on leash until maturity.',
    guideAnchors: ['dominance-navigation', 'social-friction', 'dog-meetings', 'dog-meetings-leash'],
    playbookEligible: false,
  },
  {
    id: 'neuro_stress_loop',
    label: 'Neuro stress loop',
    order: 8,
    summary:
      'Chronic stress pattern confirmed after ruling out or layering other drivers — opens the pattern playbook and symptom expression index.',
    keyQuestions: [
      'Has skill gap, owner dynamics, and entitlement been ruled out or addressed?',
      'Does behaviour match a dominant neuro pattern for this breed category?',
      'Does No/Stop deepen insecurity (substitution path) or is hardship clearly appropriate?',
    ],
    looksLike: [
      'Repetitive soothing that worsens under suppression — licking, pacing, velcro',
      'Handler-sensitive loop — sigh tracks mood, whale eye on loom',
      'Chronic separation distress, fixation, or barrier frustration beyond a single training gap',
    ],
    notThisWhen: [
      'Single displacement lip lick after one correction — read context, not a loop',
      'One session of puppy forgetfulness — skill_gap or age_development',
    ],
    primaryResponse:
      'Open the pattern playbook table and identify the symptom expression variant (self vs handler vs environment). Apply the five substitution principles for that row.',
    guideAnchors: ['rehabilitation-patterns', 'pattern-playbook-table', 'symptom-expression-index'],
    playbookEligible: true,
  },
];

const driverById = new Map(BEHAVIOR_DRIVERS.map((d) => [d.id, d]));

export function getBehaviorDriver(id: BehaviorDriver): BehaviorDriverDef {
  const driver = driverById.get(id);
  if (!driver) throw new Error(`Unknown behavior driver: ${id}`);
  return driver;
}

export function getBehaviorDriversInOrder(): BehaviorDriverDef[] {
  return [...BEHAVIOR_DRIVERS].sort((a, b) => a.order - b.order);
}

export function getDriverGuideRoute(id: BehaviorDriver): string[] {
  return getBehaviorDriver(id).guideAnchors;
}
