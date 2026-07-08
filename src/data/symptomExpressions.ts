import type { NeuroPattern } from './breedTraits';
import type { BehaviorDriver } from './behaviorDrivers';

export type SymptomTarget = 'self' | 'handler' | 'environment' | 'other_dog' | 'general';

export interface SymptomExpression {
  id: string;
  label: string;
  target: SymptomTarget;
  summary: string;
  linkedPatterns: NeuroPattern[];
  confusableDrivers: BehaviorDriver[];
  distinguishFrom: string;
  substitution: string;
  decoupling: string;
  proactiveGuidance: string;
  medicalRuleOut?: string;
  glossaryAnchor?: string;
  guideAnchor: string;
}

export const SYMPTOM_TARGET_LABELS: Record<SymptomTarget, string> = {
  self: 'Self',
  handler: 'Handler',
  environment: 'Environment',
  other_dog: 'Other dog',
  general: 'General',
};

export const SYMPTOM_EXPRESSIONS: SymptomExpression[] = [
  /* ── Repetitive soothing / compulsive ── */
  {
    id: 'compulsive_lick_handler',
    label: 'Compulsive licking of handler',
    target: 'handler',
    summary: 'Repeated licking of handler skin, face, or clothing — often insecurity endorphin release, not defiance.',
    linkedPatterns: ['anxious_attachment', 'handler_sensitive'],
    confusableDrivers: ['entitlement_hardship', 'breed_expression', 'owner_dynamics'],
    distinguishFrom:
      'Pushy mouthing that escalates when challenged is hardship, not substitution. A Retriever holding a toy is breed expression. Licking that tracks handler anxiety is owner dynamics layered on top.',
    substitution:
      'Offer a mouth job — Hold, soft toy to carry — or guide Chin/Nose for calm static contact. Answer what instead of licking skin.',
    decoupling:
      'Never introduce a lickmat or smeared container immediately after a human-licking episode — that rewards the wrong trigger. Dedicated lick outlets only at separate scheduled times when calm.',
    proactiveGuidance:
      'Say Chin or Nose calmly; cup flat hand under jaw for one to two seconds; treat from the other hand. Nominate the preferred behaviour before suppression.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-compulsive-lick-handler',
  },
  {
    id: 'compulsive_lick_self',
    label: 'Compulsive self-licking',
    target: 'self',
    summary: 'Persistent licking of paws, flank, or hot spots — may be neuro loop or medical.',
    linkedPatterns: ['anxious_attachment', 'handler_sensitive', 'frustration_reactive'],
    confusableDrivers: ['breed_expression', 'trauma_security'],
    distinguishFrom:
      'Single paw lick after a walk is normal. Reddened skin, bald patches, or licking that prevents rest needs vet first. Handler-targeted lick uses different decoupling rules.',
    substitution:
      'Scheduled decoupled lick outlet — yoghurt pot, lickmat — when the dog is already calm, not as response to an episode. Pair with genetic outlet (mouth job for retrievers) when anxiety rises.',
    decoupling:
      'Do not redirect self-lick by offering food during the episode if that reinforces the loop — interrupt gently if needed, then offer outlet later at a neutral time.',
    proactiveGuidance:
      'Build Hold or place before anxiety peaks. Short sessions; rebuild from last solid win if overloaded.',
    medicalRuleOut:
      'Rule out allergy, hot spot, joint pain, or GI discomfort before treating as purely behavioural.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-compulsive-lick-self',
  },
  {
    id: 'compulsive_lick_environment',
    label: 'Obsessive surface or object licking',
    target: 'environment',
    summary: 'Fixated licking of floors, furniture, or objects — often scent or fixation, not attachment.',
    linkedPatterns: ['fixation_loop', 'frustration_reactive'],
    confusableDrivers: ['breed_expression'],
    distinguishFrom:
      'Scenthound nose-led investigation is breed expression until it becomes a locked loop the dog cannot break. Attachment licking targets handler skin, not the floor.',
    substitution:
      'Scent puzzle, scatter feed, or structured nose work for hounds. Alternate visual job for fixation-prone herding types.',
    decoupling:
      'Remove access to the rehearsed surface during rehab; offer the substitute outlet before the environment triggers the loop.',
    proactiveGuidance:
      'Disengagement cue before fixation locks — see distraction processing. Butt push or leash accountability if entitlement rehearsal.',
    guideAnchor: 'symptom-compulsive-lick-environment',
  },
  {
    id: 'repetitive_paw_chew',
    label: 'Persistent paw chewing',
    target: 'self',
    summary: 'Chewing paws beyond normal grooming — stress or medical.',
    linkedPatterns: ['anxious_attachment', 'handler_sensitive', 'frustration_reactive'],
    confusableDrivers: ['breed_expression'],
    distinguishFrom: 'Seasonal pollen vs neuro loop — vet if inflamed or sudden onset.',
    substitution: 'Chew toy or mouth job when anxiety rises; scheduled calm enrichment.',
    decoupling: 'Same as self-lick — outlet at neutral times, not immediately after an episode.',
    proactiveGuidance: 'Place or Hold before threshold moments.',
    medicalRuleOut: 'Allergy, foreign body, yeast, or pain — vet check if paws are red or swollen.',
    guideAnchor: 'symptom-repetitive-paw-chew',
  },
  {
    id: 'tail_chase_spin',
    label: 'Tail chasing or spinning',
    target: 'self',
    summary: 'Repetitive spin or tail chase — fixation or under-stimulation.',
    linkedPatterns: ['fixation_loop', 'frenetic_arousal', 'frustration_reactive'],
    confusableDrivers: ['age_development', 'breed_expression'],
    distinguishFrom: 'Puppy play spin is normal; adult locked loop needs outlet and structure.',
    substitution: 'Structured fetch, tug with rules, or scent work — drain the tank with a assigned job.',
    decoupling: 'Interrupt the loop early; do not laugh or chase — that rewards rehearsal.',
    proactiveGuidance: 'Nominate a replacement behaviour before arousal builds — place, Hold, or go-get recall.',
    guideAnchor: 'symptom-tail-chase-spin',
  },

  /* ── Attachment / demand (handler) ── */
  {
    id: 'demand_paw_handler',
    label: 'Demanding paw on handler',
    target: 'handler',
    summary: 'Forceful repeated pawing for attention — demand loop, not affection.',
    linkedPatterns: ['anxious_attachment', 'frenetic_arousal'],
    confusableDrivers: ['entitlement_hardship', 'owner_dynamics'],
    distinguishFrom:
      'Soft anxious paw with whale eye is insecurity — substitution path. Hard pushy paw with stiff body is entitlement — hardship path.',
    substitution: 'Withhold attention until calm; offer Chin or place as the script for contact.',
    decoupling: 'Never treat or praise during the paw — become a rock until four on the floor.',
    proactiveGuidance: 'Guide into Chin or down before the paw lands; reward the nominated behaviour only.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-demand-paw-handler',
  },
  {
    id: 'demand_lean_threshold',
    label: 'Demand lean at thresholds',
    target: 'handler',
    summary: 'Pressure lean at doors or gates — demand for access, distinct from trust lean at rest.',
    linkedPatterns: ['anxious_attachment', 'barrier_frustration'],
    confusableDrivers: ['entitlement_hardship', 'skill_gap'],
    distinguishFrom: 'Trust lean at rest in living mode is different from threshold pressure in training mode — see context of contact.',
    substitution: 'Wait or place at threshold; earned access through calm accountability.',
    decoupling: 'Do not open the door while the dog leans — release only on calm default.',
    proactiveGuidance: 'Front door protocol — nominate sit or wait before handle turns.',
    glossaryAnchor: 'context-of-contact',
    guideAnchor: 'symptom-demand-lean-threshold',
  },
  {
    id: 'velcro_follow_handler',
    label: 'Velcro following indoors',
    target: 'handler',
    summary: 'Cannot break contact with handler when moving room to room — anxious attachment, not separation.',
    linkedPatterns: ['anxious_attachment', 'handler_sensitive'],
    confusableDrivers: ['breed_expression', 'owner_dynamics'],
    distinguishFrom:
      'Clingy breed bonding is context — velcro that panics when blocked needs structure plus substitution, not unlimited lap access.',
    substitution: 'Place or bed at distance; mouth job during transitions; earned access to follow.',
    decoupling: 'Do not reward shadowing with constant talk and touch — neutral movement, reward check-ins.',
    proactiveGuidance: 'Short separations with wins; build independence through access training.',
    guideAnchor: 'symptom-velcro-follow-handler',
  },

  /* ── Displacement / handler-sensitive ── */
  {
    id: 'lip_lick_displacement',
    label: 'Lip licking under stress',
    target: 'general',
    summary: 'Single or brief lip licks — displacement signal, not necessarily a compulsive loop.',
    linkedPatterns: ['handler_sensitive', 'fear_reactive'],
    confusableDrivers: ['age_development', 'neuro_stress_loop'],
    distinguishFrom:
      'One flick after a correction is read context — not the same as repetitive handler licking that worsens under No/Stop.',
    substitution: 'Lower handler energy; create space; small win before re-asking.',
    decoupling: 'Do not scold the lip lick — it is information. Change what happens next.',
    proactiveGuidance: 'Three-second pause; read what happened in the second before.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-lip-lick-displacement',
  },
  {
    id: 'whale_eye_handler',
    label: 'Whale eye when handler looms',
    target: 'handler',
    summary: 'Whites visible, head turned — extreme anxiety, not sass or guilt.',
    linkedPatterns: ['handler_sensitive', 'fear_reactive'],
    confusableDrivers: ['entitlement_hardship', 'social_dominance'],
    distinguishFrom: 'Not dominance — do not confront stare-for-stare. Not guilt — create space.',
    substitution: 'Lower loom; approach from side; Chin or calm contact when dog initiates.',
    decoupling: 'Do not force interaction or scold — confirms unsafe world.',
    proactiveGuidance: 'Ready stance without anxious watching; peripheral awareness.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-whale-eye-handler',
  },
  {
    id: 'submissive_urination_greeting',
    label: 'Submissive urination on greeting',
    target: 'handler',
    summary: 'Deference puddle under pressure — greeting, loom, or sharp voice.',
    linkedPatterns: ['fear_reactive', 'handler_sensitive'],
    confusableDrivers: ['age_development', 'trauma_security'],
    distinguishFrom: 'Young or traumatised dogs — not spite. Lower energy, not firmer correction.',
    substitution: 'Greet low and side-on; no overhead reach; small wins rebuilding confidence.',
    decoupling: 'Do not react dramatically to the puddle — neutral cleanup, lower threshold next time.',
    proactiveGuidance: 'Outdoor greeting first; build trust before indoor excitement.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-submissive-urination-greeting',
  },

  /* ── Touch saturation / learned helplessness ── */
  {
    id: 'shutdown_tolerate_touch',
    label: 'Freeze-and-tolerate under handling',
    target: 'handler',
    summary:
      'Goes still and endures petting or handling like a stuffed animal — learned helplessness from ignored boundaries, not calm enjoyment.',
    linkedPatterns: ['handler_sensitive', 'fear_reactive'],
    confusableDrivers: ['owner_dynamics', 'trauma_security'],
    distinguishFrom:
      'A genuinely relaxed dog is loose and soft and re-initiates contact. Still-but-stiff, tense, or lip-licking while tolerating is shutdown — cortisol high, signals given up. Not stubbornness.',
    substitution:
      'Run the consent test — one to two hands for five seconds, then stop and read re-initiation. Reduce handling volume; let the dog opt in.',
    decoupling:
      'Do not reward tolerating by continuing or escalating touch. Never smother a dog that has gone still — stillness is not consent.',
    proactiveGuidance:
      'Three-second pause before touch; reach for chest not skull; stop the moment the body stiffens or the head turns away.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-shutdown-tolerate-touch',
  },
  {
    id: 'strategic_avoidance_person',
    label: 'Strategic avoidance of a person',
    target: 'handler',
    summary:
      'Quietly leaves the room or hides when a specific person approaches — pre-empting unwanted handling after touch saturation.',
    linkedPatterns: ['fear_reactive', 'hyper_vigilant'],
    confusableDrivers: ['owner_dynamics', 'trauma_security'],
    distinguishFrom:
      'Not aloofness or independence — the avoidance is person-specific and follows a history of overridden boundaries. Bond erodes with the people avoided.',
    substitution:
      'Let the dog opt out; make that person a source of calm space and choice, not pursuit. Rebuild with earned, consent-led contact.',
    decoupling:
      'Do not chase, corner, or lure the dog out to be petted — that confirms the person cannot be escaped.',
    proactiveGuidance:
      'Reduce handling volume from the avoided person; three-second pause; reward voluntary approach only.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-strategic-avoidance',
  },
  {
    id: 'guard_safe_space',
    label: 'Guarding a safe space or person',
    target: 'environment',
    summary:
      'Stiffens or growls when approached on a crate, bed, or lap — defending the last boundary after feeling touch-vulnerable everywhere else.',
    linkedPatterns: ['fear_reactive', 'territorial_vigilance'],
    confusableDrivers: ['entitlement_hardship', 'trauma_security'],
    distinguishFrom:
      'Insecurity-driven safe-space guarding (soft, defensive, follows touch saturation) differs from entitled resource claiming (stiff, forward, privileged history). Read the history and body.',
    substitution:
      'Restore whole-house consent so the dog does not need one anchor. Teach off/place with earned access; never reach into the safe space to force contact.',
    decoupling:
      'Do not punish the growl — it is the warning you want kept. Do not corner the dog on its bed or lap.',
    proactiveGuidance:
      'Approach low and side-on; invite off the space rather than reaching in; reduce the touch pressure that drove the anchoring.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-guard-safe-space',
  },

  /* ── Arousal / movement ── */
  {
    id: 'pacing_perimeter',
    label: 'Pacing boundaries',
    target: 'environment',
    summary: 'Repeated patrol of fence line or room perimeter — vigilance or frustration.',
    linkedPatterns: ['hyper_vigilant', 'territorial_vigilance', 'frustration_reactive'],
    confusableDrivers: ['breed_expression'],
    distinguishFrom: 'Guard breed patrol is context — locked pacing without settle needs job and structure.',
    substitution: 'Assigned place or job; drain tank with legitimate work before denial.',
    decoupling: 'Block rehearsable patrol routes during rehab if needed; reward settle at place.',
    proactiveGuidance: 'Nominate place before arousal builds at the boundary.',
    guideAnchor: 'symptom-pacing-perimeter',
  },
  {
    id: 'helicopter_greeting',
    label: 'Frantic greeting arousal',
    target: 'handler',
    summary: 'Helicopter tail, jumping, spinning at arrivals — matches handler energy often.',
    linkedPatterns: ['frenetic_arousal', 'anxious_attachment'],
    confusableDrivers: ['owner_dynamics', 'entitlement_hardship', 'age_development'],
    distinguishFrom:
      'Fix owner matching arousal first. Adolescent testing vs entitled adult — age and hardship calibration.',
    substitution: 'Neutral home return — wait for four on floor before engagement.',
    decoupling: 'Do not praise the moment of highest arousal — see correction-praise trap.',
    proactiveGuidance: 'Front door and home return protocol; collar snatch if jumping persists after calm handler.',
    glossaryAnchor: 'home-return',
    guideAnchor: 'symptom-helicopter-greeting',
  },
  {
    id: 'nudge_mouth_bump',
    label: 'Repeated nudging or mouthing for contact',
    target: 'handler',
    summary: 'Nose bumps, mouthing hands — demand or anxious contact-seeking.',
    linkedPatterns: ['frenetic_arousal', 'anxious_attachment'],
    confusableDrivers: ['entitlement_hardship', 'age_development'],
    distinguishFrom: 'Puppy exploration fades with structure. Adult persistent mouthing — standard slipped or insecurity loop.',
    substitution: 'Hold or toy in mouth for retrievers; Chin for calm contact script.',
    decoupling: 'Withhold engagement during nudge — reward nominated behaviour only.',
    proactiveGuidance: 'Guide Chin before the mouth finds skin.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-nudge-mouth-bump',
  },

  /* ── Fixation / barrier ── */
  {
    id: 'stare_lock_trigger',
    label: 'Locked stare at trigger',
    target: 'environment',
    summary: 'Sustained stare before lunge — fixation precursor.',
    linkedPatterns: ['fixation_loop', 'barrier_frustration', 'fear_reactive'],
    confusableDrivers: ['breed_expression'],
    distinguishFrom: 'Brief look with loose body is distraction processing — not fixation.',
    substitution: 'Disengagement before lock; alternate job by instinct — fetch or scent.',
    decoupling: 'Increase distance before trigger stacks; do not reward stare with forward movement.',
    proactiveGuidance: 'Butt push or leash jerk inside one-second window when body stiffens.',
    glossaryAnchor: 'symptom-glossary',
    guideAnchor: 'symptom-stare-lock-trigger',
  },
  {
    id: 'barrier_lunge',
    label: 'Leash or fence lunge',
    target: 'environment',
    summary: 'Explosive lunge when access blocked — barrier frustration primary.',
    linkedPatterns: ['barrier_frustration', 'fixation_loop', 'fear_reactive'],
    confusableDrivers: ['skill_gap', 'entitlement_hardship'],
    distinguishFrom: 'Fear reactive needs distance; frustration entitlement needs leash accountability — hardship component.',
    substitution: 'Distance for fear; leash accountability and collar choice for frustration — not treat-only.',
    decoupling: 'Do not rehearse lunging at the same fence line daily without structure.',
    proactiveGuidance: 'Leash handling, butt push, meetings on leash until social maturity.',
    glossaryAnchor: 'leash',
    guideAnchor: 'symptom-barrier-lunge',
  },
  {
    id: 'vocal_demand_alone',
    label: 'Distress vocalising when left alone',
    target: 'general',
    summary: 'Whining, howling, barking when handler departs — separation stress, not velcro in room.',
    linkedPatterns: ['separation'],
    confusableDrivers: ['owner_dynamics', 'skill_gap'],
    distinguishFrom: 'Velcro when handler present is anxious_attachment — different pattern row.',
    substitution: 'Calm departure ritual; earned independence; safe den — not flooding.',
    decoupling: 'Do not return and soothe mid-panic — teaches panic gets reunion.',
    proactiveGuidance: 'Short departures with wins; build duration gradually.',
    guideAnchor: 'symptom-vocal-demand-alone',
  },

  /* ── Destructive / frustration ── */
  {
    id: 'destructive_outburst',
    label: 'Destruction when outlet denied',
    target: 'environment',
    summary: 'Chewing, digging, shredding when bored or blocked — frustration reactive.',
    linkedPatterns: ['frustration_reactive', 'separation'],
    confusableDrivers: ['age_development', 'skill_gap'],
    distinguishFrom: 'Puppy teething vs adult outburst when denied walk or attention.',
    substitution: 'Legitimate job before denial — walk, scent, dig box for terriers.',
    decoupling: 'Nothing for free — access earned after calm.',
    proactiveGuidance: 'Drain tank first; then deny without surprise.',
    glossaryAnchor: 'access',
    guideAnchor: 'symptom-destructive-outburst',
  },
  {
    id: 'digging_compulsive',
    label: 'Compulsive digging',
    target: 'environment',
    summary: 'Digging beyond breed outlet — frustration or terrier drive without structure.',
    linkedPatterns: ['frustration_reactive', 'fixation_loop'],
    confusableDrivers: ['breed_expression'],
    distinguishFrom: 'Terrier dig is breed — assign dig box; compulsive garden destruction needs structure.',
    substitution: 'Designated dig pit or hunt box; structured search games.',
    decoupling: 'Block rehearsable garden patches; redirect to assigned zone before denial.',
    proactiveGuidance: 'Nominate dig zone; reward use of assigned outlet.',
    guideAnchor: 'symptom-digging-compulsive',
  },
];

const symptomById = new Map(SYMPTOM_EXPRESSIONS.map((s) => [s.id, s]));

export function getSymptomExpression(id: string): SymptomExpression | undefined {
  return symptomById.get(id);
}

export function getSymptomsForPattern(pattern: NeuroPattern): SymptomExpression[] {
  return SYMPTOM_EXPRESSIONS.filter((s) => s.linkedPatterns.includes(pattern));
}

export function getSymptomsByTarget(target: SymptomTarget): SymptomExpression[] {
  return SYMPTOM_EXPRESSIONS.filter((s) => s.target === target);
}

export function getSymptomExpressionsByIds(ids: string[]): SymptomExpression[] {
  return ids.map((id) => symptomById.get(id)).filter((s): s is SymptomExpression => s != null);
}
