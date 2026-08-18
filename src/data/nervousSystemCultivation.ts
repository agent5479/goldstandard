import { breedCategories, type BreedCategory } from './breeds';
import { findBreedByName } from './breedTraits';
import { getBreedLifePhaseNotes } from './breedSensitivityResolvers';
import type { PurposeRoleId } from './dogPurposeRoles';
import {
  getPuppyDevelopmentStage,
  type PuppyDevelopmentStage,
  type PuppyDevelopmentStageId,
} from './puppyDevelopmentStages';
import type { TrainingLifePhase } from './instinctTrainingLeverage';

export type CultivationCheckpointId = 'w7' | 'w8' | 'w12' | 'm4' | 'm7' | 'm12' | 'm18';

export interface CultivationCheckpointMeta {
  id: CultivationCheckpointId;
  ageLabel: string;
  ageWeeks: number;
  stageId: PuppyDevelopmentStageId;
  lifePhase: TrainingLifePhase;
}

export interface CultivationBeat {
  observed: string[];
  cultivate: string[];
  defer: string[];
}

export interface CategoryCultivationNote {
  category: BreedCategory;
  label: string;
  puppy?: string;
  adolescent?: string;
}

export interface ResolvedCultivationCheckpoint {
  meta: CultivationCheckpointMeta;
  stage: PuppyDevelopmentStage;
  observed: string[];
  cultivate: string[];
  defer: string[];
  categoryNotes: CategoryCultivationNote[];
  roleOverlay?: CultivationBeat;
  divergence?: string;
  guideAnchors: string[];
}

export const CULTIVATION_CHECKPOINTS: CultivationCheckpointMeta[] = [
  { id: 'w7', ageLabel: '7 weeks', ageWeeks: 7, stageId: 'nesting', lifePhase: 'puppy' },
  { id: 'w8', ageLabel: '8 weeks', ageWeeks: 8, stageId: 'safety_routine', lifePhase: 'puppy' },
  { id: 'w12', ageLabel: '12 weeks', ageWeeks: 12, stageId: 'safety_routine', lifePhase: 'puppy' },
  { id: 'm4', ageLabel: '4 months', ageWeeks: 18, stageId: 'teething_satiation', lifePhase: 'puppy' },
  { id: 'm7', ageLabel: '7 months', ageWeeks: 30, stageId: 'exercise_exposure', lifePhase: 'adolescent' },
  { id: 'm12', ageLabel: '12 months', ageWeeks: 52, stageId: 'accountability', lifePhase: 'adolescent' },
  { id: 'm18', ageLabel: '18 months', ageWeeks: 78, stageId: 'accountability', lifePhase: 'adult' },
];

