import type { BreedCategory } from './breeds';
import { CATEGORY_NEURO_BLEND, type NeuroPattern } from './breedTraits';
import type { InstinctSubtype } from './dogIntelligence';
import type { BehaviorDriver } from './behaviorDrivers';

export type RehabilitationPath = 'substitution' | 'hardship' | 'mixed' | 'security_first';

export interface RehabilitationPlaybook {
  patternKey: NeuroPattern;
  label: string;
  path: RehabilitationPath;
  rootCause: string;
  typicalExpressions: string[];
  predisposedCategories: BreedCategory[];
  instinctLeverage: InstinctSubtype[];
  substitution: string;
  decoupling: string;
  proactiveGuidance: string;
  avoidWhen: string;
  confusableDrivers: BehaviorDriver[];
  distinguishFrom: string;
  symptomExpressionIds: string[];
  primaryGuideAnchor: string;
  relatedGuideAnchors: string[];
}

const NEURO_BLEND_THRESHOLD = 0.25;

export function getPredisposedCategories(patternKey: NeuroPattern): BreedCategory[] {
  const categories: BreedCategory[] = [];
  for (const [category, blend] of Object.entries(CATEGORY_NEURO_BLEND) as [
    BreedCategory,
    Partial<Record<NeuroPattern, number>>,
  ][]) {
    const weight = blend[patternKey] ?? 0;
    if (weight >= NEURO_BLEND_THRESHOLD) categories.push(category);
  }
  return categories;
}

export const REHABILITATION_PATH_LABELS: Record<RehabilitationPath, string> = {
  substitution: 'Substitution',
  hardship: 'Hardship',
  mixed: 'Mixed',
  security_first: 'Security-first',
};

