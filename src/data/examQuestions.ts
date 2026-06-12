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
      'It builds the muscle the dog needs to hold long sits and waits'
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
      'The dog should be free to make its own choices once basic obedience is solid'
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
      'The end of the training moment; what happens next is up to the dog'
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
      'Removing all rewards so the dog obeys out of habit alone'
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
      'That you are paying it the attention it deserves',
      'A clear signal that you are in charge and alert',
      'Nothing — dogs cannot perceive human emotional states'
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
      'Move calmly to the dog\'s side within reach',
      'Apply a correction inside the one-second window',
      'Return to a calm, forward-facing posture after correcting'
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
      'Wait where you are and keep calling in an increasingly firm voice'
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
      'With enthusiastic petting and a high, happy voice',
      'By immediately throwing another treat further away',
      'By unclipping the leash as the recall reward'
    ],
    explanation: 'Reward with the treat at your feet — affection can follow once the dog is calm at your side. Excited cuddling re-elevates the energy you just called them out of.',
    guideLink: '#go-get-recall'
  },
  {
    topic: 'Owner mindset',
    breedCategory: 'all',
    track: 'both',
    text: 'What attitude does the "I\'m over it" rule describe?',
    options: [
      'Calm certainty that misbehaviour does not move you, entertain you, or win',
      'Giving up on a behaviour that the dog refuses to learn',
      'Cold withdrawal of affection until the dog improves',
      'Performed anger that shows the dog you are serious'
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
      'It warns nearby people that the dog is in training',
      'The volume of your voice startles the dog into compliance'
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
      'Standing rigid with a tight grip on the leash at all times',
      'Crouching at the dog\'s level so you can grab the collar faster',
      'A relaxed stroll where you deliberately ignore the dog'
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
      'The dog\'s weight could pull you off balance during a correction',
      'It transfers your scent and confuses the other dog',
      'Leaning is always the first stage of a guarding behaviour'
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
      'Failures of planning that a good owner avoids entirely',
      'Situations where training rules are temporarily suspended',
      'Tests that the dog should only face after a year of training'
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
      'Proof the method is wrong for this dog',
      'Deliberate defiance that needs a firmer correction',
      'A medical problem that needs a vet visit first'
    ],
    explanation: 'A dog under load may look worse before it looks better. That is not failure — it is often the visible edge of learning.',
    guideLink: '#reading-dog'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog licks its lips when no food is around. What is the typical meaning?',
    options: [
      'Displacement or appeasement — processing stress, uncertainty, or a recent correction',
      'Hunger — the dog is asking for its meal',
      'A precursor to a bite — remove the dog immediately',
      'Simple boredom with the session'
    ],
    explanation: 'Lip licking is displacement or appeasement — the nervous system processing stress. Watch what happened in the second before.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog is panting with no heat and no exertion. What does this usually indicate?',
    options: [
      'Stress arousal — the body cooling an activated mind',
      'Thirst — offer water and continue',
      'Contentment and relaxation',
      'The early stage of kennel cough'
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
      'The dog is teething and needs chew toys',
      'Affection — adult mouthing is a compliment',
      'A prey-drive behaviour that cannot be trained out'
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
      'Treat it as defiance and escalate the correction',
      'End all training for at least a week',
      'Repeat the command louder until it lands'
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
      'Playfulness that should be encouraged',
      'A sign the dog needs more food'
    ],
    explanation: 'Often rank, arousal, or overstimulation — not always sexual. It spikes in adolescence and when structure loosens.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'A dog yawning at a doorway or before a greeting most likely indicates:',
    options: [
      'Displacement stress — a tension release or self-regulation attempt',
      'Tiredness — the dog needs a nap before continuing',
      'Boredom with the routine',
      'Low blood sugar'
    ],
    explanation: 'Yawning is displacement stress, not necessarily tiredness — often seen at thresholds: doorways, greetings, before a correction lands.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'After a tense greeting, a dog does a full-body shake-off. What does this usually mean?',
    options: [
      'A reset — the dog marking that a stressful moment has passed',
      'The dog is wet or itchy',
      'An attempt to remove the collar',
      'The first stage of a seizure — call a vet'
    ],
    explanation: 'Shake-off is reset after stress. Repeated shake-offs without settling may mean ongoing load.',
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
      'It is relaxed and comfortable',
      'It is about to attack'
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
      'Restrict water before greetings'
    ],
    explanation: 'Submissive urination is deference under pressure — often triggered by greeting, looming, or a sharp voice. Lower your energy and rebuild through small wins.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'Which play bow is a warning sign rather than an invitation?',
    options: [
      'A stiff bow with a fixed stare',
      'Elbows down, rear up, fluid movement',
      'A bow followed by a bouncy retreat',
      'A bow with a loose, wagging body'
    ],
    explanation: 'A play bow with a loose body is an invitation. A stiff bow with a fixed stare is ambivalent — pair it with tail, movement, and what happens next.',
    guideLink: '#symptom-glossary'
  },
  {
    topic: 'Reading signals',
    breedCategory: 'all',
    track: 'both',
    text: 'How should you read eye contact between dogs?',
    options: [
      'Brief soft glances are healthy check-ins; a hard sustained stare is a challenge or fixation',
      'All eye contact between dogs is aggression and must be interrupted',
      'Staring is how dogs show affection to each other',
      'Eye contact carries no meaning — watch the tail instead'
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
      'The dog is being calm and polite',
      'A normal rest position after exercise',
      'Submission — the moment has already resolved itself'
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
      'Normal calm behaviour — continue as planned'
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
      'Structure only matters once trauma signals have fully disappeared'
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
      'Pulled your dog away at the first sound',
      'Shouted to interrupt before contact was made',
      'Corrected your dog afterwards for engaging'
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
      'Noise and rumbling that ends with both dogs settling',
      'Role reversal during wrestling, with pauses',
      'One dog yielding and the other accepting the yield'
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
      'That you will always protect it, which builds confidence',
      'That meetings should be calm — the message lands as intended',
      'Nothing — leash pressure is invisible to a dog mid-greeting'
    ],
    explanation: 'Your anxiety makes it worse. Hold structure, read the body, and act when the picture is clearly wrong — not when your nerves say so.',
    guideLink: '#dog-meetings'
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
      'Any expression of displeasure, including sighing and scolding'
    ],
    explanation: 'Corrections are not punishment in anger — they are fast, calm interruptions used inside the one-second window.',
    guideLink: '#corrections'
  },
  {
    topic: 'Corrections',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog is fixating and yap-barking in place at a trigger. Which tool is designed for exactly this?',
    options: [
      'The butt push — a firm sideways push to the hindquarters that breaks the cycle',
      'The pin and hold',
      'A treat lure to draw attention away',
      'Picking the dog up and carrying it past the trigger'
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
      'Watch the dog closely to see what it does next',
      'Praise warmly so the dog knows the correction is over',
      'Repeat the push once more to make sure the message landed'
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
      'Sustained sideways tension to steer the dog away'
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
      'A long, drawn-out "Nooooo" so the dog hears the disapproval',
      'Repeating the word, raising the volume each time',
      'A gentle, soothing tone so the dog does not get scared'
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
      'Push the dog off with your knee and turn away',
      'Ask the visitor to ignore the dog until it stops',
      'Pull the leash upward to lift the front paws off the person'
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
      'Any time the dog growls at a family member',
      'Once the dog is over two years old'
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
      'Use the word on its own from day one — dogs learn words quickly',
      'Use a different word each time so the dog generalises',
      'Say the word after the physical correction as a closing marker'
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
      'Clear leadership and control',
      'Nothing — dogs only respond to voice commands',
      'That the walk is nearly over'
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
      'It tells the dog you have stopped paying attention',
      'It signals to other owners that your dog is friendly',
      'It reduces wear on the collar and lead'
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
      'It is purely about obedience competition rules',
      'Dogs behind you cannot see triggers and so cannot react',
      'It keeps the dog out of the way of other walkers'
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
      'Switch to a harness and pull backwards instead',
      'Use upward pressure — gentler but in the available direction',
      'Skip physical corrections and rely on treats'
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
      'The dog gets a verbal warning and one more chance',
      'You end the walk and go straight home in silence',
      'You withhold dinner that evening so the lesson lands'
    ],
    explanation: 'Misbehaviour costs access: leash on, calm disappointed tone — not anger, not a lecture. Clip on, reset, walk on without dwelling on it.',
    guideLink: '#access'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'You unclip the leash. What should the dog do?',
    options: [
      'Still wait — release from the leash is not release to run; they hold until you say go',
      'Run immediately — that is the whole point of unclipping',
      'Sit for exactly seven seconds, then leave',
      'Stay within one metre of you for the rest of the outing'
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
      'A rare, high-value treat the dog hasn\'t been overexposed to — like dried liver',
      'The dog\'s normal kibble, so rewards stay consistent with meals',
      'Large treats, so the reward takes longer to eat',
      'Whatever is cheapest, since quantity matters more than quality'
    ],
    explanation: 'Use a rare, high-value treat. The rarer the treat, the stronger its value as a reward signal.',
    guideLink: '#rewards'
  },
  {
    topic: 'Access & rewards',
    breedCategory: 'all',
    track: 'both',
    text: 'Your dog is not food-motivated. What does the guide say to do?',
    options: [
      'Identify what the dog actually wants — access, play, or social interaction — and use that',
      'Withhold meals until food becomes motivating',
      'Train without rewards; obedience should not depend on payment',
      'Keep trying different treats until one works'
    ],
    explanation: 'Not every dog is food-motivated. A dog that wants to run gets to run when it behaves. For environmental drives, access training is often the primary currency.',
    guideLink: '#rewards'
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
      'Verbal praise only works when paired with a treat'
    ],
    explanation: '"Good boy" during or just after a reactive episode rewards the episode. Save verbal praise for calm, correct behaviour — delivered calmly.',
    guideLink: '#rewards'
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
      'As long as the dog remembers the event — often hours'
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
      'A delayed but still effective lesson, if you show the dog the shoe',
      'Reinforcement of your leadership, even without association',
      'Prevention — the dog will avoid shoes to avoid the correction'
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
      'Precursors last longer, giving you more time'
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
      'Correct anyway; better late than never',
      'End the outing as a consequence',
      'Recreate the situation so you can correct it properly'
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
      'Close the door on the leash to physically block the dog'
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
      'Only the front door of the house',
      'Only doors that lead to roads or hazards',
      'Doorways at home, but not gates or vehicles'
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
      'Checking your dog\'s collar fit every seven days',
      'Calling the dog back to you every seven minutes on a walk',
      'A seven-second sit before every meal'
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
      'All puppies, regardless of temperament',
      'Adult dogs with solid recall',
      'Any dog that has failed the check-in twice'
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
      'One long session every weekend',
      'Intensive training only when problems appear',
      'Formal sessions only — casual walks should stay rule-free'
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
      'It is fine as long as one person holds the standard',
      'Dogs understand that different people have different rules',
      'Affection from family members never affects training'
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
      'As a hard deadline — dogs that take longer need a different method',
      'As a minimum — no dog consolidates faster than three weeks',
      'As irrelevant — timelines play no part in training'
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
      'Butt push → verbal pop → pin & hold → collar grab → shocking squeeze',
      'Collar grab → leash jerk → verbal pop → pin & hold → shocking squeeze',
      'Verbal pop → collar grab → butt push → pin & hold → shocking squeeze'
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
      'Any disobedience in public, and repeated barking at home',
      'House-soiling, and pulling on the leash',
      'First-time offences, so the lesson lands immediately'
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
      'A pushy adult whose boundary negotiation has become engaging sport'
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
      'Breed popularity, coat colour, and sex',
      'Time of day, weather, and how long the walk has been',
      'Only the severity of the behaviour being corrected'
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
      'Puppies should never receive any physical correction of any kind',
      'Puppies need harder corrections because they forget quickly',
      'The same intensity as adults, since the technique is identical'
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
      'A personal challenge that calls for sustained pressure until submission',
      'A medical issue — adolescents do not test boundaries',
      'A sign training has failed and should restart from scratch'
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
      'Identical handling to any confident adult'
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
      'It is held until the dog vocalises, proving the message landed',
      'Nothing — the guide forbids any firm correction'
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
      'An attack that should have been interrupted before contact',
      'Play that got out of hand',
      'Evidence the adult dog is dangerous around young dogs'
    ],
    explanation: 'A clear correction from a calm, experienced dog is dog-to-dog boundary-setting in a language humans often misread. Compassionate hardline between dogs is not cruelty.',
    guideLink: '#dog-meetings'
  },
  {
    topic: 'Calibration & escalation',
    breedCategory: 'all',
    track: 'trainer',
    text: 'What is the difference in response between a failed seven-second check-in and a full bolt?',
    options: [
      'Failed check-in while in range: immediate leash-on, no chase. Full bolt: longer joyless pursuit, then calm reset',
      'Both require the same long pursuit at a casual pace',
      'Both require waiting where you are until the dog returns',
      'Failed check-in: long pursuit. Full bolt: leash-on when convenient'
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
      'Channel the anger into the correction so the dog feels the seriousness',
      'Hand the leash to someone else and walk away permanently',
      'Continue exactly as before; emotions are irrelevant to technique'
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
      'The daily toolkit is legally required before any correction',
      'Escalation works faster, so it should be saved for special occasions',
      'The dog must consent to each rung in turn'
    ],
    explanation: 'When lighter tools have not been tried consistently, escalation is not appropriate. If nothing in the daily toolkit is landing, that is a session conversation.',
    guideLink: '#when-not-firmer'
  },

  /* ── Breed: clingy / people-focused ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'clingy',
    track: 'both',
    text: 'Your people-focused dog (staffy-type) needs a correction. What must stay true about the delivery?',
    options: [
      'Calm and matter-of-fact, never personal — these dogs are susceptible to emotional damage from harsh rejection',
      'Extra firm, because clingy dogs ignore soft corrections',
      'Skipped entirely — corrections damage bonded dogs',
      'Followed by prolonged coldness so the lesson sinks in'
    ],
    explanation: 'Staffy-types bond intensely and can be damaged by corrections delivered with frustration or cold withdrawal. The tools still apply; the energy stays calm and matter-of-fact.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'clingy',
    track: 'both',
    text: 'After a reset, how quickly should you rebuild warmth with a clingy, people-focused dog?',
    options: [
      'Quickly — structure without warmth can read as abandonment to these dogs',
      'Not for several hours, so the correction is not undone',
      'Never during training phases',
      'Only after the dog offers an apology behaviour'
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
      'Genuine trauma that requires stopping all corrections',
      'Normal behaviour for a bonded dog — keep comforting',
      'A medical issue that needs a vet before training continues'
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
      'Off-leash access to chase wildlife',
      'Loud, excited verbal praise during reactions',
      'Food only — affection has no reward value'
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
      'It is fine for bonded breeds — closeness is what they need',
      'It is forbidden for all dogs in all circumstances',
      'It only matters for dogs over twenty kilograms'
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
      'Once the dog starts moving toward the trigger',
      'Only when barking begins',
      'After the lunge, when the behaviour is undeniable'
    ],
    explanation: 'Collies and other herding types may lock onto movement — eye contact can become a full fixation before the body moves. Watch for the eye-lock before the lunge.',
    guideLink: '#breed-temperament'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'herding',
    track: 'both',
    text: 'Why is extended face-to-face gazing risky with a visual, herding-type dog?',
    options: [
      'It can build attachment distortion — the dog treats you as an idealised, ever-present figure rather than a calm leader',
      'It triggers the herding nip reflex',
      'It causes eye strain in dogs bred for distance vision',
      'It is not risky — gazing builds healthy bonds in all breeds'
    ],
    explanation: 'A collie raised on face-to-face gazing may treat their person as something beyond ordinary. Leave the room and they may vocalise, refuse food, or look depressed — attachment distortion, not a medical mystery.',
    guideLink: '#common-pitfalls'
  },
  {
    topic: 'Breed temperament',
    breedCategory: 'herding',
    track: 'both',
    text: 'Which reward approach often lands best with dogs wired to track motion?',
    options: [
      'Access training and environmental rewards, rather than treat-chasing',
      'Constant treats to keep their eyes on your hand',
      'Long cuddle sessions after each behaviour',
      'A laser pointer to channel the visual drive'
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
      'Separation anxiety that only medication can address',
      'Grief — the dog needs more comfort when you return',
      'Hunger striking to demand better food'
    ],
    explanation: 'It is often attachment distortion, not a medical mystery. Structure, access training, reduced face-gazing intimacy, and environmental outlets can rebuild a healthier frame.',
    guideLink: '#common-pitfalls'
  },

  {
    topic: 'Breed temperament',
    breedCategory: 'herding',
    track: 'both',
    text: 'Your herding-type dog locks its eyes onto a passing bike. Where is the correction window?',
    options: [
      'At the eye-lock itself — for these dogs the stare can become a full fixation before the body ever moves',
      'When the dog starts running after the bike',
      'After the bike has passed, as a delayed lesson',
      'There is no window — chasing movement is unfixable in herding breeds'
    ],
    explanation: 'Collies and other herding types lock onto movement. Watch for the eye-lock before the lunge — the precursor window matters even more, and slack-leash walking is what lets you see it build.',
    guideLink: '#breed-temperament'
  },

  /* ── Breed: terrier / high-drive ── */
  {
    topic: 'Breed temperament',
    breedCategory: 'terrier',
    track: 'both',
    text: 'A high-drive terrier kept as a lap companion starts destroying things. What is the guide\'s diagnosis?',
    options: [
      'Frustration from denied outlets — sniffing, running, problem-solving — not bad character',
      'Inherited destructiveness that cannot be trained out',
      'Spite for being left alone',
      'A calcium deficiency — chewing is dietary'
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
      'Lap time and carrying',
      'Verbal praise alone',
      'Watching other dogs play from a distance'
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
      'Unlimited — high-drive dogs need constant freedom to stay sane',
      'Forbidden until the dog is fully trained',
      'Scheduled — the same off-leash time daily regardless of behaviour'
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
      'Avoiding all walks until the reactivity passes',
      'A muzzle as the primary management tool',
      'More lap time at home to lower the drive'
    ],
    explanation: 'Frustration from denied outlets surfaces as fixation and reactivity. Access training is often the right currency for these dogs.',
    guideLink: '#common-pitfalls'
  },

  {
    topic: 'Breed temperament',
    breedCategory: 'terrier',
    track: 'both',
    text: 'A soft adolescent staffy and a hard adult terrier both need the same correction technique. What differs?',
    options: [
      'The firmness and recovery time — same tools, calibrated to the dog in front of you',
      'The technique itself — terriers need entirely different methods',
      'Nothing — every dog gets identical intensity',
      'Only the verbal command used'
    ],
    explanation: 'Age and breed together set the floor: a soft adolescent staffy and a hard adult terrier may need the same technique with different firmness and recovery time.',
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
      'Confidence — reassurance always reduces fear',
      'Nothing — single moments don\'t shape behaviour',
      'Better guarding instincts, which is the breed\'s purpose'
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
      'A bigger yard to patrol',
      'Encouraging the alert barking so intruders are deterred',
      'Keeping the dog away from all strangers'
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
      'Anxiety changes the owner\'s scent, which alarms the dog',
      'It doesn\'t — guarding is purely genetic',
      'Anxious owners walk less, so the dog has excess energy'
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
      'Soothing words and slow strokes until the dog relaxes',
      'Tighten the leash and stare at the passerby yourself',
      'Turn and walk the other way every time'
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
      'Let it bark — alerting is the breed doing its job',
      'Reassure the dog warmly so it knows the threat is handled',
      'Shout over the barking until the dog stops'
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
      'A safer dog, since small breeds are fragile',
      'A calmer dog, since its needs are always met',
      'No effect — size makes structure unnecessary'
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
      'No — small dogs are too fragile for any correction',
      'Only the verbal tools apply',
      'Only if the dog weighs over ten kilograms'
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
      'Lifting the dog by the harness instead',
      'Skipping leash corrections for dogs under ten kilograms',
      'Using a longer, heavier leash for leverage'
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
      'Harmless display — small dogs cannot do real damage',
      'Fear that should be soothed with cuddles',
      'Breed-typical behaviour that cannot be changed'
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
      'Safety with no downside — small dogs should be carried near other dogs',
      'A stronger bond, which makes training easier later',
      'No effect — carrying is neutral'
    ],
    explanation: 'Constant carrying and over-sheltering from normal dog learning is one of the classic human-baby-trap pitfalls. Undoing learned dependency is slower and harder than building the right frame early.',
    guideLink: '#common-pitfalls'
  }
];