const UNIVERSAL: Record<CultivationCheckpointId, CultivationBeat> = {
  w7: {
    observed: [
      'Still with the litter — thermal co-regulation, sibling bite inhibition, and the first map of “the world is safe”.',
      'Nervous system is elastic and unfinished. Startle recovers fast if the nest is stable.',
    ],
    cultivate: [
      'Breeder handling: short, calm, daily contact. Novel surfaces and household sounds at a distance — not flooding.',
      'Leave the pup with mother and littermates until ~8 weeks. Early baseline of security is the job.',
    ],
    defer: [
      'Home arrival, formal obedience, and any correction that would be shocking in a finished adult.',
      'Isolating a 7-week pup “to bond with you” — that is a nervous-system injury, not training.',
    ],
  },
  w8: {
    observed: [
      'Home arrival. Everything is new. The elastic nervous system will take its safety cue from the household, not from a sit.',
    ],
    cultivate: [
      'Potty routine, sleep close if needed, and calm neutrality. Light recalls — call over for food; do not enforce.',
      'Voluntary contact is fine. Do not reward demanding paw or lean as the bonding ritual.',
    ],
    defer: [
      'Standard leash corrections, strict obedience, and hard accountability for blowing you off.',
    ],
  },
  w12: {
    observed: [
      'Peak socialisation window inside the safety-and-routine stage. Still a baby brain. Potty is still the overriding training goal.',
      'Elastic nervous system — firmness yes, shocking squeeze rarely. Capacity is short; recovery should be fast.',
    ],
    cultivate: [
      'Broad, low-pressure exposure: surfaces, people, other stable dogs, car, vet handling. End while the body is still loose.',
      'Install “proximity is good” — guests arriving is not about the pup. Thresholds and crate/place as safety, not exile.',
    ],
    defer: [
      'Hard corrections, leash pops as a system, and treating a blown recall as character.',
      'Drilling tricks or patrol rehearsal through this window — you will buy a stressed adult, not a specialist.',
    ],
  },
  m4: {
    observed: [
      'Teething and satiation. Temporarily out of their minds — mouthing, chewing, and blow-offs that are not attitude.',
    ],
    cultivate: [
      'Chew toys and approved textures as the job. One tolerant adult dog for jump, mouth, and wrestle play if you can find one.',
      'Walks and mental work outside the home. Keep the safety baseline; do not moralise the mouth.',
    ],
    defer: [
      'Hardcore leash corrections and forcing adult obedience while the brain is in the gums.',
    ],
  },
  m7: {
    observed: [
      'Adolescent threshold — adult-sized energy, teenage brain. Testing, mounting, barging, selective deafness. Fear period often overlaps.',
      'Blow-off at the park is normal at this age — not permanent character.',
    ],
    cultivate: [
      'Drastically increase exercise and novel exposure: hikes, markets, surfaces, swimming. Do not over-shield.',
      'Hold the adult standard from seven months for greetings and leash — excitement is not an excuse. Volume of the hand can rise; it is still not personal.',
    ],
    defer: [
      'Full adult accountability until late in this stage. Treating fear-period startle as a permanent diagnosis.',
    ],
  },
  m12: {
    observed: [
      'Late fear-period / early accountability. Personality is setting. Coldness to other dogs at nine months can become overt aggression by eighteen if unaddressed.',
    ],
    cultivate: [
      'Slowly introduce go-get recall and very light, tiny leash corrections. Clamp down on pulling and jumping as the months progress.',
      'Keep exposure active. Structure without flooding.',
    ],
    defer: [
      'Waiting for them to “grow out of it” without a standard. Puppy passes are ending.',
    ],
  },
  m18: {
    observed: [
      'Personality is fundamentally set. Puppy passes are over. What you have been cultivating is now the adult nervous system.',
    ],
    cultivate: [
      'Full accountability — recalls, leash, thresholds — in a loving but firm way. Rebuild quickly after a reset.',
      'Specialist jobs (helper, guardian, sentinel) are now selected from the adult in front of you, not the pedigree.',
    ],
    defer: [
      'Starting a protection or helper-enforcer job on a still-fragile or still-fearful adult.',
    ],
  },
};

const CATEGORY_OVERLAYS: Partial<
  Record<BreedCategory, Partial<Record<CultivationCheckpointId, CultivationBeat>>>