export const REHABILITATION_PLAYBOOKS: RehabilitationPlaybook[] = [
  {
    patternKey: 'handler_sensitive',
    label: 'Handler-sensitive',
    path: 'substitution',
    rootCause:
      'Nervous system reads handler mood and tension as primary safety signal — sigh, whale eye, and shutdown track your state.',
    typicalExpressions: [
      'Sigh tracks handler mood',
      'Whale eye when handler looms',
      'Forgetting commands when handler is frustrated',
    ],
    predisposedCategories: getPredisposedCategories('handler_sensitive'),
    instinctLeverage: ['companion', 'herding_eye'],
    substitution:
      'Neutral baseline — calm certainty without yo-yo praise. Anchor energy: your state is the floor, not the ceiling.',
    decoupling:
      'Do not tie access and affection to handler emotional spikes. Separate training corrections from living-mode warmth.',
    proactiveGuidance:
      'Ready stance without anxious watching; three-second pause before re-asking; peripheral awareness.',
    avoidWhen:
      'Shocking correction while handler is venting; dramatic praise after correction — deepens handler-dog feedback loop.',
    confusableDrivers: ['owner_dynamics', 'trauma_security'],
    distinguishFrom:
      'Fix owner yo-yo first. True trauma shutdown needs security-first — handler-sensitive may layer on top once baseline is calm.',
    symptomExpressionIds: [
      'whale_eye_handler',
      'lip_lick_displacement',
      'compulsive_lick_handler',
      'submissive_urination_greeting',
    ],
    primaryGuideAnchor: 'pattern-playbook-handler-sensitive',
    relatedGuideAnchors: ['three-second-pause', 'pack-leader-energy', 'correction-praise-trap'],
  },
  {
    patternKey: 'anxious_attachment',
    label: 'Anxious attachment',
    path: 'substitution',
    rootCause:
      'Velcro bonding and misdirected devotion — endorphin release through contact, not separation when alone necessarily.',
    typicalExpressions: [
      'Demanding paw',
      'Compulsive handler licking',
      'Velcro following',
      'Demand lean at thresholds',
    ],
    predisposedCategories: getPredisposedCategories('anxious_attachment'),
    instinctLeverage: ['retrieve', 'companion'],
    substitution:
      'Mouth job for retrievers — Hold, soft toy. Chin/Nose for calm static contact. Earned access instead of unlimited proximity.',
    decoupling:
      'Never reward demand behaviours with contact. Dedicated soothing outlets at neutral times — not after human-lick episodes.',
    proactiveGuidance:
      'Nominate Chin or Nose — say cue, cup hand under jaw, treat from other hand. Guide before suppress.',
    avoidWhen:
      'Repeated No/Stop on insecure licking — deepens loop. Pushy mouthing that escalates — entitlement_hardship path.',
    confusableDrivers: ['entitlement_hardship', 'breed_expression', 'owner_dynamics'],
    distinguishFrom:
      'Retriever carry instinct alone is breed_expression. Pushy paw with stiff body is hardship. Handler-matched arousal is owner_dynamics first.',
    symptomExpressionIds: [
      'compulsive_lick_handler',
      'compulsive_lick_self',
      'demand_paw_handler',
      'demand_lean_threshold',
      'velcro_follow_handler',
      'nudge_mouth_bump',
      'helicopter_greeting',
    ],
    primaryGuideAnchor: 'pattern-playbook-anxious-attachment',
    relatedGuideAnchors: ['context-of-contact', 'access', 'trust-not-just-love'],
  },
  {
    patternKey: 'separation',
    label: 'Separation stress',
    path: 'security_first',
    rootCause:
      'Distress when left alone — pack structure unclear; panic rehearsed on departure, distinct from handler-present velcro.',
    typicalExpressions: ['Distress vocalising when left alone', 'Destruction during alone time'],
    predisposedCategories: getPredisposedCategories('separation'),
    instinctLeverage: ['companion', 'guard'],
    substitution:
      'Calm departure ritual; safe den; graduated alone duration — structure without flooding.',
    decoupling:
      'Do not return mid-panic to soothe. Do not make every reunion a frantic party — see home return.',
    proactiveGuidance:
      'Short successful departures; build duration; earned independence through access training.',
    avoidWhen:
      'Flooding — long absences before wins. Conflating with velcro when handler is present — different symptom row.',
    confusableDrivers: ['skill_gap', 'owner_dynamics'],
    distinguishFrom:
      'Velcro indoors is anxious_attachment. Separation is alone-time panic. Eight-week puppy separation is hardship, not trauma damage.',
    symptomExpressionIds: ['vocal_demand_alone', 'destructive_outburst'],
    primaryGuideAnchor: 'pattern-playbook-separation',
    relatedGuideAnchors: ['access', 'eight-week-separation', 'home-return'],
  },
  {
    patternKey: 'hyper_vigilant',
    label: 'Hyper-vigilant',
    path: 'mixed',
    rootCause:
      'Persistent threat scanning — difficulty switching off; world feels unsafe or understimulated without a job.',
    typicalExpressions: ['Persistent scanning', 'Pacing perimeter', 'Difficulty settling'],
    predisposedCategories: getPredisposedCategories('hyper_vigilant'),
    instinctLeverage: ['guard', 'herding_eye'],
    substitution:
      'Assigned job — place, carry object, watch cue — gives the scanning a legitimate channel.',
    decoupling:
      'Reduce rehearsable trigger stacking; reward settle at place, not alert at window.',
    proactiveGuidance:
      'Nominate place before arousal builds; calm handler certainty; controlled trigger exposure with exits.',
    avoidWhen:
      'Flooding at window or fence; anxious handler hyper-watching — amplifies vigilance.',
    confusableDrivers: ['breed_expression', 'social_dominance'],
    distinguishFrom:
      'Guard breed patrol is breed_expression until locked loop without settle. Territorial vigilance overlaps — read home context.',
    symptomExpressionIds: ['pacing_perimeter'],
    primaryGuideAnchor: 'pattern-playbook-hyper-vigilant',
    relatedGuideAnchors: ['expectations', 'front-door', 'pack-guarding'],
  },
  {
    patternKey: 'fixation_loop',
    label: 'Fixation loop',
    path: 'mixed',
    rootCause:
      'Motion, stare, or scent lock — cannot break focus; precursor to lunge or yap-in-place.',
    typicalExpressions: ['Stiffening before lunge', 'Locked stare', 'Tail chase spin'],
    predisposedCategories: getPredisposedCategories('fixation_loop'),
    instinctLeverage: ['herding_eye', 'chase', 'scent'],
    substitution:
      'Alternate outlet by instinct — fetch for retrieve/chase types, scent puzzle for hounds — before lock.',
    decoupling:
      'Increase distance before trigger stacks. Do not forward-move while dog is locked on trigger.',
    proactiveGuidance:
      'Disengagement inside distraction processing window; butt push when body stiffens and entitlement rehearsal.',
    avoidWhen:
      'Treat-chasing while locked — rewards fixation. Ignoring true scent biology in hounds — breed outlet first.',
    confusableDrivers: ['breed_expression', 'entitlement_hardship'],
    distinguishFrom:
      'Brief look with loose body is not fixation. Scent trailing is breed_expression until recall fails from lock, not defiance.',
    symptomExpressionIds: [
      'stare_lock_trigger',
      'compulsive_lick_environment',
      'tail_chase_spin',
    ],
    primaryGuideAnchor: 'pattern-playbook-fixation-loop',
    relatedGuideAnchors: ['distraction-processing', 'butt-push', 'dog-ready-stance'],
  },
  {
    patternKey: 'frenetic_arousal',
    label: 'Frenetic arousal',
    path: 'mixed',
    rootCause:
      'Cannot settle — matches excited handler energy; demanding contact and helicopter greetings.',
    typicalExpressions: ['Demanding paw and nudging', 'Helicopter tail at greetings'],
    predisposedCategories: getPredisposedCategories('frenetic_arousal'),
    instinctLeverage: ['companion', 'retrieve'],
    substitution:
      'Anchor energy — neutral home return, wait for calm before engagement. Place as default.',
    decoupling:
      'Correction-praise trap — never praise peak arousal moment. Withhold engagement until four on floor.',
    proactiveGuidance:
      'Front door protocol; home return neutral; nominate sit or place before handle turns.',
    avoidWhen:
      'Matching excitement at door. Soft handling for entitled greeting chaos — hardship component may apply.',
    confusableDrivers: ['owner_dynamics', 'entitlement_hardship', 'age_development'],
    distinguishFrom:
      'Fix handler arousal first. Adolescent greeting spike vs entitled adult — age and hardship calibration.',
    symptomExpressionIds: ['helicopter_greeting', 'demand_paw_handler', 'nudge_mouth_bump'],
    primaryGuideAnchor: 'pattern-playbook-frenetic-arousal',
    relatedGuideAnchors: ['home-return', 'front-door', 'correction-praise-trap'],
  },
  {
    patternKey: 'frustration_reactive',
    label: 'Frustration reactive',
    path: 'mixed',
    rootCause:
      'Under-stimulated or denied outlet — destruction, digging, outbursts when access blocked.',
    typicalExpressions: ['Destructive outbursts', 'Compulsive digging', 'Self-lick when bored'],
    predisposedCategories: getPredisposedCategories('frustration_reactive'),
    instinctLeverage: ['hunt_dig', 'retrieve', 'scent'],
    substitution:
      'Legitimate job before denial — walk, dig box, scent work. Drain the tank, then deny without surprise.',
    decoupling:
      'Nothing for free — earned access. Do not deny outlet without offering assigned alternative first.',
    proactiveGuidance:
      'Nominate structured task before frustration peaks; access training arc.',
    avoidWhen:
      'Pure substitution without structure for entitled destroyer — hardship may be required.',
    confusableDrivers: ['skill_gap', 'age_development'],
    distinguishFrom:
      'Puppy chewing vs adult outburst when walk denied. Terrier dig is breed outlet — assign zone before calling pathology.',
    symptomExpressionIds: [
      'destructive_outburst',
      'digging_compulsive',
      'compulsive_lick_self',
      'repetitive_paw_chew',
    ],
    primaryGuideAnchor: 'pattern-playbook-frustration-reactive',
    relatedGuideAnchors: ['access', 'pillars'],
  },
  {
    patternKey: 'barrier_frustration',
    label: 'Barrier frustration',
    path: 'hardship',
    rootCause:
      'Restraint stress on leash, fence, or threshold — lunging when access blocked; frustration entitlement common.',
    typicalExpressions: ['Leash or fence lunge', 'Vocalising at barrier'],
    predisposedCategories: getPredisposedCategories('barrier_frustration'),
    instinctLeverage: ['chase', 'guard'],
    substitution:
      'Distance for fear component; leash accountability and collar choice for frustration — substitution alone fails.',
    decoupling:
      'Do not rehearse daily lunging at same fence line without structure. Sniff breaks as earned, not random.',
    proactiveGuidance:
      'Leash handling, butt push, downward jerk inside window; meetings on leash until social maturity.',
    avoidWhen:
      'Treat-only rehab for confident lunging adolescent. Flooding close to trigger without exits.',
    confusableDrivers: ['skill_gap', 'trauma_security'],
    distinguishFrom:
      'Fear reactive needs distance and security-first. Frustration entitlement needs accountability — see leash.',
    symptomExpressionIds: ['barrier_lunge', 'stare_lock_trigger', 'demand_lean_threshold'],
    primaryGuideAnchor: 'pattern-playbook-barrier-frustration',
    relatedGuideAnchors: ['leash', 'butt-push', 'dog-meetings-leash'],
  },
  {
    patternKey: 'territorial_vigilance',
    label: 'Territorial vigilance',
    path: 'mixed',
    rootCause:
      'Home and perimeter patrol arousal — pack guarding during handler vulnerability; bred-in guard assessment.',
    typicalExpressions: ['Pack guarding bathroom follow', 'Perimeter patrol', 'Barking at boundary'],
    predisposedCategories: getPredisposedCategories('territorial_vigilance'),
    instinctLeverage: ['guard'],
    substitution:
      'Understand pack guarding instinct first — then access training and thresholds. Assigned boundary role with clear release.',
    decoupling:
      'Understanding does not mean unlimited permission — training mode thresholds still apply.',
    proactiveGuidance:
      'Front door protocol; off-lead intervention when patrol becomes rehearsal.',
    avoidWhen:
      'Pity without structure. Misreading as separation anxiety when it is perimeter vigilance.',
    confusableDrivers: ['breed_expression', 'entitlement_hardship'],
    distinguishFrom:
      'Bathroom follow facing away is pack guarding — see pack-guarding. Not the same as velcro demand lean.',
    symptomExpressionIds: ['pacing_perimeter'],
    primaryGuideAnchor: 'pattern-playbook-territorial-vigilance',
    relatedGuideAnchors: ['pack-guarding', 'front-door', 'access'],
  },
  {
    patternKey: 'noise_reactive',
    label: 'Noise reactive',
    path: 'security_first',
    rootCause:
      'Startle and stress sensitivity to sounds — environmental noise overload.',
    typicalExpressions: ['Startle to sudden sounds', 'Pacing during storms or fireworks'],
    predisposedCategories: getPredisposedCategories('noise_reactive'),
    instinctLeverage: ['companion', 'sled_endurance'],
    substitution:
      'Safe den; masking during storms; controlled exposure at sub-threshold volume with exits.',
    decoupling:
      'Do not flood at full noise intensity. Do not soothe mid-panic in a way that confirms danger.',
    proactiveGuidance:
      'Place during noise; build tolerance in small steps; calm handler presence.',
    avoidWhen:
      'Forcing exposure at full volume. Shocking correction on startle response.',
    confusableDrivers: ['trauma_security'],
    distinguishFrom:
      'Acoustic overload puppyhood trauma — true-canine-trauma frame. Single startle vs chronic loop.',
    symptomExpressionIds: [],
    primaryGuideAnchor: 'pattern-playbook-noise-reactive',
    relatedGuideAnchors: ['true-canine-trauma', 'trauma-signals', 'expectations'],
  },
  {
    patternKey: 'fear_reactive',
    label: 'Fear reactive',
    path: 'security_first',
    rootCause:
      'Caution, withdrawal, defensive patterns — whale eye, stiff freeze, weight back; world read as unsafe.',
    typicalExpressions: ['Whale eye', 'Tail tucked', 'Defensive snap under spatial pressure'],
    predisposedCategories: getPredisposedCategories('fear_reactive'),
    instinctLeverage: ['companion', 'chase'],
    substitution:
      'Small wins at distance; confidence through structure without flooding; target or nose touch at sub-threshold.',
    decoupling:
      'Never scold appeasement signals. Create space — do not force interaction.',
    proactiveGuidance:
      'Controlled trigger exposure with exits; lower handler loom; rebuild trust through earned wins.',
    avoidWhen:
      'Shocking correction on trauma signals. Dominance confrontation stare-for-stare.',
    confusableDrivers: ['trauma_security', 'social_dominance'],
    distinguishFrom:
      'Defensive snap to escape pressure is fear — not social dominance T-bone. Trauma history confirms security-first.',
    symptomExpressionIds: [
      'whale_eye_handler',
      'submissive_urination_greeting',
      'stare_lock_trigger',
      'barrier_lunge',
    ],
    primaryGuideAnchor: 'pattern-playbook-fear-reactive',
    relatedGuideAnchors: ['when-not-firmer', 'three-second-pause', 'symptom-glossary'],
  },
];

const playbookByKey = new Map(REHABILITATION_PLAYBOOKS.map((p) => [p.patternKey, p]));

export function getRehabilitationPlaybook(key: NeuroPattern): RehabilitationPlaybook {
  const playbook = playbookByKey.get(key);
  if (!playbook) throw new Error(`Unknown neuro pattern playbook: ${key}`);
  return playbook;
}

export function getPlaybooksForCategory(category: BreedCategory): RehabilitationPlaybook[] {
  return REHABILITATION_PLAYBOOKS.filter((p) => p.predisposedCategories.includes(category));
}

export function getAllRehabilitationPlaybooks(): RehabilitationPlaybook[] {
  return REHABILITATION_PLAYBOOKS;
}
