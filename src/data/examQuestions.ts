/* ============================================================
   Gold Standard Dog Training — exam question bank
   Derived from the Client Reference Guide. Edit freely — plain data.

   The FIRST option of every question is the correct one; the exam
   engine shuffles option order at play time.
   ============================================================ */

import type { BreedCategory } from './breeds';

export type QuestionCategory = BreedCategory | 'all';
export type Track = 'both' | 'trainer';

export interface Question {
  /** Display group used in the results breakdown. */
  topic: string;
  breedCategory: QuestionCategory;
  /** 'both' = owner + trainer exams; 'trainer' = trainer exam only. */
  track: Track;
  text: string;
  options: string[];
  /** Shown in the learning popup and the results review. */
  explanation: string;
  /** Anchor into the guide page, e.g. '#timing'. */
  guideLink: string;
}

export const examQuestions: Question[] = [

  /* ── Foundations ── */
  {
    topic: 'Foundations',
    breedCategory: 'all',
    track: 'both',
    text: 'The "Preparation" pillar says you should exercise your dog before a training session. Why?',
    options: [
      'Training is a mental workout — a tired body leads to a focused mind',
      'A tired dog is too exhausted to misbehave, so corrections are not needed',
      'Exercise is the reward the dog earns in advance for the session ahead',
      'It builds the muscle the dog needs to hold long sits and waits',
    ],
    explanation: 'Drain the tank first: training is a mental workout, not a physical one. A good sniff-walk or game of fetch before a session leads to a focused mind.',
    guideLink: '#pillars'
  },
  {
    topic: 'Foundations',
    breedCategory: 'all',
    track: 'both',
    text: 'What is the core of the Gold Standard Rule?',
    options: [
      'The dog does not decide what happens — permission, pace, and release flow from you',
      'The dog should be rewarded with a treat for every correct behaviour',
      'The dog must be corrected firmly for every mistake, without exception',
      'The dog should be free to make its own choices once basic obedience is solid',
    ],
    explanation: 'At its core this is a standard of authority in the relationship: the dog does not decide what is going to happen — you do.',
    guideLink: '#pillars'
  },
  {
    topic: 'Foundations',
    breedCategory: 'all',
    track: 'both',
    text: 'You put the food bowl down, or open the door. According to the guide, what does that moment mean to the dog?',
    options: [
      'Still not consent — the dog holds until you explicitly release them',
      'Automatic permission — the reward being offered is the release',
      'A test of patience that should last at least one minute',
      'The end of the training moment; what happens next is up to the dog',
    ],
    explanation: 'When the reward is offered — bowl down, door open, leash off — that is still not consent. The behaviour earns access; your word grants it.',
    guideLink: '#pillars'
  },
  {
    topic: 'Foundations',
    breedCategory: 'all',
    track: 'both',
    text: 'The "Real-World Wins" pillar asks you to transition from treats toward what?',
    options: [
      'Life rewards — walks, doors, play, and access to the environment',
      'Larger and higher-value treats as behaviours get harder',
      'Verbal praise delivered in an excited, high-energy tone',
      'Removing all rewards so the dog obeys out of habit alone',
    ],
    explanation: 'Transition from treats to Life Rewards (walks, doors, play) — the environment becomes the motivator.',
    guideLink: '#pillars'
  },

  /* ── Owner mindset ── */
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'When you walk braced for a reaction — watching your dog anxiously — what does the dog read?',
    options: [
      'Insecurity in its leader, which it feels compelled to compensate for',
      'That you are paying it the attention it deserves — not the guide',
      'A clear signal that you are in charge and alert — not the guide',
      'Nothing — dogs cannot perceive human emotional states',
    ],
    explanation: 'If your attention is anxious, the dog reads it as insecurity. An insecure leader is one the dog feels compelled to protect — that is where fixation, barking, and reactivity come from.',
    guideLink: '#owner-mindset'
  },
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog is mid-reaction — barking at a trigger. What should you NOT do?',
    options: [
      'Shush, reassure, or say "it\'s okay" — that attention rewards the excited state',
      'Move calmly to the dog\'s side within reach — not the guide\'s frame for this',
      'Apply a correction inside the one-second window — misses context and timing',
      'Return to a calm, forward-facing posture after correcting — not the guide',
    ],
    explanation: 'Reassurance during a reaction counts as attention, which is a reward. Correct and move on, as if it barely warranted your notice.',
    guideLink: '#owner-mindset'
  },
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog bolts and ignores the recall. What is the correct pursuit?',
    options: [
      'Joyless and relentless, at a casual pace — no drama the dog can feed on',
      'A fast, excited chase so you catch the dog as quickly as possible',
      'Stop and walk the other way so the dog panics and follows',
      'Wait where you are and keep calling in an increasingly firm voice',
    ],
    explanation: 'Chasing with tension or excitement teaches the dog that bolting gets a fun pursuit. Pursue joylessly and relentlessly — quiet certainty that running away cannot win.',
    guideLink: '#expectations'
  },
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'In the go-get recall method, when the dog comes back to you, how do you reward?',
    options: [
      'With the treat at your feet — not excited cuddling that re-elevates energy',
      'With enthusiastic petting and a high, happy voice — not the guide',
      'By immediately throwing another treat further away — not the guide',
      'By unclipping the leash as the recall reward — misses context and timing',
    ],
    explanation: 'Reward with the treat at your feet — affection can follow once the dog is calm at your side. Excited cuddling re-elevates the energy you just called them out of. The go-get treat must be the reserved training currency — a favourite the dog gets in sessions and nowhere else — not an overused everyday snack.',
    guideLink: '#go-get-recall'
  },
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'What attitude does the "I\'m over it" rule describe?',
    options: [
      'Calm certainty that misbehaviour does not move you, entertain you, or win',
      'Giving up on a behaviour that the dog refuses to learn — not the guide',
      'Cold withdrawal of affection until the dog improves — not the guide',
      'Performed anger that shows the dog you are serious — not the guide',
    ],
    explanation: 'Not cold cruelty, not performed anger — the calm certainty that this behaviour cannot win. Correct inside the one-second window, then move on.',
    guideLink: '#im-over-it'
  },
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'Why does the guide recommend speaking the principle aloud ("I expect you to wait at this door")?',
    options: [
      'Voicing it affirms your own state — the dog responds to that energy, not the words',
      'Dogs understand full sentences when they are repeated often enough',
      'It warns nearby people that the dog is in training — a common handler misread here',
      'The volume of your voice startles the dog into compliance — not the guide',
    ],
    explanation: 'The dog does not need your reasoning — they read your body. Saying the principle aloud locks it into your body, and that changed energy is what the dog responds to.',
    guideLink: '#speaking-aloud'
  },
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'What is the ready stance?',
    options: [
      'A pre-engaged, athletic body — core alive, knees soft, attention forward — able to act instantly',
      'Standing rigid with a tight grip on the leash at all times — not the guide\'s frame for this',
      'Crouching at the dog\'s level so you can grab the collar faster — not the guide\'s frame for this',
      'A relaxed stroll where you deliberately ignore the dog — not the guide\'s frame for this',
    ],
    explanation: 'Like a martial arts ready stance: not tension, but readiness. A soft, slumped handler cannot reach the one-second window.',
    guideLink: '#ready-stance'
  },
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'During new exposures and greetings, why should you not let your dog lean against you for support?',
    options: [
      'Leaning is dependency — the dog must learn to stand on its own feet and self-regulate',
      'The dog\'s weight could pull you off balance during a correction — not the guide',
      'It transfers your scent and confuses the other dog — not the guide\'s frame for this',
      'Leaning is always the first stage of a guarding behaviour — misses context and timing',
    ],
    explanation: 'Leaning is dependency, not calm. You lead; they manage their body without using you as a crutch.',
    guideLink: '#social-regulation'
  },
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'How does the guide describe difficult situations like a busy market or another dog approaching?',
    options: [
      'Opportunities — controlled exposure to real triggers is the training environment',
      'Failures of planning that a good owner avoids entirely — not the guide standard',
      'Situations where training rules are temporarily suspended — not the guide',
      'Tests that the dog should only face after a year of training — not the guide',
    ],
    explanation: 'Triggers are opportunities, not failures. The goal is not a dog that behaves only in quiet conditions — it is a dog that can be trusted anywhere.',
    guideLink: '#expectations'
  },

  /* ── Reading signals ── */
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'During training your dog starts panting more, forgetting commands, and looking "worse". What is this most likely?',
    options: [
      'The visible edge of learning — change costs mental energy',
      'Proof the method is wrong for this dog — not the guide',
      'Deliberate defiance that needs a firmer correction',
      'A medical problem that needs a vet visit first',
    ],
    explanation: 'A dog under load may look worse before it looks better. That is not failure — it is often the visible edge of learning.',
    guideLink: '#reading-dog'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog is panting with no heat and no exertion. What does this usually indicate?',
    options: [
      'Stress arousal — the body cooling an activated mind',
      'Thirst — offer water and continue — not the guide',
      'Contentment and relaxation — not the guide',
      'The early stage of kennel cough — not the guide',
    ],
    explanation: 'When there is no heat or exertion, panting is usually stress arousal. Adolescents pant easily under social pressure.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'Persistent mouthing in an adult dog usually means what?',
    options: [
      'The standard has slipped — often demand for attention, overstimulation, or anxiety',
      'The dog is teething and needs chew toys — not the guide\'s frame for this',
      'Affection — adult mouthing is a compliment — not the guide\'s frame for this',
      'A prey-drive behaviour that cannot be trained out — not the guide\'s frame for this',
    ],
    explanation: 'Puppy mouthing fades with structure; persistent mouthing in an adult usually means the standard has slipped — see the collar grab.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'Mid-session, your dog suddenly "forgets" commands it knows well. The right response is to:',
    options: [
      'Recognise cognitive overload — shorten the ask, reduce distractions, rebuild from the last solid win',
      'Treat it as defiance and escalate the correction — not the guide\'s frame for this',
      'End all training for at least a week — without reading stress, rank-testing, or denied outlets first',
      'Repeat the command louder until it lands — as entitlement rather than earned access on your terms',
    ],
    explanation: 'The brain drops rehearsed behaviour under pressure — not necessarily defiance. Normal in intensive phases.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'What does mounting most often signal?',
    options: [
      'Rank, arousal, or overstimulation — a push into social space',
      'Exclusively sexual behaviour requiring desexing',
      'Playfulness that should be encouraged — not the guide',
      'A sign the dog needs more food — misses context and timing',
    ],
    explanation: 'Often rank, arousal, or overstimulation — not always sexual. It spikes in adolescence and when structure loosens.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog with its tail down or tucked is telling you what?',
    options: [
      'Fear, deference, or submission — read safety, not guilt',
      'It feels guilty about something it did earlier',
      'It is relaxed and comfortable — not the guide standard',
      'It is about to attack — not the guide\'s frame for this',
    ],
    explanation: 'Tail down or tucked is fear, deference, or submission — yielding space. Don\'t assume guilt; read safety. Trauma history can keep the tail low long after the moment passes.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'Your young dog urinates when you greet it or lean over it. The right response is to:',
    options: [
      'Lower your energy and rebuild confidence through small wins',
      'Correct it firmly so it learns urination is unacceptable',
      'Ignore it completely — it will resolve on its own',
      'Restrict water before greetings — misses context and timing',
    ],
    explanation: 'Submissive urination is deference under pressure — often triggered by greeting, looming, or a sharp voice. Lower your energy and rebuild through small wins.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'How should you read eye contact between dogs?',
    options: [
      'Brief soft glances are healthy check-ins; a hard sustained stare is a challenge or fixation',
      'All eye contact between dogs is aggression and must be interrupted — not the guide',
      'Staring is how dogs show affection to each other — not the guide\'s frame for this',
      'Eye contact carries no meaning — watch the tail instead — not the guide\'s frame for this',
    ],
    explanation: 'Brief soft glances = check-in and pack awareness. A locked stare at another dog is an early conflict flag.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog\'s body suddenly locks and freezes while staring at another dog. What is happening?',
    options: [
      'A precursor to reaction — the body locks before the bark, lunge, or snap. Catch it here',
      'The dog is being calm and polite — not the guide\'s frame for this',
      'A normal rest position after exercise — not the guide\'s frame for this',
      'Submission — the moment has already resolved itself — not the guide\'s frame for this',
    ],
    explanation: 'Stiffening/freeze is the precursor. Once fully escalated you are often inside the one-second window already — use the butt push or collar grab as appropriate.',
    guideLink: '#symptom-glossary'
  },

  /* ── Trauma & meetings ── */
  {
    topic: 'Trauma & meetings',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog with a difficult history goes still, unresponsive, and refuses food during training. This is:',
    options: [
      'Shutdown — overload, not stubbornness',
      'Stubbornness that needs a firmer correction',
      'Manipulation to end the session early',
      'Normal calm behaviour — continue as planned',
    ],
    explanation: 'Watch for shutdown (still, unresponsive, refusing food or movement) as overload, not stubbornness.',
    guideLink: '#trauma-signals'
  },
  {
    topic: 'Trauma & meetings',
    breedCategory: 'all',
    track: 'both',
    text: 'How does structure affect a traumatised dog?',
    options: [
      'It still matters — inconsistency frightens a traumatised dog more, not less',
      'Structure should be dropped entirely until trust is rebuilt',
      'Traumatised dogs need stricter, harder corrections to feel safe',
      'Structure only matters once trauma signals have fully disappeared',
    ],
    explanation: 'Structure still matters — inconsistency frightens a traumatised dog more, not less. But exposure must be controlled, with exits and wins built in.',
    guideLink: '#trauma-signals'
  },
  {
    topic: 'Trauma & meetings',
    breedCategory: 'all',
    track: 'both',
    text: 'Two dogs meet, rumble briefly, and both settle with loose bodies and no pursuit. What should you have done?',
    options: [
      'Nothing — a clear correction between dogs that ends cleanly is often healthy',
      'Pulled your dog away at the first sound — not the guide\'s frame for this',
      'Shouted to interrupt before contact was made — a common handler misread here',
      'Corrected your dog afterwards for engaging — not the guide\'s frame for this',
    ],
    explanation: 'Not every noisy interaction is a fight. Loose bodies, role reversal, and clean endings are often healthy — owners often interrupt the exact moment that would have taught the dog something valuable.',
    guideLink: '#dog-meetings'
  },
  {
    topic: 'Trauma & meetings',
    breedCategory: 'all',
    track: 'both',
    text: 'Which picture signals real conflict between dogs rather than negotiation?',
    options: [
      'Stiff approach, silent hard staring, one dog unable to disengage, pursuit without pause',
      'Noise and rumbling that ends with both dogs settling — not the guide\'s frame for this',
      'Role reversal during wrestling, with pauses — not the guide\'s frame for this',
      'One dog yielding and the other accepting the yield — not the guide\'s frame for this',
    ],
    explanation: 'The question is not "was there noise?" but "can both dogs disengage?" Intervene when one cannot — regardless of noise level.',
    guideLink: '#dog-meetings'
  },
  {
    topic: 'Trauma & meetings',
    breedCategory: 'all',
    track: 'both',
    text: 'What does tightening the leash and rushing in at the first rumble teach your dog?',
    options: [
      'That other dogs mean chaos — and that you are not in charge of the situation',
      'That you will always protect it, which builds confidence — not the guide',
      'That meetings should be calm — the message lands as intended',
      'Nothing — leash pressure is invisible to a dog mid-greeting',
    ],
    explanation: 'Your anxiety makes it worse. Hold structure, read the body, and act when the picture is clearly wrong — not when your nerves say so.',
    guideLink: '#dog-meetings'
  },

  // ── Off-leash social ──────────────────────────────────────────────────────
  {
    topic: 'Off-leash social',
    breedCategory: 'all',
    track: 'both',
    text: 'What is the "controlled crucible" in off-lead development?',
    options: [
      'A structured setting where the dog can fail safely — mistakes are part of learning, repetition is mandatory',
      'Keeping the dog permanently on-leash until it is two years old — not the guide\'s frame for this',
      'Avoiding all contact with other dogs until recall is perfect — not the guide\'s frame for this',
      'Letting dogs work out all conflicts without handler involvement — not the guide\'s frame for this',
    ],
    explanation: 'Permanent containment is a dead end for real-world recall. The handler provides controlled exposure where mistakes are instructive and freedom is earned.',
    guideLink: '#controlled-crucible'
  },
  {
    topic: 'Off-leash social',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog approaches another perpendicular from the side and rests its head over the other dog\'s shoulders. What is this?',
    options: [
      'T-bone position — a physical claim of dominance that can force submission or escalate',
      'A play bow invitation — without reading stress, rank-testing, or denied outlets first',
      'Normal mutual greeting with no rank implication — not the guide\'s frame for this',
      'Submission — the approaching dog is yielding — not the guide\'s frame for this',
    ],
    explanation: 'The T-bone is a subtle power play, not play. Read it in the millisecond window before it escalates — see Social friction signals.',
    guideLink: '#social-friction'
  },
  {
    topic: 'Off-leash social',
    breedCategory: 'all',
    track: 'both',
    text: 'What characterises an over-the-neck stand between dogs?',
    options: [
      'Stiff limbs, flagged tail, looming over head or neck — maximum physical authority',
      'Loose bodies with role reversal and pauses — not the guide\'s frame for this',
      'Both dogs lying down side by side — not the guide\'s frame for this',
      'A submissive dog offering its belly — not the guide\'s frame for this',
    ],
    explanation: 'An intensified T-bone — stiff, looming, flagged tail. Intervene early or extract before the snap.',
    guideLink: '#social-friction'
  },
  {
    topic: 'Off-leash social',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog initiates rude off-lead behaviour toward another dog. What is the handler sequence?',
    options: [
      'Unique sound the exact millisecond it starts — then immediate leash-on if blown off; leash removes access, not punishment',
      'Wait until the other owner complains, then apologise — not the guide\'s primary frame for this situation, age, or context',
      'Shout the dog\'s name repeatedly from a distance — not what the guide describes as the primary standard in this context',
      'Physically pick up your dog and comfort it — a common misread that ignores context, timing, and what happened just before',
    ],
    explanation: 'Sharp interruption breaks fixation; leash-on collapses freedom. Anti-social behaviour costs access; calm neutrality earns it back.',
    guideLink: '#off-lead-intervention'
  },
  {
    topic: 'Off-leash social',
    breedCategory: 'all',
    track: 'both',
    text: 'When the leash goes back on after antisocial off-lead behaviour, how should the handler frame it?',
    options: [
      'Neutral removal of access — calm disappointment, not anger or a lecture',
      'Punishment — the dog must feel pain or fear to learn — not the guide',
      'A reward for coming back to you — not the guide\'s frame for this',
      'Ignore it and unclip again immediately — not the guide\'s frame for this',
    ],
    explanation: 'The leash is not punishment. It removes access until behaviour earns freedom again — see Access training.',
    guideLink: '#off-lead-intervention'
  },
  {
    topic: 'Off-leash social',
    breedCategory: 'all',
    track: 'both',
    text: 'What role does a stable "master dog" play in facilitated socialisation?',
    options: [
      'Biological balancer — preempts tension, delivers clean dog-to-dog corrections, then drops arousal to zero with no grudge',
      'A dog that all others must submit to permanently — not what the guide describes as the primary standard in this context',
      'A playmate that teaches puppies to wrestle harder — not what the guide describes as the primary standard in this context',
      'Replacement for any human handler intervention — not what the guide describes as the primary standard in this context',
    ],
    explanation: 'A master dog senses tension early, body-blocks or bumps the instigator, then returns to absolute neutrality — teaching boundaries without human emotional contamination.',
    guideLink: '#master-dog'
  },
  {
    topic: 'Off-leash social',
    breedCategory: 'all',
    track: 'both',
    text: 'Why is missing micro-signals of social friction dangerous?',
    options: [
      'The gap to a fast snap can be milliseconds — late intervention risks injury, chaos, and vet visits',
      'Dogs forget commands when signals are missed — not the guide\'s frame for this',
      'It only matters for dogs over forty kilograms — not the guide\'s frame for this',
      'Micro-signals are only relevant indoors — as entitlement rather than earned access on your terms',
    ],
    explanation: 'Undersocialised, spoiled, or traumatised dogs compress the timeline. Read T-bone, over-neck, locked eyes, and mounting before the snap.',
    guideLink: '#social-friction'
  },
  {
    topic: 'Off-leash social',
    breedCategory: 'all',
    track: 'both',
    text: 'What is the training objective for off-lead social development — as distinct from avoiding all antisocial moments?',
    options: [
      'A dog that navigates real exposure, handles social friction, and looks to the handler when boundaries blur',
      'A dog that never meets another dog until fully trained — not the guide\'s frame for this',
      'Absolute elimination of all mounting, staring, and sniffing — not the guide\'s frame for this',
      'A dog that depends on the handler to carry it past every trigger — not the guide\'s frame for this',
    ],
    explanation: 'The goal is learned accountability and self-regulation — not permanent mechanical management. Freedom is earned through structured repetition.',
    guideLink: '#controlled-crucible'
  },

  // ── Road safety (rural NZ) ────────────────────────────────────────────────
  {
    topic: 'Road safety',
    breedCategory: 'all',
    track: 'both',
    text: 'How does road safety differ from the controlled crucible used in off-lead social development?',
    options: [
      'Beside traffic there is zero tolerance — mistakes are fatal, not instructive; the reflex is built on-lead with no controlled failure',
      'Road safety uses the same fail-safely frame as playgroup socialisation — as entitlement rather than earned access on your terms',
      'Traffic only matters for dogs under seven months — granting off-lead access before the car protocol is automated through repetition',
      'Off-lead access beside roads is granted once recall is solid in a paddock — as entitlement rather than earned access on your terms',
    ],
    explanation: 'Social crucibles allow controlled failure. Roadside, a boundary violation is not a learning opportunity — the standard is an invariant reflex drilled on-lead first.',
    guideLink: '#road-safety'
  },
  {
    topic: 'Road safety',
    breedCategory: 'all',
    track: 'both',
    text: 'What is "semantic hijacking" in the car protocol?',
    options: [
      'Repurposing the existing word "Car" with a sharp, high-intent alert tone — same word, completely different psychological delivery',
      'Inventing a new traffic cue the dog has never heard before — not what the guide describes as the primary standard in this context',
      'Saying "Car" repeatedly louder until the dog complies — without the structured exposure, reset, or repetition the guide describes',
      'Using the dog\'s name instead of a traffic-specific word — not what the guide describes as the primary standard in this context',
    ],
    explanation: 'Most dogs already associate "Car" with outings. The protocol hijacks that familiarity — shifting delivery from casual invitation to non-negotiable alert.',
    guideLink: '#semantic-hijacking'
  },
  {
    topic: 'Road safety',
    breedCategory: 'all',
    track: 'both',
    text: 'An oncoming vehicle appears on a rural walk. What is the correct physical sequence after the high-intent "Car!" cue?',
    options: [
      'Immediate evacuation off the sealed edge → structured sit in the gutter or verge → hold still while tracking the passing vehicle → calm release only after it has fully passed',
      'Sit on the pavement and watch the car pass — staying on the sealed edge instead of evacuating to gutter or verge as the protocol requires before tracking the vehicle',
      'Recall to the handler across the road — crossing live traffic instead of anchoring off the sealed surface while the vehicle passes and tracks it',
      'Lie down in the centre of the road to maximise visibility — maximum exposure on the hazard instead of immobile gutter anchoring until full release',
    ],
    explanation: 'Cross the hard boundary onto earth or grass, anchor in a gutter sit, tolerate engine and tyre noise without breaking posture, release only when the threat is gone.',
    guideLink: '#car-protocol'
  },
  {
    topic: 'Road safety',
    breedCategory: 'all',
    track: 'both',
    text: 'Why must the dog hold a stationary gutter sit while the vehicle passes?',
    options: [
      'Auditory tracking and immobility — the dog tolerates engine, tyre, and air pressure without drifting back toward the hazard',
      'So passing drivers can photograph the dog — delivered at the wrong moment or with the wrong energy for the guide\'s standard',
      'Because sitting on pavement is illegal — as if this narrow case overrides the wider handler standard elsewhere in the guide',
      'To practise a generic stay command unrelated to traffic — not the guide\'s primary frame for this situation, age, or context',
    ],
    explanation: 'The anchor eliminates spatial drift. Holding still while the sound rises and falls teaches that car presence locks the body until the handler releases.',
    guideLink: '#car-protocol'
  },
  {
    topic: 'Road safety',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog hesitates at the pavement edge or breaks the gutter sit as a car approaches. How does the guide treat this?',
    options: [
      'High-stakes failure — a definitive correction inside the one-second window; hesitation beside traffic is not everyday calibration',
      'A mild verbal reminder is enough — traffic training should stay soft — as entitlement rather than earned access on your terms',
      'Ignore it if the car is still distant — staying on the sealed edge instead of evacuating to gutter or verge as the guide requires',
      'End the walk and never train near roads again — granting off-lead access before the car protocol is automated through repetition',
    ],
    explanation: 'On a normal walk, delay might earn a reset. Beside traffic, hesitation is systemic failure — corrections land with life-and-death intensity, then immediate calm release.',
    guideLink: '#road-safety'
  },
  {
    topic: 'Road safety',
    breedCategory: 'all',
    track: 'both',
    text: 'What does the "seven-month road crucible" mean?',
    options: [
      'A minimum of seven months strictly on-lead while the car reflex is drilled — separate from the I don\'t care adult standard — before off-lead access near roads is considered',
      'Dogs under seven months must never walk on rural roads — an age ban that confuses the leashed drilling runway with avoiding roads entirely',
      'The same seven-month rule as I don\'t care — adult behaviour standard only — conflating adult behavioural expectations with the separate car-reflex crucible drilled on-lead beside traffic',
      'Seven months without any corrections near traffic — soft avoidance of the high-stakes corrections the guide requires beside moving vehicles on every rural walk',
    ],
    explanation: 'The road crucible is its own extended leashed runway. I don\'t care names adult behavioural rules; the gutter reflex must be muscle memory before freedom beside a roadway.',
    guideLink: '#road-seven-months'
  },
  {
    topic: 'Road safety',
    breedCategory: 'all',
    track: 'both',
    text: 'When may off-leash freedom be granted within proximity of a rural roadway?',
    options: [
      'Only after the on-lead car protocol is automated through months of repetition — a graduation decision, not a default from recall confidence elsewhere',
      'As soon as the dog is seven months old and knows sit — maturity and a basic cue treated as sufficient graduation beside sealed edges',
      'Whenever the road looks quiet — situational judgment replacing the months of automated on-lead car protocol the guide requires before any graduation',
      'Never — all dogs must stay on-lead forever — a permanent ban that skips the graduation decision after the leashed crucible is complete',
    ],
    explanation: 'Recall in a paddock does not transfer to sealed edges. Off-lead near roads is earned only after the leashed crucible — hundreds of reps under mechanical control.',
    guideLink: '#road-seven-months'
  },

  /* ── Corrections ── */
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'How does the guide define a correction?',
    options: [
      'A fast, calm interruption that redirects attention and resets the dog\'s body',
      'A punishment that teaches the dog its behaviour was morally wrong',
      'A consequence delivered after the outing, once you are home',
      'Any expression of displeasure, including sighing and scolding',
    ],
    explanation: 'Corrections are not punishment in anger — they are fast, calm interruptions used inside the one-second window. The core mechanic is a unique sound followed immediately by a unique touch.',
    guideLink: '#corrections'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'Why does yelling a dog\'s name during misbehaviour often fail to stop it?',
    options: [
      'Dogs are habituated to their owner\'s everyday voice and predictable touch — it no longer registers as an interruption',
      'Dogs cannot hear their name when excited — without the structured exposure, reset, or repetition the guide describes',
      'Using the dog\'s name is always wrong in every context — without reading stress, rank-testing, or denied outlets first',
      'Dogs interpret their name as a reward signal — not what the guide describes as the primary standard in this context',
    ],
    explanation: 'Dogs habituate to familiar tone, repetitive words, and predictable touch. A unique sound at the exact instant of the behaviour snaps attention back — see Unique sound & touch.',
    guideLink: '#unique-sound-touch'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'What is the core two-step pattern for stopping unwanted behaviour (as distinct from teaching commands like sit)?',
    options: [
      'A unique sound at the exact instant the behaviour starts, followed immediately by a unique touch',
      'Repeat the command until the dog complies, then reward — not the guide\'s frame for this',
      'Wait until the behaviour finishes, then scold — not the guide\'s frame for this',
      'Use the same everyday voice with increasing volume — not the guide\'s frame for this',
    ],
    explanation: 'Teaching commands is repetition and reward. Stopping unwanted behaviour requires a unique sound plus unique touch — a stimulating boundary the dog has not learned to ignore.',
    guideLink: '#unique-sound-touch'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'Which two body locations does the guide name as the most communicative for the unique touch?',
    options: [
      'The flank (side) and the jawbone / base of neck',
      'The top of the head and the tail — grooming zones that soothe rather than interrupt reactivity in the moment',
      'The chest and the paws — softer contact points that do not break fixation or steer momentum away from triggers',
      'The back and the belly — comfort areas that calm instead of the flank push and jawbone steer the guide names',
    ],
    explanation: 'The flank touch (butt push) breaks in-place reactivity; the jawbone/neck touch steers momentum away from triggers — collar grab & forced sit.',
    guideLink: '#unique-sound-touch'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog begins lifting a paw onto a table. When should the unique sound be delivered?',
    options: [
      'The exact millisecond the incorrect behaviour starts — as the paw begins to lift',
      'After all four paws are on the table — not the guide\'s frame for this',
      'Once you are back home and can scold properly — not the guide\'s frame for this',
      'Only if the dog ignores a third verbal warning — not the guide\'s frame for this',
    ],
    explanation: 'The sound must land at the instant the behaviour begins — inside the one-second window. Delayed correction does not interrupt the live impulse.',
    guideLink: '#unique-sound-touch'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'Which of these is an effective unique sound for a correction?',
    options: [
      'A sharp "Hey!", clap, or bark-like verbal pop — not the dog\'s name or a drawn-out scold',
      'The dog\'s name repeated louder each time — not the guide\'s frame for this',
      'A long, soothing "Nooooo" so they hear disapproval — not the guide\'s frame for this',
      'Baby talk to calm them down — as entitlement rather than earned access on your terms',
    ],
    explanation: 'The sound must be unique — a sharp interruption, not everyday voice. Pair with the touch in the same instant until the association is solid.',
    guideLink: '#verbal-correction'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog is fixating and yap-barking in place at a trigger. Which tool is designed for exactly this?',
    options: [
      'The butt push — a firm sideways push to the hindquarters that breaks the cycle',
      'The pin and hold — as entitlement rather than earned access on your terms',
      'A treat lure to draw attention away — not the guide\'s frame for this',
      'Picking the dog up and carrying it past the trigger — not the guide standard',
    ],
    explanation: 'The butt push is the primary tool for in-place reactivity — the continuous bark, the stare, the stiffening that feeds on itself.',
    guideLink: '#butt-push'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'You have just delivered a butt push and the dog turned to you. What do you do next?',
    options: [
      'Immediately return to calm, forward-facing posture and expect the dog to settle',
      'Watch the dog closely to see what it does next — not the guide\'s frame for this',
      'Praise warmly so the dog knows the correction is over — not the guide standard',
      'Repeat the push once more to make sure the message landed — not the guide',
    ],
    explanation: 'Immediately return to your calm posture. Don\'t hover or watch for what it does next — correct and move on, as if it barely warranted your notice.',
    guideLink: '#butt-push'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'What is the correct direction and duration for a leash correction?',
    options: [
      'One firm downward jerk, then immediately back to slack',
      'A steady upward pull held until the dog calms',
      'Repeated small tugs in any direction until the dog responds',
      'Sustained sideways tension to steer the dog away',
    ],
    explanation: 'One sharp pull down, then back to slack. Never upward — that risks the larynx. Never sustained tension.',
    guideLink: '#leash-jerk'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'What makes a verbal correction effective?',
    options: [
      'A single sharp "pop" of sound — bark-like, expelled in one instant, never repeated louder',
      'A long, drawn-out "Nooooo" so the dog hears the disapproval — misses context and timing',
      'Repeating the word, raising the volume each time — not the guide\'s frame for this',
      'A gentle, soothing tone so the dog does not get scared — not the guide\'s frame for this',
    ],
    explanation: 'The command needs a pop — a single sharp release of sound that resembles a bark. If they ignore it, return to physical + verbal together; repeating the word louder trains ignoring.',
    guideLink: '#verbal-correction'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog jumps up at a visitor. What is the correction pattern?',
    options: [
      'Grab the collar at the neckline, give a clear "No", walk the dog backwards, and sit them down',
      'Push the dog off with your knee and turn away — not the guide\'s frame for this',
      'Ask the visitor to ignore the dog until it stops — not the guide\'s frame for this',
      'Pull the leash upward to lift the front paws off the person — not the guide\'s frame for this',
    ],
    explanation: 'For behaviour that comes at you — jumping, lunging, mouthing — grab the collar, deliver the verbal, walk backwards to break momentum, then guide into a sit.',
    guideLink: '#collar-snatch'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'When is it appropriate for an owner to use the pin and hold at home?',
    options: [
      'Never without hands-on guidance — it is demonstrated in sessions only',
      'Whenever lighter corrections have failed twice in one outing',
      'Any time the dog growls at a family member — not the guide standard',
      'Once the dog is over two years old — not the guide\'s frame for this',
    ],
    explanation: 'Pin & hold sits at the top of the escalation ladder and is sessions-only. If nothing in the daily toolkit is landing, that is a session conversation — not something to improvise at home.',
    guideLink: '#pin-hold'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'How do you build a verbal correction so it can eventually replace the physical one?',
    options: [
      'Pair the word with the physical correction in the same instant, every time, until the sound alone breaks the behaviour',
      'Use the word on its own from day one — dogs learn words quickly — not the guide\'s frame for this',
      'Use a different word each time so the dog generalises — skipping lighter structure and jumping straight to heavy tools',
      'Say the word after the physical correction as a closing marker — not the guide\'s frame for this',
    ],
    explanation: 'The word must land in the same one-second window as the physical correction until the association is solid. When the dog visibly responds to the sound alone, test without the hands.',
    guideLink: '#verbal-correction'
  },

  /* ── Leash work ── */
  {
    topic: 'Leash work',
    breedCategory: 'all',
    track: 'both',
    text: 'What does a constantly tight, upward-pulled leash communicate to the dog?',
    options: [
      'That you are nervous and reactive — creating a feedback loop of escalation',
      'Clear leadership and control — not the guide\'s frame for this',
      'Nothing — dogs only respond to voice commands — misses context and timing',
      'That the walk is nearly over — not the guide\'s frame for this',
    ],
    explanation: 'A tight leash tells the dog you\'re nervous. You tighten, the dog feels it and escalates, you tighten more. Sustained tension is anxiety transmitted through a leash.',
    guideLink: '#leash'
  },
  {
    topic: 'Leash work',
    breedCategory: 'all',
    track: 'both',
    text: 'Why is a slack leash described as "information"?',
    options: [
      'It lets you see who your dog actually is — where attention goes, how quickly it fixates',
      'It tells the dog you have stopped paying attention — not the guide\'s frame for this',
      'It signals to other owners that your dog is friendly — not the guide\'s frame for this',
      'It reduces wear on the collar and lead — not the guide\'s frame for this',
    ],
    explanation: 'A relaxed leash lets you read the dog\'s personality and natural impulses rather than suppressing them with constant tension. You can\'t see any of that through a tight line.',
    guideLink: '#leash'
  },
  {
    topic: 'Leash work',
    breedCategory: 'all',
    track: 'both',
    text: 'Why does walking position matter — dog beside or slightly behind you?',
    options: [
      'A dog walking ahead concludes it is responsible for the pair — a burden that produces anxiety',
      'It is purely about obedience competition rules — not the guide\'s frame for this',
      'Dogs behind you cannot see triggers and so cannot react — not the guide\'s frame for this',
      'It keeps the dog out of the way of other walkers — not the guide\'s frame for this',
    ],
    explanation: 'A dog that walks ahead has concluded it is responsible for the pair. Walking beside you means you\'re in charge of what\'s out there, and the dog can simply be a dog.',
    guideLink: '#leash'
  },
  {
    topic: 'Leash work',
    breedCategory: 'all',
    track: 'both',
    text: 'Downward leash pressure is hard for you to apply — a small dog, or limited grip strength. What does the guide suggest?',
    options: [
      'Attach the leash to a short stick held against the ground, pulling the dog down without fighting upward tension',
      'Switch to a harness and pull backwards instead — even when lighter tools have not been tried consistently first',
      'Use upward pressure — gentler but in the available direction — not the guide\'s frame for this',
      'Skip physical corrections and rely on treats — though structure and calibration still apply throughout training',
    ],
    explanation: 'The stick assist: with the stick held against the ground, the dog is pulled down through the leash — making the downward jerk achievable and consistent.',
    guideLink: '#leash'
  },

  /* ── Access & rewards ── */
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'In access training, what happens when behaviour falls short of the standard during off-leash time?',
    options: [
      'The leash goes back on with a tone of calm disappointment — that choice cost access',
      'The dog gets a verbal warning and one more chance — not the guide\'s frame for this',
      'You end the walk and go straight home in silence — not the guide\'s frame for this',
      'You withhold dinner that evening so the lesson lands — misses context and timing',
    ],
    explanation: 'Misbehaviour costs access: leash on, calm disappointed tone — not anger, not a lecture. The leash removes freedom, not as punishment but as neutral consequence. Clip on, reset, walk on without dwelling on it.',
    guideLink: '#access'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'You unclip the leash. What should the dog do?',
    options: [
      'Still wait — release from the leash is not release to run; they hold until you say go',
      'Run immediately — that is the whole point of unclipping — misses context and timing',
      'Sit for exactly seven seconds, then leave — not the guide\'s frame for this',
      'Stay within one metre of you for the rest of the outing — misses context and timing',
    ],
    explanation: 'Unclip — and the dog still waits. Release from the leash is not release to run. They hold until you tell them they can go.',
    guideLink: '#access'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'If using treats, what kind works best as a reward signal?',
    options: [
      'A rare, high-value treat the dog hasn\'t been overexposed to — like dried liver — kept training-only',
      'Their favourite treat, given whenever they do anything good throughout the day',
      'The dog\'s normal kibble, so rewards stay consistent with meals — not the guide\'s frame for this',
      'Large treats, so the reward takes longer to eat — not the guide\'s frame for this',
    ],
    explanation: 'Use a rare, high-value treat and reserve it for training sessions only. The rarer the treat, the stronger its value as a reward signal — handing it out through the day drains exactly the value training depends on.',
    guideLink: '#rewards'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog ignores treats in training. According to the guide, what should you check before switching to a different reward currency?',
    options: [
      'Whether the treat has been overused, the dog is hungry, and a favourite is reserved for training only — then consider access, play, or social rewards',
      'Nothing — a dog that ignores treats is not food-motivated, so move straight to access rewards — not the guide\'s frame for this',
      'Withhold meals until food becomes motivating — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
      'Keep trying random new treats until one works — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
    ],
    explanation: 'Ignoring treats is usually a setup problem, not a temperament verdict. Run the checks in order — overuse, hunger, training-only reservation — before concluding the dog needs a different currency.',
    guideLink: '#treat-diagnostic'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog shows no interest in food during sessions, yet eats dinner enthusiastically every night. What is the most likely explanation?',
    options: [
      'A setup problem — the training treat is overexposed, not reserved for sessions, or the dog isn\'t hungry at training time',
      'The dog is genuinely not food-oriented and needs access rewards instead — not the guide\'s frame for this',
      'The dog is unwell and should see a vet before training continues — not the guide\'s frame for this',
      'The dog has learned that refusing treats earns more attention — as entitlement rather than earned access on your terms',
    ],
    explanation: 'A dog that eats meals well clearly values food. Fix the setup first — rarity, reservation, and appetite — before concluding the temperament isn\'t food-oriented.',
    guideLink: '#treat-diagnostic'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'You train right after your dog has eaten its meal, and it ignores the treats. What has gone wrong?',
    options: [
      'The dog isn\'t hungry — appetite is part of what the food reward depends on',
      'The treats are too small to compete with a full meal — not the guide',
      'Nothing — full dogs learn just as well as hungry ones — not the guide',
      'The dog is being stubborn and needs a firmer correction — not the guide',
    ],
    explanation: 'Training straight after a meal, or with kibble available all day, removes the appetite the reward depends on. Check hunger as part of the treat diagnostic before changing anything else.',
    guideLink: '#treat-diagnostic'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'Why should the dog\'s single favourite treat be reserved exclusively for training sessions?',
    options: [
      'Rarity keeps it powerful — given freely, it stops being currency and loses its value as a reward signal',
      'So the dog doesn\'t gain weight from too many treats — not the guide\'s frame for this',
      'Because favourite treats are usually expensive — as entitlement rather than earned access on your terms',
      'To prevent other family members from confusing the dog — not the guide\'s frame for this',
    ],
    explanation: 'The ultimate treat must never be overused or it loses its value — the rarity supports the process. Reserve it for sessions: not walks, not settling, not "just because."',
    guideLink: '#treat-diagnostic'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'Why is saying "good boy" during or just after a reactive episode a mistake?',
    options: [
      'It rewards the episode — praise must be saved for calm, correct behaviour',
      'It is not a mistake — reassurance always helps a stressed dog',
      'Dogs find the phrase "good boy" overstimulating in any context',
      'Verbal praise only works when paired with a treat — not the guide',
    ],
    explanation: '"Good boy" during or just after a reactive episode rewards the episode. Save verbal praise for calm, correct behaviour — delivered calmly.',
    guideLink: '#rewards'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'You give your dog\'s favourite treat throughout the day for minor behaviours. In training sessions, it ignores that same treat. Why?',
    options: [
      'Overuse has drained its value — rarity supports the process, so it must be reserved for training only',
      'The dog has developed an allergy to the treat — not the guide\'s frame for this',
      'The treat was never actually the dog\'s favourite — not the guide\'s frame for this',
      'Training sessions are inherently less rewarding than daily life — not the guide\'s frame for this',
    ],
    explanation: 'This is the treat exploit being abused. The ultimate treat must never be overused or it loses its value — handed out casually, it stops being currency exactly when you need it in training.',
    guideLink: '#treat-diagnostic'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'With treat setup ruled out, a dog still ignores food but pulls hard toward sniffing spots and fixates on movement. What currency should you train with?',
    options: [
      'Access and environmental rewards — earned off-leash time, sniffing, and running',
      'A higher-value treat than the one currently used — misses context and timing',
      'Verbal praise delivered in an excited, high-energy tone — not the guide',
      'Longer walks so the dog tires out and accepts treats again — not the guide',
    ],
    explanation: 'Pulling toward sniffing and fixating on movement are signals of an access-oriented dog. Earned off-lead time, sniff, and run become the primary currency — the core of access training.',
    guideLink: '#orientation-signals'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'A people-focused dog works hard for calm approval but shows little interest in treats. How should its reward currency be delivered?',
    options: [
      'As calm affection after correct behaviour — never during reactivity',
      'As excited cuddling the moment the dog does anything right',
      'Treats should still be forced as the primary reward for consistency',
      'Approval should be withheld entirely so the dog works harder for it',
    ],
    explanation: 'Socially-oriented dogs respond strongly to calm approval. Deliver affection calmly after correct behaviour — excited delivery re-elevates energy, and affection during reactivity rewards the episode.',
    guideLink: '#orientation-signals'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'You have ruled out the usual treat setup problems — the treat is not overused, the dog is hungry at training time, and a favourite is reserved for sessions only — but the dog still ignores food in training. What should you do next?',
    options: [
      'Identify what the dog actually wants — access, play, or social interaction — and use that as the currency',
      'Repeat the diagnostic checks until food starts working — looping setup when orientation signals already point to a different currency',
      'Train without rewards, since this dog cannot be motivated — giving up on currency instead of reading access, play, or social drive',
      'Withhold meals so hunger eventually makes treats valuable — starving motivation rather than matching what the dog actually values',
    ],
    explanation: 'Only after the setup checks are ruled out can you conclude the dog genuinely isn\'t food-oriented. Then read the orientation signals — access, play, or social — and match the motivator to the dog, not the other way around.',
    guideLink: '#orientation-signals'
  },

  /* ── Timing ── */
  {
    topic: 'Timing',
    breedCategory: 'all',
    track: 'both',
    text: 'Roughly how long is the association window for a correction or reward to connect with a behaviour?',
    options: [
      'About one second',
      'About ten seconds',
      'About one minute',
      'As long as the dog remembers the event — often hours',
    ],
    explanation: 'The response must land within roughly one second of the behaviour. Beyond that, the dog cannot reliably connect the two.',
    guideLink: '#timing'
  },
  {
    topic: 'Timing',
    breedCategory: 'all',
    track: 'both',
    text: 'You discover a chewed shoe from earlier in the day. What does correcting the dog now achieve?',
    options: [
      'Confusion — you are not interrupting a live impulse, so the correction teaches nothing',
      'A delayed but still effective lesson, if you show the dog the shoe — not the guide',
      'Reinforcement of your leadership, even without association — misses context and timing',
      'Prevention — the dog will avoid shoes to avoid the correction — not the guide',
    ],
    explanation: 'You are not punishing a memory; you are interrupting a live impulse. Delayed correction doesn\'t teach — it just confuses.',
    guideLink: '#timing'
  },
  {
    topic: 'Timing',
    breedCategory: 'all',
    track: 'both',
    text: 'Why does the guide say to react to the precursor rather than the full behaviour?',
    options: [
      'It is easier to interrupt an impulse than a full reaction',
      'Precursors are the only part of behaviour dogs are aware of',
      'Corrections during a full reaction are dangerous to the handler',
      'Precursors last longer, giving you more time',
    ],
    explanation: 'Watch for the head snap, the body freeze, the first intake of breath before a bark. It\'s easier to interrupt an impulse than a full reaction.',
    guideLink: '#timing'
  },
  {
    topic: 'Timing',
    breedCategory: 'all',
    track: 'both',
    text: 'You miss the one-second window. What now?',
    options: [
      'Let it go — stay calm, stay close, and be faster on the next moment',
      'Correct anyway; better late than never — misses context and timing',
      'End the outing as a consequence — not the guide\'s frame for this',
      'Recreate the situation so you can correct it properly',
    ],
    explanation: 'If you miss the moment, let it go — wait for the next one and be faster. Delayed correction doesn\'t teach.',
    guideLink: '#timing'
  },

  /* ── Routine & thresholds ── */
  {
    topic: 'Routine & thresholds',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog surges past you when the front door opens. What is the reset?',
    options: [
      'Back inside, sit, wait — then try again without drama',
      'Let it go this once; the walk itself will burn off the energy',
      'A firm leash correction once you are outside',
      'Close the door on the leash to physically block the dog',
    ],
    explanation: 'If they surge or push past, reset: back inside, sit, wait — then try again. Dogs that bolt through doors learn their impulse sets the pace for the whole walk.',
    guideLink: '#front-door'
  },
  {
    topic: 'Routine & thresholds',
    breedCategory: 'all',
    track: 'both',
    text: 'Which gateways does the front-door standard apply to?',
    options: [
      'Every gateway — front door, car boot, yard gate. No door is a free pass',
      'Only the front door of the house — not the guide\'s frame for this',
      'Only doors that lead to roads or hazards — misses context and timing',
      'Doorways at home, but not gates or vehicles — misses context and timing',
    ],
    explanation: 'Same standard at every gateway. Calm wait before the leash goes on, before the door opens, before they step through.',
    guideLink: '#front-door'
  },
  {
    topic: 'Routine & thresholds',
    breedCategory: 'all',
    track: 'both',
    text: 'What is the seven-second check-in?',
    options: [
      'After release, a pack-minded dog should glance back your way within seven seconds',
      'Checking your dog\'s collar fit every seven days — not the guide\'s frame for this',
      'Calling the dog back to you every seven minutes on a walk — not the guide',
      'A seven-second sit before every meal — not the guide\'s frame for this',
    ],
    explanation: 'When you release the dog, count to seven. The glance back is the check-in: "I\'m still with you; I\'m still reading you." No glance — the access contract is broken, leash on.',
    guideLink: '#check-in-seven'
  },
  {
    topic: 'Routine & thresholds',
    breedCategory: 'all',
    track: 'both',
    text: 'The hide tactic — stepping out of sight when a puppy forgets to check in — should be used with which dogs?',
    options: [
      'Confident, resilient puppies only — never fearful, shutdown, or trauma-signalling dogs',
      'All puppies, regardless of temperament — not the guide\'s frame for this',
      'Adult dogs with solid recall — as entitlement rather than earned access on your terms',
      'Any dog that has failed the check-in twice — not the guide\'s frame for this',
    ],
    explanation: 'Use the hide tactic only with confident, resilient puppies. For fearful or trauma-signalling dogs, shorten the distance and rebuild check-in at closer range instead.',
    guideLink: '#check-in-seven'
  },
  {
    topic: 'Routine & thresholds',
    breedCategory: 'all',
    track: 'both',
    text: 'Which daily practice pattern consolidates training best?',
    options: [
      'A consistent ten minutes every day — more valuable than an occasional hour',
      'One long session every weekend — not the guide\'s frame for this',
      'Intensive training only when problems appear — misses context and timing',
      'Formal sessions only — casual walks should stay rule-free',
    ],
    explanation: 'Practice every day, even briefly. Use every walk as a training session until the behaviours are solid — not a separate "training walk" versus a casual one.',
    guideLink: '#daily'
  },
  {
    topic: 'Routine & thresholds',
    breedCategory: 'all',
    track: 'both',
    text: 'Your partner lets the dog jump up "because it misses the old puppy days". What does the guide say about this?',
    options: [
      'Mixed messages make the transition exponentially slower — the same rules apply regardless of who is present',
      'It is fine as long as one person holds the standard — splitting rules by person when the guide demands one household frame',
      'Dogs understand that different people have different rules — assuming nuance where mixed messages slow graduation exponentially',
      'Affection from family members never affects training — treating puppy nostalgia as irrelevant to what the dog learns at the door',
    ],
    explanation: 'The dog doesn\'t get exceptions for family members who haven\'t been trained yet. Mixed messages do not just slow progress — they make the transition exponentially slower.',
    guideLink: '#graduation'
  },
  {
    topic: 'Routine & thresholds',
    breedCategory: 'all',
    track: 'both',
    text: 'How should you treat the "three weeks" consolidation timeline?',
    options: [
      'As a useful rule of thumb, not a deadline — consistency matters more than the calendar',
      'As a hard deadline — dogs that take longer need a different method — not the guide',
      'As a minimum — no dog consolidates faster than three weeks — misses context and timing',
      'As irrelevant — timelines play no part in training — not the guide\'s frame for this',
    ],
    explanation: 'Some dogs move faster; others need longer, especially with trauma, high reactivity, or inconsistent handling. Two households following the same method can look very different at the three-week mark.',
    guideLink: '#daily'
  },

  /* ── Trainer-only: calibration & escalation ── */
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'Order the escalation ladder correctly, from first resort upward.',
    options: [
      'Verbal pop → butt push / leash jerk → collar grab & forced sit → brief shocking squeeze → pin & hold',
      'Butt push → verbal pop → pin & hold → collar grab → shocking squeeze — a common handler misread here',
      'Collar grab → leash jerk → verbal pop → pin & hold → shocking squeeze — misses context and timing',
      'Verbal pop → collar grab → butt push → pin & hold → shocking squeeze — a common handler misread here',
    ],
    explanation: 'Most days you never leave the lower rungs. Escalation is calibrated response, not a menu to work through in one outing.',
    guideLink: '#escalation-ladder'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'Which two contexts does the guide name as appropriate for firmer, shocking-level correction?',
    options: [
      'Life-and-death safety moments, and boundary negotiation where lighter tools have not landed',
      'Any disobedience in public, and repeated barking at home — not the guide\'s frame for this',
      'House-soiling, and pulling on the leash — not the guide\'s frame for this',
      'First-time offences, so the lesson lands immediately — not the guide\'s frame for this',
    ],
    explanation: 'Life and death (roadside, traffic) and boundary negotiation (recall turned into a game when verbal and lighter physical tools have not landed). One instant of shock, immediate release, calm handler afterward.',
    guideLink: '#when-firmer'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'In which of these situations is firmer physical correction NOT appropriate?',
    options: [
      'A dog showing trauma signals — flinching, shutdown, cowering, bolting from contact',
      'A confident adolescent who has turned recall into a game despite consistent lighter tools',
      'A roadside life-and-death moment where hesitation costs more than a sharp reset',
      'A pushy adult whose boundary negotiation has become engaging sport',
    ],
    explanation: 'Shocking physical escalation on a trauma-signalling dog can confirm the world is unsafe. Also inappropriate: puppies (rarely), when you are angry or venting, and when lighter tools have not been tried consistently.',
    guideLink: '#when-not-firmer'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'Which set of factors calibrates how firm the same technique should be on a given dog?',
    options: [
      'Trauma history, size and physicality, sensitivity and temperament, age, and learning speed',
      'Breed popularity, coat colour, and sex — not the guide\'s frame for this',
      'Time of day, weather, and how long the walk has been — not the guide\'s frame for this',
      'Only the severity of the behaviour being corrected — not the guide\'s frame for this',
    ],
    explanation: 'No printed intensity fits every dog. Past harm lowers the ceiling; what reads as a tap on one dog may be overwhelming on another.',
    guideLink: '#correction-intensity'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'How does correction calibration differ for puppies?',
    options: [
      'Elastic nervous system but short capacity — firmness yes, shocking squeeze rarely; short sessions, quick rebuild',
      'Puppies should never receive any physical correction of any kind — a blanket ban the guide does not apply to elastic but short-capacity nervous systems',
      'Puppies need harder corrections because they forget quickly — escalating intensity when the guide calls for firmness with rare shocking squeeze only',
      'The same intensity as adults, since the technique is identical — ignoring shorter sessions and quicker rebuild the guide expects for puppies',
    ],
    explanation: 'Puppies forget quickly and recover quickly — their nervous systems are elastic, but their capacity is short. Correct in the act; keep sessions short and rebuild quickly with calm neutrality.',
    guideLink: '#breed-age-intensity'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'An adolescent dog starts mounting, barging, and going selectively deaf. How should a handler read this?',
    options: [
      'Often developmental rank-testing — a firmer line is often needed, still not personal, still instant release',
      'A personal challenge that calls for sustained pressure until submission — not the guide\'s frame for this',
      'A medical issue — adolescents do not test boundaries — not the guide\'s frame for this',
      'A sign training has failed and should restart from scratch — not the guide\'s frame for this',
    ],
    explanation: 'Adolescents test hard and show rank-related behaviours that can look personal but are often developmental. Firmer line, not personal, instant release.',
    guideLink: '#breed-age-intensity'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'What is the right entry point for an adult dog with trauma or shutdown history?',
    options: [
      'Lighter entry, slower arc, structure without flooding',
      'Maximum firmness first, to establish leadership before trust',
      'No structure at all until the dog initiates contact',
      'Identical handling to any confident adult',
    ],
    explanation: 'Lighter entry, slower arc, structure without flooding. Escalating to shocking physical correction can confirm the world is unsafe.',
    guideLink: '#breed-age-intensity'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'What distinguishes a correctly delivered "shocking squeeze" from abuse?',
    options: [
      'One instant of shock, immediate release, calm handler afterward — never repeated, never personal',
      'It is delivered only when the handler is genuinely angry, so it reads as authentic',
      'It is held until the dog vocalises, proving the message landed — not the guide\'s frame for this',
      'Nothing — the guide forbids any firm correction — not the guide\'s frame for this',
    ],
    explanation: 'Hand as mouth: brief, measured, released the instant the message lands. Prolonged pressure, repeated squeezing, or correction delivered while venting teaches the wrong lesson and can create trauma.',
    guideLink: '#dog-language'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'A socially competent adult dog growls and snaps once at a pushy youngster, who yields. Both settle. What was that?',
    options: [
      'Dog-to-dog boundary-setting — sometimes the best teacher a pushy youngster will ever get',
      'An attack that should have been interrupted before contact — misses context and timing',
      'Play that got out of hand — as entitlement rather than earned access on your terms',
      'Evidence the adult dog is dangerous around young dogs — not the guide\'s frame for this',
    ],
    explanation: 'A clear correction from a calm, experienced dog is dog-to-dog boundary-setting — then arousal drops to zero with no grudge. Compassionate hardline between dogs is not cruelty.',
    guideLink: '#dog-meetings'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'What is the difference in response between a failed seven-second check-in and a full bolt?',
    options: [
      'Failed check-in while in range: immediate leash-on, no chase. Full bolt: longer joyless pursuit, then calm reset',
      'Both require the same long pursuit at a casual pace — as entitlement rather than earned access on your terms',
      'Both require waiting where you are until the dog returns — not the guide\'s frame for this',
      'Failed check-in: long pursuit. Full bolt: leash-on when convenient — not the guide\'s frame for this',
    ],
    explanation: 'Different distances, different responses; both demand relentlessness without panic. The check-in is a tighter contract than a full recall.',
    guideLink: '#expectations'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'You feel anger rising mid-outing after repeated boundary-testing. What does the guide instruct?',
    options: [
      'Pause, reset yourself, or shorten the outing — correction from frustration is personal, not pack language',
      'Channel the anger into the correction so the dog feels the seriousness — not the guide\'s frame for this',
      'Hand the leash to someone else and walk away permanently — not the guide\'s frame for this',
      'Continue exactly as before; emotions are irrelevant to technique — not the guide\'s frame for this',
    ],
    explanation: 'When you are angry, exhausted, or venting — pause, reset yourself, or shorten the outing. Correction from frustration is not pack language; it is personal.',
    guideLink: '#when-not-firmer'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'Why is escalation described as "not a shortcut past the daily toolkit"?',
    options: [
      'Higher rungs are only justified when lighter tools have been tried consistently and have not landed',
      'The daily toolkit is legally required before any correction — not the guide\'s frame for this',
      'Escalation works faster, so it should be saved for special occasions — misses context and timing',
      'The dog must consent to each rung in turn — as entitlement rather than earned access on your terms',
    ],
    explanation: 'When lighter tools have not been tried consistently, escalation is not appropriate. If nothing in the daily toolkit is landing, that is a session conversation.',
    guideLink: '#when-not-firmer'
  },

  /* ── Breed: clingy / people-focused ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'clingy',
    track: 'both',
    text: 'Your clingy, people-focused dog needs a correction. What must stay true about the delivery?',
    options: [
      'Calm and matter-of-fact, never personal — these dogs are susceptible to emotional damage from harsh rejection',
      'Extra firm, because clingy dogs ignore soft corrections — not the guide\'s frame for this',
      'Skipped entirely — corrections damage bonded dogs — as entitlement rather than earned access on your terms',
      'Followed by prolonged coldness so the lesson sinks in — not the guide\'s frame for this',
    ],
    explanation: 'People-focused breeds bond intensely and can be damaged by corrections delivered with frustration or cold withdrawal. The tools still apply; the energy stays calm and matter-of-fact.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'clingy',
    track: 'both',
    text: 'After a reset, how quickly should you rebuild warmth with a clingy, people-focused dog?',
    options: [
      'Quickly — structure without warmth can read as abandonment to these dogs',
      'Not for several hours, so the correction is not undone — not the guide',
      'Never during training phases — not the guide\'s frame for this',
      'Only after the dog offers an apology behaviour — not the guide standard',
    ],
    explanation: 'Rebuild quickly after a reset — a quicker return to calm neutrality rather than prolonged coldness. Structure without warmth can read as abandonment.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'clingy',
    track: 'both',
    text: 'Your dog cries when corrected and the household has started revolving around managing its distress. What is happening?',
    options: [
      'An emotional hostage dynamic — do not negotiate with crying or guilt; hold the standard with calm affection',
      'Genuine trauma that requires stopping all corrections — negotiating with distress instead of holding calm structure with affection',
      'Normal behaviour for a bonded dog — keep comforting — rewarding crying with warmth that collapses the standard',
      'A medical issue that needs a vet before training continues — medicalising an emotional hostage dynamic the guide names explicitly',
    ],
    explanation: 'Intense baby-style nurturing without boundaries makes the dog an emotional mirror. Warmth without structure is not kindness here — it is instability.',
    guideLink: '#common-pitfalls'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'clingy',
    track: 'both',
    text: 'What reward currency is often strongest for people-focused breeds?',
    options: [
      'Affection — delivered calmly, for calm and correct behaviour',
      'Off-leash access to chase wildlife — high-arousal currency that rewards the wrong drive for people-focused breeds',
      'Loud, excited verbal praise during reactions — energy that re-elevates the state you are trying to keep calm',
      'Food only — affection has no reward value for these dogs, contrary to what the guide often finds strongest',
    ],
    explanation: 'These dogs can be highly responsive to affection as a reward. Match the motivator to the dog — and deliver it calmly, never during the excited state.',
    guideLink: '#breed-temperament'
  },

  {
    topic: 'Breed temperament',
    breedCategory: 'clingy',
    track: 'both',
    text: 'Your people-focused dog has constant lap access and sleeps on the bed. What does the guide say about this?',
    options: [
      'It can blur the relationship frame and who leads the household — that is structure, not moral judgment',
      'It is fine for bonded breeds — closeness is what they need — not the guide\'s frame for this',
      'It is forbidden for all dogs in all circumstances — not the guide\'s frame for this',
      'It only matters for dogs over twenty kilograms — not the guide\'s frame for this',
    ],
    explanation: 'Allowing constant lap or bed access can blur the leadership frame and affect who leads the household rhythm. What you permit at home shapes what you get everywhere else.',
    guideLink: '#breed-temperament'
  },

  /* ── Breed: herding / visual ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'herding',
    track: 'both',
    text: 'With a herding-type dog, when should you act on a fixation?',
    options: [
      'At the eye-lock — before the body moves; the precursor window matters even more for these dogs',
      'Once the dog starts moving toward the trigger — not the guide\'s frame for this',
      'Only when barking begins — not the guide\'s primary frame for this situation, age, or context',
      'After the lunge, when the behaviour is undeniable — not the guide\'s frame for this',
    ],
    explanation: 'Herding types may lock onto movement — eye contact can become a full fixation before the body moves. Watch for the eye-lock before the lunge.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'herding',
    track: 'both',
    text: 'Your herding-type dog circles and nips at moving feet during a family gathering. How should you read this?',
    options: [
      'Movement-triggered herding instinct — interrupt at the precursor and channel outlets through structured access, not unstructured chasing games',
      'Playfulness that should be encouraged so the dog burns energy — a common misread that ignores context, timing, and what happened just before',
      'Aggression toward children that requires the dog to be kept away from all gatherings — as entitlement rather than earned access on your terms',
      'A training failure that means herding breeds cannot live with families — not what the guide describes as the primary standard in this context',
    ],
    explanation: 'Herding types are wired to track and intercept movement. Correct early, hold the standard calmly, and give earned outlets — not endless kid-chase as a substitute for structure.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'herding',
    track: 'both',
    text: 'Why is extended face-to-face gazing risky with a visual, herding-type dog?',
    options: [
      'It can build attachment distortion — the dog treats you as an idealised, ever-present figure rather than a calm leader',
      'It triggers the herding nip reflex — assuming maturity alone will replace structure, outlets, and handler consistency',
      'It causes eye strain in dogs bred for distance vision — even when lighter tools have not been tried consistently first',
      'It is not risky — gazing builds healthy bonds in all breeds — as entitlement rather than earned access on your terms',
    ],
    explanation: 'A herding-type dog raised on face-to-face gazing may treat their person as something beyond ordinary. Leave the room and they may vocalise, refuse food, or look depressed — attachment distortion, not a medical mystery.',
    guideLink: '#common-pitfalls'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'herding',
    track: 'both',
    text: 'Which reward approach often lands best with dogs wired to track motion?',
    options: [
      'Access training and environmental rewards, rather than treat-chasing',
      'Constant treats to keep their eyes on your hand — not the guide',
      'Long cuddle sessions after each behaviour — not the guide standard',
      'A laser pointer to channel the visual drive — not the guide',
    ],
    explanation: 'Access training and environmental rewards often land better than treat-chasing for dogs already wired to track motion.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'herding',
    track: 'both',
    text: 'Your herding-type dog vocalises persistently and refuses food whenever you leave the room. The guide\'s reading?',
    options: [
      'Likely attachment distortion — rebuild with structure, access training, and reduced face-gazing intimacy',
      'Separation anxiety that only medication can address — not the guide\'s frame for this',
      'Grief — the dog needs more comfort when you return — not the guide\'s frame for this',
      'Hunger striking to demand better food — though structure and calibration still apply throughout training',
    ],
    explanation: 'It is often attachment distortion, not a medical mystery. Structure, access training, reduced face-gazing intimacy, and environmental outlets can rebuild a healthier frame.',
    guideLink: '#common-pitfalls'
  },

  /* ── Breed: terrier / high-drive ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'terrier',
    track: 'both',
    text: 'A high-drive terrier kept as a lap companion starts destroying things. What is the guide\'s diagnosis?',
    options: [
      'Frustration from denied outlets — sniffing, running, problem-solving — not bad character',
      'Inherited destructiveness that cannot be trained out — not the guide\'s frame for this',
      'Spite for being left alone — as entitlement rather than earned access on your terms',
      'A calcium deficiency — chewing is dietary — not the guide\'s frame for this',
    ],
    explanation: 'Denying sniff, run, and problem-solving outlets builds frustration that surfaces as fixation, reactivity, or "naughty" destruction — not bad character.',
    guideLink: '#common-pitfalls'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'terrier',
    track: 'both',
    text: 'What is usually the strongest reward currency for terriers and high-drive working types?',
    options: [
      'Access — off the leash, nose to the ground, free to run and sniff, on your terms',
      'Lap time and carrying — as entitlement rather than earned access on your terms',
      'Verbal praise alone — as entitlement rather than earned access on your terms',
      'Watching other dogs play from a distance — not the guide\'s frame for this',
    ],
    explanation: 'For dogs that are highly environmentally oriented, the reward isn\'t a treat or a pat. It\'s access: getting to be a dog, on your terms.',
    guideLink: '#access'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'terrier',
    track: 'both',
    text: 'How should freedom work for a high-drive dog in access training?',
    options: [
      'Earned through trust, not default — behaviour directly controls how much freedom the dog has',
      'Unlimited — high-drive dogs need constant freedom to stay sane — misses context and timing',
      'Forbidden until the dog is fully trained — not the guide\'s frame for this',
      'Scheduled — the same off-leash time daily regardless of behaviour — not the guide standard',
    ],
    explanation: 'Freedom is not their default. It is earned through trust, held briefly, and celebrated when given. When behaviour falls short, the leash goes back on. That is clarity, not cruelty.',
    guideLink: '#access'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'terrier',
    track: 'both',
    text: 'Your terrier fixates and becomes reactive on walks. Beyond corrections, what does the guide point to?',
    options: [
      'Outlets — sniff, run, and problem-solving time, structured as earned access',
      'Avoiding all walks until the reactivity passes — misses context and timing',
      'A muzzle as the primary management tool — not the guide\'s frame for this',
      'More lap time at home to lower the drive — not the guide\'s frame for this',
    ],
    explanation: 'Frustration from denied outlets surfaces as fixation and reactivity. Access training is often the right currency for these dogs.',
    guideLink: '#common-pitfalls'
  },

  {
    topic: 'Breed temperament',
    breedCategory: 'terrier',
    track: 'both',
    text: 'A soft adolescent terrier and a hard, confident adult terrier both need the same correction technique. What differs?',
    options: [
      'The firmness and recovery time — same tools, calibrated to the dog in front of you',
      'The technique itself — terriers need entirely different methods',
      'Nothing — every dog gets identical intensity — not the guide\'s frame for this',
      'Only the verbal command used — not the guide\'s frame for this',
    ],
    explanation: 'Age and temperament together set the floor: a soft adolescent and a hard adult may need the same technique with different firmness and recovery time.',
    guideLink: '#breed-temperament'
  },

  /* ── Breed: guardian / alert ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'guardian',
    track: 'both',
    text: 'Your guardian-breed dog gives a wary glance at a stranger and you reassure it warmly. What does this build over time?',
    options: [
      'Entrenched anxiety — rewarding vigilance with reassurance teaches the dog its wariness is correct',
      'Confidence — reassurance always reduces fear — not the guide\'s frame for this',
      'Nothing — single moments don\'t shape behaviour — not the guide\'s frame for this',
      'Better guarding instincts, which is the breed\'s purpose — not the guide\'s frame for this',
    ],
    explanation: 'Framing every wary glance as "protective love" and rewarding vigilance with constant reassurance can entrench anxiety.',
    guideLink: '#common-pitfalls'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'guardian',
    track: 'both',
    text: 'What matters most for an alert, guardian-type dog according to the guide?',
    options: [
      'Calm leadership and earned access — more than comfort-talk',
      'A bigger yard to patrol — not the guide\'s frame for this',
      'Encouraging the alert barking so intruders are deterred',
      'Keeping the dog away from all strangers — not the guide',
    ],
    explanation: 'Calm leadership and earned access matter more than comfort-talk for guardian and alert breeds.',
    guideLink: '#common-pitfalls'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'guardian',
    track: 'both',
    text: 'Why does an anxious owner make a guardian breed\'s vigilance worse?',
    options: [
      'An insecure leader is one the dog feels compelled to protect — it fills the leadership gap with guarding',
      'Anxiety changes the owner\'s scent, which alarms the dog — not the guide\'s frame for this',
      'It doesn\'t — guarding is purely genetic — even when lighter tools have not been tried consistently first',
      'Anxious owners walk less, so the dog has excess energy — not the guide\'s frame for this',
    ],
    explanation: 'If you\'re anxious, the dog becomes your guardian. If you\'re calm and certain, it relaxes into being your companion. Most "difficult" behaviour disappears when owner regulation improves.',
    guideLink: '#owner-mindset'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'guardian',
    track: 'both',
    text: 'Your guardian breed fixates and stiffens at a passerby. What is the right in-the-moment response?',
    options: [
      'Correct at the precursor — butt push or downward leash jerk inside the one-second window, then calm forward posture',
      'Soothing words and slow strokes until the dog relaxes — as entitlement rather than earned access on your terms',
      'Tighten the leash and stare at the passerby yourself — as entitlement rather than earned access on your terms',
      'Turn and walk the other way every time — without the structured exposure, reset, or repetition the guide describes',
    ],
    explanation: 'Stiffening is the precursor to reaction. Interrupt physically and calmly inside the window, then move on — reassurance during vigilance rewards the wrong state.',
    guideLink: '#symptom-glossary'
  },

  {
    topic: 'Breed temperament',
    breedCategory: 'guardian',
    track: 'both',
    text: 'Your guardian breed barks continuously at the fence line. What is the in-place tool, and what is the long-term frame?',
    options: [
      'Butt push to interrupt the cycle; calm leadership and earned access so vigilance is not the dog\'s job',
      'Let it bark — alerting is the breed doing its job — not the guide\'s frame for this',
      'Reassure the dog warmly so it knows the threat is handled — not the guide\'s frame for this',
      'Shout over the barking until the dog stops — as entitlement rather than earned access on your terms',
    ],
    explanation: 'The butt push is the primary tool for in-place reactivity — the continuous bark that feeds on itself. Long-term, calm leadership matters more than comfort-talk: a dog with a secure leader does not need to run the watch.',
    guideLink: '#butt-push'
  },

  /* ── Breed: small ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'small',
    track: 'both',
    text: 'What does constant carrying and hand-feeding typically produce in a small breed?',
    options: [
      'A dog that cannot tolerate boundaries from anyone — including you',
      'A safer dog, since small breeds are fragile — not the guide',
      'A calmer dog, since its needs are always met — not the guide',
      'No effect — size makes structure unnecessary — not the guide',
    ],
    explanation: 'Carrying, hand-feeding, and excusing pushy behaviour because they are "cute" often produces a dog that cannot tolerate boundaries from anyone.',
    guideLink: '#common-pitfalls'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'small',
    track: 'both',
    text: 'Does the Gold Standard structure — waits, earned access, corrections — apply to small breeds?',
    options: [
      'Yes, fully — the standard is universal; only the delivery is calibrated to the dog\'s size',
      'No — small dogs are too fragile for any correction — not the guide\'s frame for this',
      'Only the verbal tools apply — as entitlement rather than earned access on your terms',
      'Only if the dog weighs over ten kilograms — not the guide\'s frame for this',
    ],
    explanation: 'The structure in the guide is universal — every dog needs clarity, consistency, and a calm handler. What reads as a tap on one dog may be overwhelming on another; calibrate the delivery, not the standard.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'small',
    track: 'both',
    text: 'Downward leash corrections are awkward with a very small dog. What does the guide recommend?',
    options: [
      'The stick assist — leash attached to a short stick held against the ground, pulling the dog down without upward tension',
      'Lifting the dog by the harness instead — a common misread that ignores context, timing, and what happened just before',
      'Skipping leash corrections for dogs under ten kilograms — without reading stress, rank-testing, or denied outlets first',
      'Using a longer, heavier leash for leverage — without the structured exposure, reset, or repetition the guide describes',
    ],
    explanation: 'Bolt or attach the leash to a short stick. Held against the ground, the dog is pulled down through the leash — making the downward jerk achievable and consistent.',
    guideLink: '#leash'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'small',
    track: 'both',
    text: 'Your small dog barks and snaps at visitors, and everyone laughs because it is "cute". What is actually happening?',
    options: [
      'Rank-testing that would be corrected in a big dog — the size excuse is teaching the dog that boundaries do not apply',
      'Harmless display — small dogs cannot do real damage — even when lighter tools have not been tried consistently first',
      'Fear that should be soothed with cuddles — without the structured exposure, reset, or repetition the guide describes',
      'Breed-typical behaviour that cannot be changed — not the guide\'s primary frame for this situation, age, or context',
    ],
    explanation: 'Excusing pushy behaviour because the dog is "cute" produces a dog that cannot tolerate boundaries. The same standard applies: interrupt, reposition, settle.',
    guideLink: '#common-pitfalls'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'small',
    track: 'both',
    text: 'You carry your small dog through every busy or "scary" situation. What is the likely long-term effect?',
    options: [
      'Learned dependency — over-sheltering from normal dog learning is harder to undo than to avoid',
      'Safety with no downside — small dogs should be carried near other dogs — not the guide',
      'A stronger bond, which makes training easier later — not the guide\'s frame for this',
      'No effect — carrying is neutral — as entitlement rather than earned access on your terms',
    ],
    explanation: 'Constant carrying and over-sheltering from normal dog learning is one of the classic human-baby-trap pitfalls. Undoing learned dependency is slower and harder than building the right frame early.',
    guideLink: '#common-pitfalls'
  },

  /* ── Breed: sighthound / chase ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'sighthound',
    track: 'both',
    text: 'Your sighthound is calm all day, then explodes after a rabbit mid-walk. Where does the training work actually happen?',
    options: [
      'In the precursor window — the head-snap and body-lock before the launch; no correction outruns a chase already underway',
      'Mid-chase, with louder and louder recall commands — not the guide\'s primary frame for this situation, age, or context',
      'After the chase, with a firm correction so the dog connects the two — not the guide\'s frame for this',
      'Nowhere — chase instinct cannot be managed in sighthounds — as entitlement rather than earned access on your terms',
    ],
    explanation: 'Once a sighthound launches, the correction window has closed. Read the precursor — the visual lock and weight shift — and interrupt there, inside the one-second rule.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'sighthound',
    track: 'both',
    text: 'How should correction intensity be calibrated for a typical soft-tempered sighthound?',
    options: [
      'Lighter entry — harsh delivery shuts these dogs down rather than teaching them; the standard holds, the volume drops',
      'Extra firm, because their chase drive needs matching force — as entitlement rather than earned access on your terms',
      'No corrections at all — sighthounds only respond to rewards — as entitlement rather than earned access on your terms',
      'The same fixed intensity used for every breed — not what the guide describes as the primary standard in this context',
    ],
    explanation: 'Age and breed together set the floor. Sighthounds are typically soft-tempered: the same technique applies with lighter delivery and quicker recovery — hold the standard, soften the drama.',
    guideLink: '#correction-intensity'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'sighthound',
    track: 'both',
    text: 'A greyhound sleeps most of the day. Does it still need the structure of waits and earned access?',
    options: [
      'Yes — low energy at rest does not mean low need for leadership; the chase trigger is managed by structure built in calm moments',
      'No — a lazy dog has nothing to correct — as if this narrow case overrides the wider handler standard elsewhere in the guide',
      'Only if it has already chased something — as if this narrow case overrides the wider handler standard elsewhere in the guide',
      'Structure only matters for working breeds — as if this narrow case overrides the wider handler standard elsewhere in the guide',
    ],
    explanation: 'Sighthounds are calm, even lazy, at rest — then explosive on trigger. The structure built at doors, meals, and on leash in calm moments is exactly what holds when movement flashes.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'sighthound',
    track: 'both',
    text: 'When is off-leash freedom appropriate for a chase-driven sighthound?',
    options: [
      'When it is earned and the environment is controlled — access is granted where the chase trigger can be managed, not hoped about',
      'Always — sighthounds need to run, so freedom comes first — not what the guide describes as the primary standard in this context',
      'Never — chase breeds can never be off leash anywhere — not what the guide describes as the primary standard in this context',
      'Whenever the dog has been calm for a full day — applying a one-size rule without calibrating to breed, age, or individual drive',
    ],
    explanation: 'Access training applies: freedom is earned and granted where you can hold the contract. A fenced run area manages the trigger; an open field next to a road does not.',
    guideLink: '#access'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'sighthound',
    track: 'both',
    text: 'Your sighthound failed and chased. It returns two minutes later. How do you receive it?',
    options: [
      'Calmly — leash on, access ends, no anger at the return; punishing the come-back teaches the dog not to come back',
      'With a firm correction the moment it reaches you — without reading stress, rank-testing, or denied outlets first',
      'With excited praise so it knows returning was right — as entitlement rather than earned access on your terms',
      'By ignoring it completely for the rest of the walk — as entitlement rather than earned access on your terms',
    ],
    explanation: 'Never punish the return — you would be correcting the recall, not the chase. The consequence is calm and structural: leash on, access lost, reset.',
    guideLink: '#access'
  },

  /* ── Breed: spitz / sled ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'spitz',
    track: 'both',
    text: 'Your spitz or sled type ignores recall drills it performed perfectly last week. What is the most likely reading?',
    options: [
      'Independence and boredom — repetition drills bore spitz types into defiance; earned access and varied outlets are the better currency',
      'The dog has forgotten the command and needs more identical drills — not the guide\'s primary frame for this situation, age, or context',
      'Hearing loss — vet check before anything else — as if this narrow case overrides the wider handler standard elsewhere in the guide',
      'The dog is dominant and needs a harder correction — assuming maturity alone will replace structure, outlets, and handler consistency',
    ],
    explanation: 'Spitz and sled types are independent by design. Endless repetition reads as pointless to them — structure the outcome they want (run, explore) as the earned reward instead.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'spitz',
    track: 'both',
    text: 'How should escape attempts — fence-jumping, door-darting — be treated with a spitz or sled type?',
    options: [
      'As part of the training picture from day one — thresholds, waits, and containment are core work, not an afterthought',
      'As a phase that adolescent spitz dogs grow out of — though structure and calibration still apply throughout training',
      'With punishment after the dog is recovered — not what the guide describes as the primary standard in this context',
      'By giving more freedom so escape loses its appeal — though structure and calibration still apply throughout training',
    ],
    explanation: 'Strong escape instincts are baked into the type. The front-door wait, gate manners, and earned access are the primary tools — and punishing a recovered escapee corrects the return, not the escape.',
    guideLink: '#front-door'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'spitz',
    track: 'both',
    text: 'Your spitz type "talks back" — howling and vocalising when asked to wait. What is it?',
    options: [
      'Breed-typical vocal communication — hold the standard calmly; the noise is not defiance to be punished or distress to be soothed',
      'Defiance that needs escalating correction until silent — not what the guide describes as the primary standard in this context',
      'Distress that should end the training session — assuming maturity alone will replace structure, outlets, and handler consistency',
      'A sign the dog is in pain — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
    ],
    explanation: 'Spitz types are famously vocal. Read it as information, hold the wait, and release on calm — rewarding the noise with release teaches the dog that volume opens doors.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'spitz',
    track: 'both',
    text: 'What exercise pattern suits an endurance-bred sled type that is becoming destructive at home?',
    options: [
      'Structured, earned outlets — running, pulling work, long varied walks — destruction is unmet drive, not bad character',
      'A backyard is enough if it is large — applying a one-size rule without calibrating to breed, age, or individual drive',
      'Less exercise, so the dog has less energy for destruction — as entitlement rather than earned access on your terms',
      'Free dog-park time daily, regardless of behaviour — not the guide\'s primary frame for this situation, age, or context',
    ],
    explanation: 'Endurance breeds were built to work for hours. Denied outlets, the drive surfaces as destruction or escape. The outlets are earned through structure — access training, not free-for-all.',
    guideLink: '#access'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'spitz',
    track: 'both',
    text: 'Given a spitz type\'s weak default recall, how is off-leash access structured?',
    options: [
      'Earned in controlled environments with the seven-second check-in enforced — open-country freedom may never be appropriate for some individuals',
      'Granted normally — recall trains the same in every breed — as if this narrow case overrides the wider handler standard elsewhere in the guide',
      'Never granted under any circumstances — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
      'Granted only in winter when the breed is comfortable — as if this narrow case overrides the wider handler standard elsewhere in the guide',
    ],
    explanation: 'The access contract is the same; the venue is chosen honestly. Some spitz individuals can earn open freedom, others hold it only in fenced spaces — read the dog, not the wish.',
    guideLink: '#check-in-seven'
  },

  /* ── Breed: scenthound / nose-led ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'scenthound',
    track: 'both',
    text: 'Your scenthound\'s recall is perfect at home but vanishes when its nose hits a trail. What is happening?',
    options: [
      'The nose has engaged and the ears have switched off — it is biology, not defiance; recall must be trained before the lock-on',
      'The dog is being deliberately disobedient and needs firmer punishment — not the guide\'s frame for this',
      'The dog never learned the recall properly — assuming maturity alone will replace structure, outlets, and handler consistency',
      'Scenthounds cannot be trained to recall at all — without the structured exposure, reset, or repetition the guide describes',
    ],
    explanation: 'When a scenthound\'s nose engages, recall fails on scent, not on respect. Interrupt in the precursor window — head dropping, tail rate changing — before the trail takes over.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'scenthound',
    track: 'both',
    text: 'What reward currency is usually strongest for a scenthound, and what is the catch?',
    options: [
      'Food — most are strongly food-motivated, but the treat must be high-value and reserved for training or it loses to the scent',
      'Affection — scenthounds are primarily people-focused — not what the guide describes as the primary standard in this context',
      'Toys — prey drive beats appetite in hounds — applying a one-size rule without calibrating to breed, age, or individual drive',
      'None — scenthounds do not respond to rewards — a common misread that ignores context, timing, and what happened just before',
    ],
    explanation: 'Most scenthounds are strongly food-driven, but an everyday snack cannot compete with a fresh trail. Run the treat diagnostic: rare, high-value, training-only.',
    guideLink: '#treat-diagnostic'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'scenthound',
    track: 'both',
    text: 'Your basset bays loudly at interesting smells on walks. How should this be read?',
    options: [
      'As breed-typical communication — manage the arousal with structure, but do not treat the voice itself as naughtiness',
      'As aggression that needs immediate firm correction — even when lighter tools have not been tried consistently first',
      'As separation anxiety — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
      'As a request for food — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
    ],
    explanation: 'Baying is how scenthounds communicate. Correct the behaviour you actually need changed — pulling, fixation — not the voice itself, and never reward the noise with excitement.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'scenthound',
    track: 'both',
    text: 'Where should sniffing fit in a nose-led dog\'s walk?',
    options: [
      'Structured earned access with frequent proactive thresholds — explicit sniff breaks are powerful currency, released on your cue and calibrated to the dog; pulling before release loses the break',
      'Banned entirely on nose-led walks — treating all scent work as the enemy instead of channelling drive through handler-released, earned thresholds calibrated to the individual dog\'s nose-led drive',
      'Unlimited pull-to-scent freedom — denying structure because the nose supposedly cannot be managed without cruelty on every walk, with no handler cue to resume heel',
      'Only at the very start of the walk — one release window that ignores proactive thresholds and earned breaks through the rest of the session when drive spikes',
    ],
    explanation: 'The nose is the dog\'s strongest drive — which makes sniff time powerful currency. Nose-led types often need more frequent, proactive release so heel stays coherent; the frame is still yours: earned breaks, your cue to end, no pulling into scent. See Sniff breaks.',
    guideLink: '#sniff-breaks'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'scenthound',
    track: 'both',
    text: 'Your scenthound freezes, head down, locked on a scent trail, about to launch. What is the correct response?',
    options: [
      'Interrupt now — this is the precursor window; the butt push or leash correction lands here, not after the trail takes over',
      'Wait to see whether the dog chooses to leave the trail — not the guide\'s primary frame for this situation, age, or context',
      'Call the recall repeatedly from a distance — a common misread that ignores context, timing, and what happened just before',
      'Drag the dog away while soothing it — as if this narrow case overrides the wider handler standard elsewhere in the guide',
    ],
    explanation: 'The freeze-and-lock is the precursor. The one-second rule applies: act in the window before the nose fully engages, because after that the correction teaches nothing.',
    guideLink: '#timing'
  },

  /* ── Breed: giant / livestock guardian ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'giant',
    track: 'both',
    text: 'Why are leash manners non-negotiable from day one with a giant breed puppy?',
    options: [
      'Habits cute at eight kilograms are dangerous at sixty — the standard must be set before the size arrives',
      'Giant puppies are stronger than adult dogs of other breeds — not the guide\'s frame for this',
      'They are not — giant breeds are too young to train before one year — not the guide\'s frame for this',
      'Because giant breeds cannot learn after six months — not the guide\'s frame for this',
    ],
    explanation: 'A jumping, pulling giant-breed adult is a safety problem no one can muscle through. Build the wait, the heel, and calm greetings while the dog is still small enough to correct easily.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'giant',
    track: 'both',
    text: 'Your giant or livestock guardian type ignores commands and patrols the property line instead. What is the correct reading?',
    options: [
      'Independence by design — livestock guardians were bred to decide without instruction; structure must make compliance worthwhile, not assume biddability',
      'Dominance that requires harsh confrontation — reading independent patrol as defiance instead of breed design that needs earned compliance',
      'Deafness or a medical issue — skipping the reading that livestock guardians were bred to decide without constant instruction',
      'Laziness typical of large breeds — dismissing patrol behaviour as sloth rather than independence by design that needs earned compliance and worthwhile structure',
    ],
    explanation: 'Livestock guardian breeds were selected to work alone and make their own calls. They are not defiant — they are unconvinced. Earned access and consistent structure carry more weight than repetition.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'giant',
    track: 'both',
    text: 'How does slow maturity change training expectations for a giant breed?',
    options: [
      'Adolescent testing arrives later and lasts longer — hold the same standard with patience; do not mistake a two-year-old for a finished adult',
      'It does not — all breeds mature at the same rate — treating the symptom without the calibration and accountability standard in this section',
      'Training should not start until maturity at three years — as if this narrow case overrides the wider handler standard elsewhere in the guide',
      'Slow maturity means corrections are never appropriate — as if this narrow case overrides the wider handler standard elsewhere in the guide',
    ],
    explanation: 'Giant breeds can be developmentally adolescent well past two. The standard holds throughout — but read rank-testing as developmental, correct it calmly, and expect the arc to be longer.',
    guideLink: '#breed-age-intensity'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'giant',
    track: 'both',
    text: 'Your giant breed leans on visitors and pushes through doorways first. Why does this matter more than in a small dog?',
    options: [
      'The same rank-testing is physically unmanageable at this size — thresholds and body-space rules are safety equipment, not etiquette',
      'It does not matter more — size is irrelevant to structure — not what the guide describes as the primary standard in this context',
      'Giant breeds lean as affection and should be allowed — a common misread that ignores context, timing, and what happened just before',
      'Because visitors might be allergic — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
    ],
    explanation: 'Shoulder-barging and leaning are the same boundary tests every dog runs — but at sixty kilograms they knock people over. The front-door wait and butt push apply with full consistency.',
    guideLink: '#front-door'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'giant',
    track: 'both',
    text: 'A livestock guardian type barks at every passer-by from the yard. What does the guide-aligned response look like?',
    options: [
      'Butt push to interrupt the cycle; calm leadership and earned access so the dog stops running the watch alone',
      'Reassure the dog warmly each time so it feels safe — as entitlement rather than earned access on your terms',
      'Encourage it — guarding is what the breed is for — as entitlement rather than earned access on your terms',
      'Leave it outside more so barking loses novelty — as entitlement rather than earned access on your terms',
    ],
    explanation: 'Guardian instinct plus no leadership equals a dog on permanent duty. Interrupt the rehearsal with a butt push, correct and move on — then build calm leadership so vigilance is not the dog\'s job. Save warm affirmation for earned calm, not during or just after the reactive episode.',
    guideLink: '#butt-push'
  },

  // ── Body language (gesture identification) ────────────────────────────────
  {
    topic: 'Body language',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog turns its head away from you but keeps watching — the whites of its eyes clearly visible. What does this usually mean?',
    options: [
      'Discomfort or conflict avoidance — the dog is stressed and not ready for interaction',
      'Playfulness — the dog wants to chase and is inviting a game despite the averted head and visible whites',
      'Dominance — the dog is challenging you and showing rank through the turned-away stare and tense body',
      'Tiredness — the dog needs a nap and the whale eye is simply fatigue at the threshold',
    ],
    explanation: 'Whale eye — whites visible with head turned away — is a stress signal. Pair with stiff body or weight back before engaging. See Symptom glossary.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Body language',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog yawns at the front door when you arrive home, with no sign of tiredness. What is the most likely meaning?',
    options: [
      'Displacement stress — tension release, not tiredness',
      'The dog is bored and wants to go for a walk',
      'The dog is hungry and wants dinner — not the guide',
      'The dog is relaxed and happy to see you — reading displacement at the threshold as contentment instead of tension release',
    ],
    explanation: 'Yawning is displacement stress, not necessarily tiredness — often seen at thresholds: doorways, greetings, before a correction lands.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Body language',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog licks its lips repeatedly when no food is present and you have just leaned toward them. What does this signal?',
    options: [
      'Appeasement or stress processing — the nervous system managing discomfort',
      'The dog is hungry and wants a treat — not the guide\'s frame for this',
      'The dog has tasted something on the floor — a common handler misread here',
      'The dog is about to bark playfully — not the guide\'s frame for this',
    ],
    explanation: 'Lip licking is displacement or appeasement — nervous system processing stress. Watch what happened in the second before.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Body language',
    breedCategory: 'all',
    track: 'both',
    text: 'As you reach to pet your dog, their body stiffens and weight shifts onto their back legs. What should you do?',
    options: [
      'Create space — they are not ready for interaction; wait or approach differently',
      'Pet them anyway to show you mean no harm — not the guide\'s frame for this',
      'Give a verbal correction for being unfriendly — not the guide\'s frame for this',
      'Offer a treat to change their mind — not the guide\'s frame for this',
    ],
    explanation: 'Stiff posture with weight back means not ready for interaction. The three-second pause exists to catch this before you push through.',
    guideLink: '#three-second-pause'
  },
  {
    topic: 'Body language',
    breedCategory: 'all',
    track: 'both',
    text: 'One dog approaches another with hackles raised and a stiff, silent body. What does this usually indicate?',
    options: [
      'Escalation precursor — real conflict risk, not healthy play',
      'Healthy excitement before a play bow — not the guide',
      'Submission — the dog is yielding space — not the guide',
      'Indifference — the dogs will ignore each other',
    ],
    explanation: 'Stiff approach with sustained hackles and silent hard staring are early conflict flags. See Dog meetings and Symptom glossary.',
    guideLink: '#dog-meetings'
  },
  {
    topic: 'Body language',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog drops into a play bow — elbows down, rear up — but the body stays stiff and the stare is fixed. What does this mean?',
    options: [
      'Not a reliable play invitation — ambiguous; read tail, movement, and what happens next before engaging',
      'Clear invitation to play — always safe to engage whenever the elbows drop and the rear rises',
      'Confirmed calming signal — always safe to engage because appeasement shapes always mean relaxation',
      'Confirmed aggression — immediate separation required because any stiff bow always precedes a fight',
    ],
    explanation: 'The posture mimics a play bow, but stiffness and a fixed stare are not a safe play invite. The same shape can mean appeasement, stress, calming, or predatory arousal — context decides. A loose, bouncy bow is genuine play language. Do not assume play or that a fight is already underway.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Body language',
    breedCategory: 'all',
    track: 'both',
    text: 'After a tense greeting with a stranger, your dog does a full-body shake-off. What does this usually mean?',
    options: [
      'Stress reset — the dog marking that a moment has passed',
      'The dog is wet or uncomfortable from the collar',
      'The dog wants to play with the stranger — treating a post-stress shake-off as an invitation rather than a reset marker',
      'The dog is about to lunge — misses context and timing',
    ],
    explanation: 'Shake-off is reset after stress. Repeated shake-offs without settling may mean ongoing load.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Body language',
    breedCategory: 'all',
    track: 'both',
    text: 'Your adolescent dog repeatedly pushes past you through doorways and into your space shoulder-first. What is this behaviour?',
    options: [
      'Rank or momentum testing — information to correct early, not a personality flaw',
      'Affection — the dog wants to be close to you — not the guide\'s frame for this',
      'Fear — the dog is trying to hide behind you — not the guide\'s frame for this',
      'Playfulness that should be encouraged — not the guide\'s frame for this',
    ],
    explanation: 'Shoulder barging tests rank or momentum. Treat as information and correct early — collar grab or butt push depending on the behaviour.',
    guideLink: '#symptom-glossary'
  },

  // ── Relationship habits ───────────────────────────────────────────────────
  {
    topic: 'Relationship habits',
    breedCategory: 'all',
    track: 'both',
    text: 'When you arrive home, your dog greets you with frantic helicopter tail-wagging and jumping. What does the guide recommend?',
    options: [
      'Enter quietly, ignore for about sixty seconds, engage only after calm with four paws on the floor',
      'Match their energy immediately so they feel loved — rewarding helicopter arousal at the threshold with excited engagement',
      'Give a verbal correction for jumping every time — nagging at full arousal instead of waiting for calm body first',
      'Ignore the dog permanently — no greeting ever, treating a structured sixty-second pause as lifelong withdrawal',
    ],
    explanation: 'Matching frantic greeting energy raises the arousal baseline. Wait for settled body before engaging — calm earns connection.',
    guideLink: '#home-return'
  },
  {
    topic: 'Relationship habits',
    breedCategory: 'all',
    track: 'both',
    text: 'Why does the guide recommend a three-second pause before petting or approaching your dog?',
    options: [
      'To read micro-signals — ears, eyes, weight — before pushing into an interaction they cannot comfortably exit',
      'To make the dog wait as a dominance display — even when lighter tools have not been tried consistently first',
      'Because dogs cannot process touch for three seconds after movement — not the guide\'s frame for this',
      'To build anticipation for a treat reward — not the guide\'s primary frame for this situation, age, or context',
    ],
    explanation: 'The pause lets you read comfort level. Ignoring micro-signals leads to learned helplessness and behaviour owners call "snapping out of nowhere."',
    guideLink: '#three-second-pause'
  },
  {
    topic: 'Relationship habits',
    breedCategory: 'all',
    track: 'both',
    text: 'Why is practising commands only in a quiet living room insufficient?',
    options: [
      'Dogs do not generalize easily — real progress happens when you reinforce spontaneous good choices in real environments',
      'Living rooms are too small for proper training — not what the guide describes as the primary standard in this context',
      'Treats do not work indoors — treating the symptom without the calibration and accountability standard in this section',
      'Dogs cannot hear commands in quiet spaces — without the structured exposure, reset, or repetition the guide describes',
    ],
    explanation: 'Carry reserved treats on real outings. Catch and reward spontaneous good choices — looking at you instead of a trigger, waiting without a prompt.',
    guideLink: '#expectations'
  },
  {
    topic: 'Relationship habits',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog does not sit on the first "sit" cue. What does the guide instruct?',
    options: [
      'Read whether they heard — ears, head turn, huff — then at most one sharper repeat if fixation explains it; otherwise guide with body or leash. Never a third verbal cue',
      'Repeat the command calmly until the dog complies — patience teaches reliability — collapsing the standard because excitement, age, or friendliness feels like an excuse',
      'Assume defiance immediately and escalate to pin and hold — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
      'Say sit a third time louder — three tries is the fair standard — a handler shortcut that skips the structure, timing, and repetition the guide expects here',
    ],
    explanation: 'Learn your dog\'s heard-it signals. Fixation may warrant one escalated second cue; otherwise treat silence as renegotiation and guide physically. A third repeat validates the game and puts the dog in charge.',
    guideLink: '#cue-once'
  },
  {
    topic: 'Relationship habits',
    breedCategory: 'all',
    track: 'both',
    text: 'Why must a command never be repeated a third time?',
    options: [
      'It validates boundary renegotiation and turns compliance into a game the dog can win — you end up being led',
      'Dogs cannot process language after the second repetition — a cognitive limit the guide does not describe for cue games',
      'The third repeat is when physical correction becomes illegal — a rule about tools, not about boundary renegotiation',
      'It is only a problem for puppies under seven months — an age exception the guide does not grant once renegotiation starts',
    ],
    explanation: 'Two verbal attempts at most when fixation may explain the miss. A third repeat teaches the dog that holding out works — that is renegotiation, not training.',
    guideLink: '#cue-once'
  },
  {
    topic: 'Relationship habits',
    breedCategory: 'all',
    track: 'both',
    text: 'How should sniffing fit into a structured on-lead walk?',
    options: [
      'Balance earned breaks with proactive release — heel earns explicit sniff breaks, but grant scent access when the dog needs a threshold to refocus; calibrate frequency to age and drive; pulling before release loses the break',
      'Sniffing should be banned on-lead — it causes pulling and breaks heel — treating all scent work as the enemy instead of earned, handler-released breaks calibrated to age, drive, and proactive thresholds',
      'Let the dog pull to every scent — denying the nose is cruel — unlimited pull-to-scent that removes structure, your cue to resume heel, and any earned-break frame the guide builds on walks',
      'Hold rigid heel until a fixed distance is covered, then allow one sniff at the end — one release window that ignores proactive thresholds when the dog needs to refocus mid-walk, with no handler cue to resume heel',
    ],
    explanation: 'Scenting is how dogs decompress — not a prize withheld until exhaustion. Structure still holds: you release on your cue, heel resumes on yours, and pulling toward scent before release costs the break. Proactively grant short thresholds when puppies, adolescents, or nose-led dogs need them so focus stays coherent. See Sniff breaks.',
    guideLink: '#sniff-breaks'
  },
  {
    topic: 'Relationship habits',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog shows discomfort around a stranger reaching to pet them. What builds trust?',
    options: [
      'Step in, create distance, and be a calm anchor — do not push them through for others',
      'Encourage the stranger to keep petting so the dog learns people are safe',
      'Pick the dog up and reassure them with baby talk — not the guide\'s frame for this',
      'Leave immediately and avoid all strangers forever — not the guide\'s frame for this',
    ],
    explanation: 'Trust is earned by advocating for the dog. Love without consistent advocacy does not build the trust reactive dogs need.',
    guideLink: '#trust-not-just-love'
  },

  // ── Equipment ─────────────────────────────────────────────────────────────
  {
    topic: 'Equipment',
    breedCategory: 'all',
    track: 'both',
    text: 'Which collar types does the guide prefer for pressure-and-release communication?',
    options: [
      'Flat collar or properly positioned slip lead',
      'Chest harness with front clip — equipment that invites sustained opposition reflex instead of pressure-and-release communication',
      'Prong collar for strong pullers — default heavy tool before lighter structure and calibration have been tried consistently',
      'Heavy choke chain for instant control',
    ],
    explanation: 'Flat collar and properly used slip lead allow precise, instant pressure-and-release that teaches the dog to choose calm.',
    guideLink: '#collar-selection'
  },
  {
    topic: 'Equipment',
    breedCategory: 'all',
    track: 'both',
    text: 'Under what conditions might a head halter be appropriate in this methodology?',
    options: [
      'Strictly as a temporary safety brake — extreme handler/dog size mismatch or severe handler physical limitation',
      'As the default collar for all reactive dogs from day one — not the guide\'s frame for this',
      'Whenever the dog pulls on walks — a common misread that ignores context, timing, and what happened just before',
      'Only for puppies under six months — without the structured exposure, reset, or repetition the guide describes',
    ],
    explanation: 'The head halter is never a core teaching tool — only a temporary management device for handler safety or breaking an explosive visual lock.',
    guideLink: '#head-halter'
  },
  {
    topic: 'Equipment',
    breedCategory: 'all',
    track: 'both',
    text: 'Why does the guide exclude chest harnesses?',
    options: [
      'They trigger the opposition reflex — encouraging the dog to pull harder against pressure on the chest',
      'They are too expensive for most owners — as entitlement rather than earned access on your terms',
      'Dogs cannot sit while wearing a harness — as entitlement rather than earned access on your terms',
      'Harnesses only work on small breeds — even when lighter tools have not been tried consistently first',
    ],
    explanation: 'Chest harnesses wrap the strongest parts of the body and engage the opposition reflex — communicating pull, not cooperation.',
    guideLink: '#collars-excluded'
  },
  {
    topic: 'Equipment',
    breedCategory: 'all',
    track: 'both',
    text: 'Why are spiked / prong collars excluded from this methodology?',
    options: [
      'Sharp pain triggers fight-or-flight and closes the brain to calm, accountable learning',
      'They are illegal in all countries — not the guide\'s frame for this',
      'Dogs become immune to prong pressure after one week — not the guide\'s frame for this',
      'They only work on thick-coated breeds — not the guide\'s frame for this',
    ],
    explanation: 'Pain spikes arousal and anxiety. A dog cannot learn accountability if its brain is wired shut by pain — see Collar selection.',
    guideLink: '#collars-excluded'
  },
  {
    topic: 'Equipment',
    breedCategory: 'all',
    track: 'both',
    text: 'Why are bungee leashes excluded?',
    options: [
      'Elastic delays pressure and release — the dog cannot learn the exact millisecond it made the correct choice',
      'They are too short for large breeds — not what the guide describes as the primary standard in this context',
      'Dogs are afraid of the bouncing sensation — even when lighter tools have not been tried consistently first',
      'They prevent the handler from holding the leash at all — not the guide\'s frame for this',
    ],
    explanation: 'Bungee leashes stretch before the dog feels pressure and snap back slowly after — muddying the pressure-and-release conversation.',
    guideLink: '#leash-selection'
  },
  {
    topic: 'Equipment',
    breedCategory: 'all',
    track: 'both',
    text: 'Why are extending / Flexi leashes excluded?',
    options: [
      'They maintain constant tension and teach the dog that pulling equals freedom',
      'They are banned by local council bylaws everywhere — not the guide standard',
      'Dogs cannot smell properly on a long line — not the guide\'s frame for this',
      'They only break in cold weather — not the guide\'s frame for this',
    ],
    explanation: 'Extending leashes rely on spring tension — the dog must push forward to get line. That builds permanent pulling habits and eliminates handler control.',
    guideLink: '#leash-selection'
  },
  {
    topic: 'Equipment',
    breedCategory: 'all',
    track: 'both',
    text: 'What does a loose "U" shape in the leash between your hand and the dog\'s neck indicate?',
    options: [
      'The line weight is matched and the dog is regulating space — choosing cooperation on slack',
      'The leash is too long and must be replaced — not the guide\'s frame for this',
      'The dog is about to bolt — even when lighter tools have not been tried consistently first',
      'You are holding the leash incorrectly — not the guide\'s frame for this',
    ],
    explanation: 'The dangle is your dashboard — a properly weighted line loops in a U when the dog walks cooperatively on slack.',
    guideLink: '#leash-weight'
  },
  {
    topic: 'Equipment',
    breedCategory: 'all',
    track: 'both',
    text: 'When delivering a low-line corrective tug, where should your hand be positioned?',
    options: [
      'Below the dog\'s neck line — angling pressure downward and sideways, not upward at the throat',
      'Above the dog\'s head for maximum leverage — not the guide\'s frame for this',
      'At full arm extension behind you — as entitlement rather than earned access on your terms',
      'Wrapped twice around your wrist for security — not the guide\'s frame for this',
    ],
    explanation: 'Low-line correction drops the hand below neck level — disrupting momentum without choking or triggering an upward pull reflex.',
    guideLink: '#leash-handling'
  },

  // ── Adult expectations ("I don't care") ───────────────────────────────────
  {
    topic: 'Adult expectations',
    breedCategory: 'all',
    track: 'both',
    text: 'From roughly seven months onward, what does the "I don\'t care" rule mean?',
    options: [
      'The adult standard holds — nervousness and excitement do not excuse bolting, jumping, acting without permission, or walking ahead',
      'The handler should ignore the dog entirely until it is two years old — as entitlement rather than earned access on your terms',
      'All corrections stop because the dog is now an adult — without the structured exposure, reset, or repetition the guide describes',
      'Only fear-based behaviour gets a pass — excitement still requires structure — not the guide\'s frame for this',
    ],
    explanation: 'I don\'t care is the adult standard I\'m over it enforces. Past seven months, puppy excuses are closed — the line holds calmly.',
    guideLink: '#i-dont-care'
  },
  {
    topic: 'Adult expectations',
    breedCategory: 'all',
    track: 'both',
    text: 'How does "I don\'t care" relate to "I\'m over it"?',
    options: [
      'I\'m over it is the attitude; I don\'t care is the adult standard that attitude enforces from seven months onward',
      'They mean the same thing and can be used interchangeably — not the guide\'s frame for this',
      'I don\'t care replaces I\'m over it once the dog is an adult — not the guide\'s frame for this',
      'I\'m over it applies only to puppies; I don\'t care applies only to seniors — not the guide\'s frame for this',
    ],
    explanation: 'I\'m over it is calm certainty that misbehaviour cannot win. I don\'t care names the non-negotiable adult rules that attitude protects.',
    guideLink: '#i-dont-care'
  },
  {
    topic: 'Adult expectations',
    breedCategory: 'all',
    track: 'both',
    text: 'An eight-month-old dog surges through the front door because it is "excited for the walk." What does the guide say?',
    options: [
      'Reset — back inside, sit, wait. Excitement is not a reason to bolt; the I don\'t care standard applies',
      'Let it go — excitement at the door is normal for young dogs — not the guide\'s frame for this',
      'Only correct if someone is watching — even when lighter tools have not been tried consistently first',
      'Switch to a harness so the surge does not hurt the neck — not the guide\'s frame for this',
    ],
    explanation: 'No bolting through doors — wait, permission, then move. For dogs over seven months, nervous or excited is not an excuse.',
    guideLink: '#front-door'
  },
  {
    topic: 'Adult expectations',
    breedCategory: 'all',
    track: 'both',
    text: 'A nine-month-old dog jumps on visitors "because it is friendly." What is the guide-aligned response?',
    options: [
      'Hold the standard — four paws down or collar grab reset. Friendly excitement is not an excuse',
      'Allow jumping on people the dog knows well — not the guide\'s frame for this',
      'Redirect with treats only — no physical correction after seven months — not the guide',
      'Keep the dog in another room permanently — not the guide\'s frame for this',
    ],
    explanation: 'No jumping on people — the I don\'t care rule applies. Compassion does not mean collapsing the standard.',
    guideLink: '#i-dont-care'
  },
  {
    topic: 'Adult expectations',
    breedCategory: 'all',
    track: 'both',
    text: 'On a walk, an adult dog repeatedly cuts in front of you, pulling ahead with excitement. What does the guide expect?',
    options: [
      'Reset position — the dog walks beside or slightly behind; excitement does not excuse surging ahead',
      'Allow it — a happy dog should lead the walk — not the guide\'s frame for this',
      'Switch to a Flexi leash for more freedom — as entitlement rather than earned access on your terms',
      'Stop walking until the dog is over one year old — not the guide\'s frame for this',
    ],
    explanation: 'You lead. Cutting in front is not excused by excitement — see I don\'t care and Leash & line.',
    guideLink: '#leash'
  }
];