> = {
  clingy: {
    w12: {
      observed: ['Bond forms fast — velcro and gaze arrive early.'],
      cultivate: ['Warmth with a frame. Access training starts as a game, not a freeze-out.'],
      defer: ['Face-gazing as the main bonding ritual; rewarding every whimper with a pickup.'],
    },
    m7: {
      observed: ['Testing plus people-focus — pushy greetings look like love.'],
      cultivate: ['Hold the adult greeting standard. Excitement is not an excuse.'],
      defer: ['Negotiating with crying or guilt. That installs an emotional hostage, not an anchor.'],
    },
  },
  herding: {
    w12: {
      observed: ['Eye-lock and motion interest appear early — stare before the lunge.'],
      cultivate: ['Interrupt precursors. Short motion games with an off-switch. Avoid prolonged stare-and-pet.'],
      defer: ['Herding the children as cute. You are rehearsing the adult nanny-nip.'],
    },
    m7: {
      observed: ['Fixation and arousal peak. Adolescent testing plus motion triggers.'],
      cultivate: ['Tighter timing, earlier interrupts, real jobs (flock, sport, structured fetch) instead of denied eye.'],
      defer: ['Hoping the stare “settles with age” while the household is the flock.'],
    },
  },
  guardian: {
    w12: {
      observed: ['Alertness appears early — wary glance at the door is already a seed.'],
      cultivate: ['Do not reward every wary glance with reassurance. Calm leadership from day one. Structured people exposure.'],
      defer: ['Patrol rehearsal, “protect mummy” talk, and isolation that confirms the world is unsafe.'],
    },
    m7: {
      observed: ['Territory and stranger assessment sharpen.'],
      cultivate: ['Directed exposure — guests, trades, other dogs — with a handler who is not narrating threat.'],
      defer: ['Over-protection or complete isolation. Both grow a vigilante, not a guardian.'],
    },
  },
  giant: {
    w12: {
      observed: ['Habits cute at eight kilograms. Frame is already racing the brain.'],
      cultivate: ['Leash manners, thresholds, and calm greetings are non-negotiable now.'],
      defer: ['Carrying, indulging barge-ins, and “he does not know his size yet” as a plan.'],
    },
    m7: {
      observed: ['Slow to mature — testing may run longer than smaller breeds. Size is already adult-dangerous.'],
      cultivate: ['Structure starts in puppyhood even if adult expectations apply later than two years.'],
      defer: ['Excusing size with weak structure. Privileged giants become entitled adults.'],
    },
  },
  terrier: {
    w12: {
      observed: ['Busy, mouthy, problem-solving. Boredom becomes yap and fixation quickly.'],
      cultivate: ['Channel dig, sniff, and puzzle drive daily. Access training is currency.'],
      defer: ['Lap-only raising with no job. Frustration will look like character later.'],
    },
    m7: {
      observed: ['Frustration reactivity surfaces if outlets are thin.'],
      cultivate: ['Real jobs and earned access. Interrupt fixation early.'],
      defer: ['Repetition nagging. Terriers go deaf to lectures.'],
    },
  },
  sighthound: {
    w12: {
      observed: ['Soft, easily startled. Calm at rest — then a flash of interest at motion.'],
      cultivate: ['Novelty gradually. Manage line-of-sight. Recover with neutrality, not drama.'],
      defer: ['Harsh correction that shuts them down. Off-lead near chase triggers.'],
    },
    m7: {
      observed: ['Chase drive strengthens. One chase can rewrite the walk.'],
      cultivate: ['Line-of-sight management before off-lead access. Precursor window is the work.'],
      defer: ['Corrections aimed at a launched chase. Nothing outruns it.'],
    },
  },
  scenthound: {
    w12: {
      observed: ['Nose comes online. Ears switch off when scent locks.'],
      cultivate: ['Recall before the nose locks. Food is usually currency. Baying is communication.'],
      defer: ['Moralising nose-led drift as defiance.'],
    },
    m7: {
      observed: ['Trail commitment deepens.'],
      cultivate: ['Reserve high-value recall currency for off-lead windows. Sniff releases as decompression.'],
      defer: ['Heel battles against a locked nose as the only strategy.'],
    },
  },
  spitz: {
    w12: {
      observed: ['Vocal, exploratory, independent. Recall is not a default.'],
      cultivate: ['Thresholds and fences as part of training. Earned access over repetition drills.'],
      defer: ['Hoping recall appears because you were fun at eight weeks.'],
    },
    m7: {
      observed: ['Escape and frustration testing intensifies.'],
      cultivate: ['Structured outlets and earned access. Boredom is defiance fuel.'],
      defer: ['Nagging. They go independent on purpose.'],
    },
  },
  small: {
    w12: {
      observed: ['Easy to pick up. Pushy behaviour gets excused because they are cute.'],
      cultivate: ['Ground-level structure from the start. Same standard as a large dog.'],
      defer: ['Carrying, hand-feeding, and skipping thresholds because they fit under an arm.'],
    },
    m7: {
      observed: ['Demanding behaviours peak if indulged early.'],
      cultivate: ['Adult standard from seven months. Touch saturation is a real risk.'],
      defer: ['Cute exceptions. Small dogs that cannot tolerate boundaries bite too.'],
    },
  },
};

const ROLE_OVERLAYS: Partial<
  Record<PurposeRoleId, Partial<Record<CultivationCheckpointId, CultivationBeat>>>
> = {
  trick_performer: {
    w12: {
      observed: ['Curiosity and food interest — not a finished performer.'],
      cultivate: ['Short shaping games that end on a win. Name a settle as the off-switch.'],
      defer: ['Drilling chains through teething or a fear wobble.'],
    },
    m7: {
      observed: ['Can learn fast and also spin out fast.'],
      cultivate: ['Keep sessions short. Reward recovery to neutrality, not just the trick.'],
      defer: ['Repetition until frustration. That is how you buy a frenetic demo.'],
    },
    m18: {
      observed: ['The adult either recovers between reps or does not.'],
      cultivate: ['Select the individual for public work. Pedigree is not the act.'],
      defer: ['Pushing a still-brittle adult into a show schedule to “socialise them”.'],
    },
  },
  gold_standard_role_model: {
    w12: {
      observed: ['Social interest. Other dogs and people are the curriculum.'],
      cultivate: ['Calm greetings, loose body, and a settle that is boring on purpose.'],
      defer: ['Hyping them as the star of every room.'],
    },
    m7: {
      observed: ['Adolescent rowdiness can look like the opposite of a model.'],
      cultivate: ['Hold the public settle. Fair play with other dogs. Instant disengage.'],
      defer: ['Letting them rehearse barge-and-mount as “just a teenager” without a line.'],
    },
    m18: {
      observed: ['This is the dog other dogs will copy — or avoid.'],
      cultivate: ['Protect the model. Do not use them as a punching bag for client dogs.'],
      defer: ['Burning out the best demo dog on every reactive intake.'],
    },
  },
  sentinel_pack_anchor: {
    w12: {
      observed: ['Presence starts as calm-in-the-room, not patrol.'],
      cultivate: ['Other dogs in the home as background, not a job. Reward neutrality around movement.'],
      defer: ['Patrol rehearsal or “watch the pack” talk. That is guardian, not sentinel.'],
    },
    m7: {
      observed: ['Can start to organise other dogs — or start to police them.'],
      cultivate: ['Reward settle while the pack moves. Interrupt stalking and body-blocks that are not asked for.'],
      defer: ['Letting them become the bouncer because it is convenient.'],
    },
    m18: {
      observed: ['The adult either settles a room or runs it.'],
      cultivate: ['Keep the job as presence. If territorial vigilance won, re-home the job, not the standard.'],
      defer: ['Asking a vigilante to be the pack’s calm centre.'],
    },
  },
  esd_humans: {
    w12: {
      observed: ['People-focus is already there. Stability is not.'],
      cultivate: ['Co-regulation: handler calm, short absences that end well, noise at a distance.'],
      defer: ['Using the pup as a comfort object. That installs a needy mirror, not support.'],
    },
    m7: {
      observed: ['Separation protest and noise startle show you the real nervous system.'],
      cultivate: ['Alone-time as a trained skill. Public neutrality. No patrol of visitors.'],
      defer: ['Emotional support “work” for a still-anxious adolescent. They cannot regulate you if they cannot regulate themselves.'],
    },
    m18: {
      observed: ['Stable or not is now visible.'],
      cultivate: ['Only then attach a human-support job. Select against fear and protectiveness.'],
      defer: ['Certifying a vigilante or a panic bark as an ESD because they like laps.'],
    },
  },
  helper_socialisation: {
    w12: {
      observed: ['Play interest. Bite inhibition still forming.'],
      cultivate: ['Fair play with stable dogs. Clean disengage. Loose body is the product.'],
      defer: ['Using them to “fix” reactive dogs. They are still a pup.'],
    },
    m7: {
      observed: ['Can look like a helper and still rehearse rude play.'],
      cultivate: ['Reward the disengage. Interrupt pin-and-chase that client dogs will copy.'],
      defer: ['Helper work with bitey adolescents as the curriculum.'],
    },
    m18: {
      observed: ['The adult either models recovery or models chaos.'],
      cultivate: ['Use only the fair, recoverable adult. Protect them from becoming a trigger.'],
      defer: ['A frustrated or guarding adult in the socialisation slot.'],
    },
  },
  helper_boundary_enforcer: {
    w12: {
      observed: ['Presence is not correction yet.'],
      cultivate: ['Social fluency first. They must be a fair dog before they are a line.'],
      defer: ['Encouraging puppy corrections of other dogs. You will grow a bully or a fight.'],
    },
    m7: {
      observed: ['Enough size and enough test to overshoot.'],
      cultivate: ['Handler-directed interrupts. Reward disengage after “enough”.'],
      defer: ['Unsupervised dog-dog justice. Native feedback is not a free-for-all.'],
    },
    m18: {
      observed: ['This job is an adult selection.'],
      cultivate: ['Use only a stable, socially intelligent adult who can hold a line and then drop it.'],
      defer: ['A high-protection or high-neuro dog in the master-helper slot.'],
    },
  },
  guardian: {
    w12: {
      observed: ['Alert seeds, not a finished guardian.'],
      cultivate: ['People as boring. Handler as the one who assesses. Exposure without reassurance-as-reward.'],
      defer: ['Protection sports, bite work, or “guard the house” games.'],
    },
    m7: {
      observed: ['Territory sharpens. Fear period can look like protection.'],
      cultivate: ['Directed stranger work. Distinguish startle from assessment. Keep EI in the picture.'],
      defer: ['Confirming every bark. Isolation that grows a fear-biter with a job title.'],
    },
    m18: {
      observed: ['The adult either takes direction or freelances.'],
      cultivate: ['Only then a protection job. Fear-reactive adults are not guardians.'],
      defer: ['Hoping a clingy or panicked adult “has your back”.'],
    },
  },
  family_active: {
    w12: {
      observed: ['Drive without an off-switch yet.'],
      cultivate: ['Daily motion that ends in a settle. Name the off-switch as clearly as the game.'],
      defer: ['All-day freedom with no job. That is how active types become neurotic noise.'],
    },
    m7: {
      observed: ['Adult-sized energy. The household either moves or the furniture pays.'],
      cultivate: ['Hikes, training games, scent or flock as a real outlet. Hold greetings anyway.'],
      defer: ['A quiet-house plan for a heading dog. Change the dog or change the lifestyle.'],
    },
    m18: {
      observed: ['The adult still needs a job. Age is not retirement at eighteen months.'],
      cultivate: ['Keep the outlet. Structure stays.'],
      defer: ['Dropping exercise because they “know better now”.'],
    },
  },
  family_low_active: {
    w12: {
      observed: ['Can look easy. Manners still have to be installed.'],
      cultivate: ['Walk-and-settle rhythm. Same thresholds as a large dog.'],
      defer: ['Skipping training because they are “low energy”. Low-energy is not no-standard.'],
    },
    m7: {
      observed: ['If chase or hunt was hiding, it shows now.'],
      cultivate: ['Keep walks boring-on-purpose. Interrupt invented jobs (cat, shadow, yap).'],
      defer: ['Surprise agility careers for a dog you chose to be quiet.'],
    },
    m18: {
      observed: ['The adult is either a settle companion or a frustrated under-worked mix.'],
      cultivate: ['Maintain the quiet job: walk, place, people as background.'],
      defer: ['Suddenly asking them to be a sport dog because a sibling got one.'],
    },
  },
  family_emotional_anchor: {
    w12: {
      observed: ['People-focus. Household emotion will become their weather.'],
      cultivate: ['Handler calm is the product. Contact without cling. Guests are not a crisis.'],
      defer: ['Using the pup to soothe family conflict. They will learn that distress is the job.'],
    },
    m7: {
      observed: ['Can become the family barometer — or the family hostage.'],
      cultivate: ['Hold the standard through teenage noise. Alone-time. No patrol, no nanny-nip.'],
      defer: ['Dropping structure because they “know how you feel”.'],
    },
    m18: {
      observed: ['The adult either regulates the room or the room regulates around their panic.'],
      cultivate: ['Protect the calm centre. Do not add guardian or herding jobs on top.'],
      defer: ['A hyper-vigilant adult as the household’s emotional support plan.'],
    },
  },
};

function uniqueCategories(breedNames: string[]): BreedCategory[] {
  const seen = new Set<BreedCategory>();
  for (const name of breedNames) {
    const breed = findBreedByName(name);
    if (breed) seen.add(breed.category);
  }
  return [...seen];
}

function mergeBeat(base: CultivationBeat, overlay?: CultivationBeat): CultivationBeat {
  if (!overlay) return base;
  return {
    observed: [...base.observed, ...overlay.observed],
    cultivate: [...base.cultivate, ...overlay.cultivate],
    defer: [...base.defer, ...overlay.defer],
  };
}

function guideAnchorsFor(id: CultivationCheckpointId): string[] {
  if (id === 'w7' || id === 'w8' || id === 'w12' || id === 'm4') {
    return ['breed-age-intensity', 'puppy-phase'];
  }
  if (id === 'm7' || id === 'm12') {
    return ['breed-age-intensity', 'rehabilitation-patterns'];
  }
  return ['breed-age-intensity', 'rehabilitation-patterns', 'trauma-hardship-calibration'];
}

export function resolveCultivationTimeline(opts: {
  breedNames: string[];
  roleId?: PurposeRoleId;
}): ResolvedCultivationCheckpoint[] {
  const categories = uniqueCategories(opts.breedNames);
  const roleOverlays = opts.roleId ? ROLE_OVERLAYS[opts.roleId] : undefined;
  const divergence =
    categories.length > 1
      ? `Mix cultivation gambit — parent types (${categories
          .map((category) => breedCategories[category].label)
          .join(' vs ')}) ask for different nervous-system work. Follow both overlays; do not average them into mush.`
      : undefined;

  return CULTIVATION_CHECKPOINTS.map((meta) => {
    const stage = getPuppyDevelopmentStage(meta.ageWeeks);
    let beat = UNIVERSAL[meta.id];
    for (const category of categories) {
      beat = mergeBeat(beat, CATEGORY_OVERLAYS[category]?.[meta.id]);
    }
    const roleOverlay = roleOverlays?.[meta.id];
    const categoryNotes: CategoryCultivationNote[] = categories.map((category) => {
      const notes = opts.breedNames
        .map((name) => {
          const breed = findBreedByName(name);
          return breed?.category === category ? getBreedLifePhaseNotes(name) : undefined;
        })
        .find(Boolean);
      return {
        category,
        label: breedCategories[category].label,
        puppy: meta.lifePhase === 'puppy' ? notes?.puppy : undefined,
        adolescent: meta.lifePhase !== 'puppy' ? notes?.adolescent : undefined,
      };
    });

    return {
      meta,
      stage,
      observed: beat.observed,
      cultivate: beat.cultivate,
      defer: beat.defer,
      categoryNotes,
      roleOverlay,
      divergence,
      guideAnchors: guideAnchorsFor(meta.id),
    };
  });
}

export function getCultivationCheckpoint(
  id: CultivationCheckpointId
): CultivationCheckpointMeta | undefined {
  return CULTIVATION_CHECKPOINTS.find((checkpoint) => checkpoint.id === id);
}
