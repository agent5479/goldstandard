import type { BreedCategory } from './breeds';
import {
  allocationQuestionAxes,
  polesFromLegacyOptions,
  type AllocationQuestion,
} from './dogPersonalityAllocation';
import {
  getBreedRankingMargin,
  rankBreedsInCategory,
  varianceOnAxis,
  type HumanTraitProfile,
  type TraitVectorDelta,
} from './dogPersonalityTraitMatrix';

interface LegacyDisambiguationOption {
  id: string;
  label: string;
  sublabel?: string;
  delta: TraitVectorDelta;
}

interface LegacyDisambiguationQuestion {
  id: string;
  prompt: string;
  analogySublabel?: string;
  options: LegacyDisambiguationOption[];
}

function toAllocationQuestion(question: LegacyDisambiguationQuestion): AllocationQuestion {
  return {
    id: question.id,
    prompt: question.prompt,
    poles: polesFromLegacyOptions(question.options),
  };
}

export const DISAMBIGUATION_MARGIN = 6;
export const MAX_ADAPTIVE_QUESTIONS = 8;

const DISAMBIGUATION_BANK: Record<BreedCategory, LegacyDisambiguationQuestion[]> = {
  clingy: [
    {
      id: 'dis_clingy_team',
      prompt: 'Your crew dynamic is…',
      analogySublabel: 'Team sport Lab vs one-person Japanese Chin',
      options: [
        { id: 'team_everyone', label: 'Love the whole squad', sublabel: 'Greets every friend like family', delta: { ei: 9, companion: 8 } },
        { id: 'team_one', label: 'One person, deep bond', sublabel: 'Velcro for one human only', delta: { ei: 7, adapt: 6 } },
        { id: 'team_selective', label: 'Small trusted circle', sublabel: 'Warm inside, polite outside', delta: { ei: 5, adapt: 7 } },
      ],
    },
    {
      id: 'dis_clingy_soft',
      prompt: 'When corrected, you…',
      analogySublabel: 'Soft-hearted Cavalier vs bulletproof optimism',
      options: [
        { id: 'soft_heart', label: 'Feel it deeply', sublabel: 'Needs gentle tone', delta: { startle: 8, neuro: 7 } },
        { id: 'soft_bounce', label: 'Shake it off fast', sublabel: 'Resilient companion', delta: { startle: 4, neuro: 4 } },
        { id: 'soft_stoic', label: 'Stoic — process quietly', sublabel: 'Dignified response', delta: { startle: 5, vocal: 3 } },
      ],
    },
    {
      id: 'dis_clingy_size',
      prompt: 'Your lap-real estate preference…',
      options: [
        { id: 'lap_toy', label: 'Full lap occupation', sublabel: 'Toy companion energy', delta: { size: 2 } },
        { id: 'lap_medium', label: 'Beside you, leaning in', sublabel: 'Medium cuddle partner', delta: { size: 5 } },
        { id: 'lap_big', label: 'Big dog, small couch', sublabel: 'Substantial snuggle', delta: { size: 8 } },
      ],
    },
    {
      id: 'dis_clingy_energy',
      prompt: 'After bonding time, you…',
      options: [
        { id: 'bond_nap', label: 'Crash together', sublabel: 'Couch potato cuddle', delta: { work: 3, inst: 3 } },
        { id: 'bond_walk', label: 'Want a outing', sublabel: 'Companion walk energy', delta: { work: 6, inst: 5 } },
        { id: 'bond_play', label: 'Need an activity', sublabel: 'Play-driven people dog', delta: { work: 8, inst: 7 } },
      ],
    },
    {
      id: 'dis_clingy_vocal',
      prompt: 'When left alone briefly…',
      options: [
        { id: 'alone_quiet', label: 'Wait patiently', sublabel: 'Quiet confidence', delta: { vocal: 2, startle: 4 } },
        { id: 'alone_whine', label: 'Express concern', sublabel: 'Audible protest', delta: { vocal: 7, startle: 7 } },
        { id: 'alone_panic', label: 'Full drama', sublabel: 'Separation song', delta: { vocal: 9, startle: 9 } },
      ],
    },
  ],
  sighthound: [
    {
      id: 'dis_sight_couch',
      prompt: 'Your default home mode…',
      analogySublabel: 'Decorate the sofa vs patrol the window',
      options: [
        { id: 'couch_art', label: 'Furniture is my habitat', sublabel: 'Greyhound lounge pro', delta: { work: 2, prot: 2 } },
        { id: 'couch_window', label: 'Watchful from the window', sublabel: 'Alert but calm', delta: { work: 4, prot: 6 } },
        { id: 'couch_restless', label: 'Restless until exercised', sublabel: 'Needs a run first', delta: { work: 7, inst: 7 } },
      ],
    },
    {
      id: 'dis_sight_chase',
      prompt: 'Something moves in the periphery…',
      options: [
        { id: 'chase_instant', label: 'Zero to sprint', sublabel: 'Pure chase reflex', delta: { chase: 10, inst: 9 } },
        { id: 'chase_look', label: 'Track it, maybe go', sublabel: 'Measured pursuit', delta: { chase: 7, inst: 6 } },
        { id: 'chase_ignore', label: 'Not worth the calories', sublabel: 'Couch beats squirrel', delta: { chase: 4, work: 3 } },
      ],
    },
    {
      id: 'dis_sight_social',
      prompt: 'New people at the door…',
      options: [
        { id: 'door_shy', label: 'Polite distance', sublabel: 'Reserved dignity', delta: { ei: 4, vocal: 3 } },
        { id: 'door_warm', label: 'Quiet hello', sublabel: 'Gentle greeting', delta: { ei: 6, companion: 5 } },
        { id: 'door_alert', label: 'Bark then retreat', sublabel: 'Alarm then vanish', delta: { vocal: 6, prot: 6 } },
      ],
    },
    {
      id: 'dis_sight_size',
      prompt: 'Your silhouette…',
      options: [
        { id: 'sil_whippet', label: 'Sleek and medium', sublabel: 'Whippet proportions', delta: { size: 5 } },
        { id: 'sil_grey', label: 'Tall and rangy', sublabel: 'Greyhound lines', delta: { size: 8 } },
        { id: 'sil_small', label: 'Compact sprinter', sublabel: 'Italian Greyhound', delta: { size: 3 } },
      ],
    },
    {
      id: 'dis_sight_prey',
      prompt: 'Small furry things…',
      options: [
        { id: 'prey_lock', label: 'Laser focus', sublabel: 'Prey drive engaged', delta: { chase: 9, inst: 8 } },
        { id: 'prey_maybe', label: 'Depends on mood', sublabel: 'Sometimes curious', delta: { chase: 5 } },
        { id: 'prey_nope', label: 'Not my problem', sublabel: 'Domestic zen', delta: { chase: 2, adapt: 6 } },
      ],
    },
  ],
  herding: [
    {
      id: 'dis_herd_style',
      prompt: 'Organising others, you…',
      analogySublabel: 'Organise the group chat vs eye-lock one target',
      options: [
        { id: 'herd_group', label: 'Coordinate the whole crew', sublabel: 'Group herder', delta: { herding_eye: 7, dom: 7 } },
        { id: 'herd_one', label: 'Fixate on one mover', sublabel: 'Eye-lock specialist', delta: { herding_eye: 9, chase: 6 } },
        { id: 'herd_soft', label: 'Gentle nudges only', sublabel: 'Soft herding style', delta: { herding_eye: 5, ei: 7 } },
      ],
    },
    {
      id: 'dis_herd_brain',
      prompt: 'Mental work vs physical…',
      options: [
        { id: 'brain_puzzle', label: 'Give me puzzles', sublabel: 'Border Collie brain', delta: { iq: 9, work: 8 } },
        { id: 'brain_balance', label: 'Mix of both', sublabel: 'Versatile worker', delta: { iq: 7, work: 7 } },
        { id: 'brain_body', label: 'Run first, think later', sublabel: 'Drive over deliberation', delta: { inst: 8, iq: 5 } },
      ],
    },
    {
      id: 'dis_herd_offduty',
      prompt: 'Off the clock, you…',
      options: [
        { id: 'off_switch', label: 'Full off-switch', sublabel: 'Calm in the house', delta: { work: 4, neuro: 4 } },
        { id: 'off_patrol', label: 'Still watching corners', sublabel: 'Always on duty', delta: { work: 7, prot: 6 } },
        { id: 'off_never', label: 'Never fully off', sublabel: 'Perpetual motion', delta: { work: 9, inst: 8 } },
      ],
    },
    {
      id: 'dis_herd_people',
      prompt: 'With strangers…',
      options: [
        { id: 'stranger_wary', label: 'Reserved until proven', sublabel: 'Working dog reserve', delta: { ei: 4, adapt: 6 } },
        { id: 'stranger_ok', label: 'Polite but focused', sublabel: 'Professional demeanor', delta: { ei: 5 } },
        { id: 'stranger_friends', label: 'Everyone is staff', sublabel: 'Social herder', delta: { ei: 8, companion: 7 } },
      ],
    },
    {
      id: 'dis_herd_vocal',
      prompt: 'When things get exciting…',
      options: [
        { id: 'excite_bark', label: 'Announce it loudly', sublabel: 'Heeler bark energy', delta: { vocal: 8 } },
        { id: 'excite_whine', label: 'Whine and pace', sublabel: 'Audible anticipation', delta: { vocal: 6, neuro: 6 } },
        { id: 'excite_silent', label: 'Silent intensity', sublabel: 'Eye and posture only', delta: { vocal: 2, herding_eye: 8 } },
      ],
    },
  ],
  spitz: [
    {
      id: 'dis_spitz_indep',
      prompt: 'Your independence level…',
      options: [
        { id: 'indep_solo', label: 'Happy doing my thing', sublabel: 'Shiba solo artist', delta: { adapt: 9, ei: 4 } },
        { id: 'indep_mixed', label: 'Independent but affectionate', sublabel: 'Nordic balance', delta: { adapt: 6, ei: 6 } },
        { id: 'indep_pack', label: 'Pack-oriented', sublabel: 'Husky team player', delta: { adapt: 4, ei: 7, companion: 7 } },
      ],
    },
    {
      id: 'dis_spitz_vocal',
      prompt: 'Your opinion volume…',
      analogySublabel: 'Husky opera vs quiet Spitz dignity',
      options: [
        { id: 'vol_opera', label: 'Full aria', sublabel: 'Husky conversation', delta: { vocal: 10 } },
        { id: 'vol_chat', label: 'Occasional commentary', sublabel: 'Selective speaker', delta: { vocal: 6 } },
        { id: 'vol_mute', label: 'Strong silent type', sublabel: 'Basenji-adjacent', delta: { vocal: 2 } },
      ],
    },
    {
      id: 'dis_spitz_energy',
      prompt: 'Daily energy budget…',
      options: [
        { id: 'energy_marathon', label: 'Endurance athlete', sublabel: 'Sled dog stamina', delta: { sled_endurance: 9, work: 8 } },
        { id: 'energy_burst', label: 'Zoomies then crash', sublabel: 'Spitz sprint cycle', delta: { work: 7, inst: 7 } },
        { id: 'energy_moderate', label: 'Steady Nordic pace', sublabel: 'Consistent moderate', delta: { work: 5, sled_endurance: 5 } },
      ],
    },
    {
      id: 'dis_spitz_stranger',
      prompt: 'Strangers approaching…',
      options: [
        { id: 'stranger_aloof', label: 'Aloof assessment', sublabel: 'Nordic reserve', delta: { ei: 3, adapt: 8 } },
        { id: 'stranger_guard', label: 'Guardian mode', sublabel: 'Protective Spitz', delta: { prot: 8, guard: 7 } },
        { id: 'stranger_friendly', label: 'Eventually charming', sublabel: 'Warms up slowly', delta: { ei: 6, companion: 5 } },
      ],
    },
    {
      id: 'dis_spitz_groom',
      prompt: 'Your presentation style…',
      options: [
        { id: 'present_fluffy', label: 'Fluffy and proud', sublabel: 'Samoyed smile energy', delta: { ei: 8, size: 7 } },
        { id: 'present_compact', label: 'Compact fox face', sublabel: 'Pom / Shiba vibe', delta: { size: 4, adapt: 7 } },
        { id: 'present_wolf', label: 'Wolfish and striking', sublabel: 'Malamute presence', delta: { size: 9, dom: 7 } },
      ],
    },
  ],
  terrier: [
    {
      id: 'dis_terrier_dig',
      prompt: 'Your hobby of choice…',
      analogySublabel: 'Dig the garden vs stare at squirrels',
      options: [
        { id: 'hobby_dig', label: 'Dig into everything', sublabel: 'Earthdog instinct', delta: { hunt_dig: 9, inst: 8 } },
        { id: 'hobby_chase', label: 'Chase anything moving', sublabel: 'Squirrel patrol', delta: { chase: 8, hunt_dig: 4 } },
        { id: 'hobby_boss', label: 'Boss the household', sublabel: 'Terrier attitude', delta: { dom: 8, vocal: 7 } },
      ],
    },
    {
      id: 'dis_terrier_size',
      prompt: 'Your terrier scale…',
      options: [
        { id: 'ter_toy', label: 'Pocket firecracker', sublabel: 'Toy terrier', delta: { size: 3 } },
        { id: 'ter_medium', label: 'Standard scrappy', sublabel: 'Jack Russell energy', delta: { size: 5 } },
        { id: 'ter_stocky', label: 'Stocky and tough', sublabel: 'Staffy build', delta: { size: 6, dom: 7 } },
      ],
    },
    {
      id: 'dis_terrier_bark',
      prompt: 'Alarm system setting…',
      options: [
        { id: 'bark_always', label: 'Bark first, ask later', sublabel: 'Yorkie alarm', delta: { vocal: 9 } },
        { id: 'bark_sometimes', label: 'Bark when it matters', sublabel: 'Selective alarm', delta: { vocal: 6 } },
        { id: 'bark_rare', label: 'Actions over noise', sublabel: 'Quiet terrier', delta: { vocal: 3 } },
      ],
    },
    {
      id: 'dis_terrier_soft',
      prompt: 'Under the tough exterior…',
      options: [
        { id: 'tough_soft', label: 'Secret softie', sublabel: 'Sensitive terrier', delta: { neuro: 6, startle: 6 } },
        { id: 'tough_tough', label: 'Genuinely bulletproof', sublabel: 'Thick-skinned', delta: { neuro: 3, startle: 3 } },
        { id: 'tough_both', label: 'Tough until betrayed', sublabel: 'Trust matters', delta: { neuro: 5, ei: 6 } },
      ],
    },
    {
      id: 'dis_terrier_prey',
      prompt: 'Small animals on TV…',
      options: [
        { id: 'tv_lunge', label: 'Must investigate', sublabel: 'Prey drive on', delta: { chase: 9, hunt_dig: 7 } },
        { id: 'tv_watch', label: 'Intense watching', sublabel: 'Locked on', delta: { chase: 6 } },
        { id: 'tv_meh', label: 'Not interested', sublabel: 'Domesticated chill', delta: { chase: 3 } },
      ],
    },
  ],
  scenthound: [
    {
      id: 'dis_scent_song',
      prompt: 'Your signature sound…',
      analogySublabel: 'Sing the song of your people vs mute dignity',
      options: [
        { id: 'song_bay', label: 'Bay at the moon', sublabel: 'Coonhound concert', delta: { vocal: 10 } },
        { id: 'song_howl', label: 'Occasional howl', sublabel: 'Beagle sing-along', delta: { vocal: 7 } },
        { id: 'song_quiet', label: 'Surprisingly quiet', sublabel: 'Basset dignity', delta: { vocal: 3 } },
      ],
    },
    {
      id: 'dis_scent_nose',
      prompt: 'An interesting smell…',
      options: [
        { id: 'nose_obsess', label: 'Nothing else exists', sublabel: 'Bloodhound focus', delta: { scent: 10, inst: 8 } },
        { id: 'nose_curious', label: 'Follow if time allows', sublabel: 'Casual tracker', delta: { scent: 7 } },
        { id: 'nose_sniff', label: 'Quick sniff, move on', sublabel: 'Low scent priority', delta: { scent: 4 } },
      ],
    },
    {
      id: 'dis_scent_pace',
      prompt: 'On a trail (or task)…',
      options: [
        { id: 'trail_slow', label: 'Methodical and thorough', sublabel: 'Basset pace', delta: { work: 4, scent: 8 } },
        { id: 'trail_steady', label: 'Steady endurance', sublabel: 'Foxhound stamina', delta: { work: 6, scent: 7 } },
        { id: 'trail_burst', label: 'Burst then rest', sublabel: 'Beagle sprint-sniff', delta: { work: 7, inst: 6 } },
      ],
    },
    {
      id: 'dis_scent_people',
      prompt: 'People vs smells…',
      options: [
        { id: 'people_first', label: 'People win', sublabel: 'Social hound', delta: { ei: 8, companion: 7 } },
        { id: 'people_equal', label: 'Equal love', sublabel: 'Balanced hound', delta: { ei: 6, scent: 6 } },
        { id: 'smell_first', label: 'Nose wins', sublabel: 'Scent is life', delta: { scent: 9, ei: 4 } },
      ],
    },
    {
      id: 'dis_scent_size',
      prompt: 'Your hound build…',
      options: [
        { id: 'hound_low', label: 'Low and long', sublabel: 'Basset / Dachshund', delta: { size: 4 } },
        { id: 'hound_medium', label: 'Classic hound medium', sublabel: 'Beagle proportions', delta: { size: 5 } },
        { id: 'hound_tall', label: 'Tall and rangy', sublabel: 'Foxhound lines', delta: { size: 7 } },
      ],
    },
  ],
  guardian: [
    {
      id: 'dis_guard_door',
      prompt: 'Doorbell energy…',
      analogySublabel: 'Livestock guardian calm vs reactive door alarm',
      options: [
        { id: 'door_silent', label: 'Silent assessment', sublabel: 'Mastiff stillness', delta: { vocal: 3, prot: 8 } },
        { id: 'door_bark', label: 'Announce then evaluate', sublabel: 'Standard guard bark', delta: { vocal: 7, prot: 8 } },
        { id: 'door_intense', label: 'Full alert mode', sublabel: 'High-drive guardian', delta: { vocal: 8, prot: 9, inst: 7 } },
      ],
    },
    {
      id: 'dis_guard_bond',
      prompt: 'Your loyalty radius…',
      options: [
        { id: 'loyal_family', label: 'Family only', sublabel: 'Flock guardian', delta: { ei: 6, companion: 5, prot: 8 } },
        { id: 'loyal_property', label: 'Property and people', sublabel: 'Territory guardian', delta: { guard: 9, prot: 9 } },
        { id: 'loyal_public', label: 'Protect but social', sublabel: 'Public-facing guardian', delta: { ei: 7, prot: 6 } },
      ],
    },
    {
      id: 'dis_guard_size',
      prompt: 'Your imposing factor…',
      options: [
        { id: 'impose_massive', label: 'Massive presence', sublabel: 'Mastiff scale', delta: { size: 9, dom: 8 } },
        { id: 'impose_athletic', label: 'Athletic guardian', sublabel: 'Doberman lines', delta: { size: 7, work: 7 } },
        { id: 'impose_compact', label: 'Compact but serious', sublabel: 'Shar Pei gravitas', delta: { size: 5, dom: 7 } },
      ],
    },
    {
      id: 'dis_guard_stranger',
      prompt: 'Unknown visitors…',
      options: [
        { id: 'visitor_block', label: 'Stand between', sublabel: 'Physical guardian', delta: { prot: 9, guard: 8 } },
        { id: 'visitor_watch', label: 'Watch from distance', sublabel: 'Assessing', delta: { prot: 7, adapt: 5 } },
        { id: 'visitor_warm', label: 'Warm after intro', sublabel: 'Social guardian', delta: { ei: 7, prot: 5 } },
      ],
    },
    {
      id: 'dis_guard_energy',
      prompt: 'Daily activity needs…',
      options: [
        { id: 'guard_calm', label: 'Calm patrol', sublabel: 'Low-key guardian', delta: { work: 4, neuro: 4 } },
        { id: 'guard_moderate', label: 'Regular walks', sublabel: 'Moderate guardian', delta: { work: 6 } },
        { id: 'guard_active', label: 'Needs a job', sublabel: 'Working guardian', delta: { work: 8, inst: 7 } },
      ],
    },
  ],
  giant: [
    {
      id: 'dis_giant_space',
      prompt: 'Your spatial awareness…',
      options: [
        { id: 'space_clumsy', label: 'Tail clears the coffee table', sublabel: 'Oblivious giant', delta: { size: 10, ei: 7 } },
        { id: 'space_grace', label: 'Surprisingly graceful', sublabel: 'Gentle giant', delta: { size: 9, neuro: 4 } },
        { id: 'space_aware', label: 'Very body-conscious', sublabel: 'Careful mover', delta: { size: 8, adapt: 6 } },
      ],
    },
    {
      id: 'dis_giant_energy',
      prompt: 'Giant dog energy paradox…',
      options: [
        { id: 'giant_couch', label: 'Couch is life', sublabel: 'Mastiff lounge', delta: { work: 3, inst: 3 } },
        { id: 'giant_walk', label: 'Daily walks suffice', sublabel: 'Steady giant', delta: { work: 5 } },
        { id: 'giant_work', label: 'Still needs purpose', sublabel: 'Working giant', delta: { work: 7, inst: 6 } },
      ],
    },
    {
      id: 'dis_giant_kids',
      prompt: 'With smaller beings…',
      options: [
        { id: 'kids_nanny', label: 'Gentle nanny', sublabel: 'Newfoundland patience', delta: { ei: 8, neuro: 3 } },
        { id: 'kids_careful', label: 'Careful but reserved', sublabel: 'Polite giant', delta: { ei: 5, adapt: 6 } },
        { id: 'kids_rough', label: 'Playful roughhousing', sublabel: 'Boisterous giant', delta: { ei: 7, inst: 7 } },
      ],
    },
    {
      id: 'dis_giant_guard',
      prompt: 'Protective instinct…',
      options: [
        { id: 'protect_none', label: 'Love everyone', sublabel: 'Social giant', delta: { prot: 3, ei: 8 } },
        { id: 'protect_family', label: 'Family protectors', sublabel: 'Devoted guardian', delta: { prot: 7, guard: 6 } },
        { id: 'protect_intense', label: 'Serious guardian', sublabel: 'Intimidating protector', delta: { prot: 9, guard: 8 } },
      ],
    },
    {
      id: 'dis_giant_drool',
      prompt: 'Your mess tolerance…',
      options: [
        { id: 'mess_high', label: 'Embrace the chaos', sublabel: 'Drool and fur accepted', delta: { adapt: 4, ei: 8 } },
        { id: 'mess_medium', label: 'Some mess is fine', sublabel: 'Practical giant owner', delta: { adapt: 6 } },
        { id: 'mess_low', label: 'Neat and tidy preferred', sublabel: 'Clean giant (Great Dane)', delta: { adapt: 7, neuro: 5 } },
      ],
    },
  ],
  small: [
    {
      id: 'dis_small_attitude',
      prompt: 'Your size vs confidence…',
      options: [
        { id: 'small_napoleon', label: 'Tiny body, huge ego', sublabel: 'Chihuahua Napoleon', delta: { dom: 9, size: 2 } },
        { id: 'small_sweet', label: 'Sweet and portable', sublabel: 'Maltese charm', delta: { ei: 8, dom: 3, size: 2 } },
        { id: 'small_tough', label: 'Small but sturdy', sublabel: 'French Bulldog tough', delta: { size: 4, dom: 6 } },
      ],
    },
    {
      id: 'dis_small_energy',
      prompt: 'Small dog energy…',
      options: [
        { id: 'small_zoom', label: 'Perpetual zoomies', sublabel: 'Jack Russell in a toy body', delta: { work: 8, inst: 8 } },
        { id: 'small_lap', label: 'Professional lap warmer', sublabel: 'Toy companion', delta: { work: 3, companion: 9 } },
        { id: 'small_middle', label: 'Play then nap', sublabel: 'Balanced small', delta: { work: 5, companion: 6 } },
      ],
    },
    {
      id: 'dis_small_bark',
      prompt: 'Your alarm setting…',
      options: [
        { id: 'alarm_yappy', label: 'Yappy and proud', sublabel: 'Toy terrier alarm', delta: { vocal: 9 } },
        { id: 'alarm_some', label: 'Bark when needed', sublabel: 'Moderate alarm', delta: { vocal: 5 } },
        { id: 'alarm_quiet', label: 'Quiet companion', sublabel: 'Rarely vocal', delta: { vocal: 2 } },
      ],
    },
    {
      id: 'dis_small_social',
      prompt: 'Meeting new people…',
      options: [
        { id: 'meet_everyone', label: 'Everyone is a friend', sublabel: 'Social butterfly', delta: { ei: 9, companion: 8 } },
        { id: 'meet_cautious', label: 'Cautious at first', sublabel: 'Warm up slowly', delta: { ei: 5, startle: 6 } },
        { id: 'meet_one', label: 'One person dog', sublabel: 'Selective small', delta: { ei: 6, adapt: 7 } },
      ],
    },
    {
      id: 'dis_small_brains',
      prompt: 'Mental stimulation…',
      options: [
        { id: 'brain_puzzle', label: 'Need puzzles', sublabel: 'Clever small', delta: { iq: 8, work: 6 } },
        { id: 'brain_simple', label: 'Simple pleasures', sublabel: 'Easy-going small', delta: { iq: 4, work: 4 } },
        { id: 'brain_trick', label: 'Love learning tricks', sublabel: 'Performing small', delta: { iq: 7, ei: 8 } },
      ],
    },
  ],
};

export function getDisambiguationBank(category: BreedCategory): AllocationQuestion[] {
  return (DISAMBIGUATION_BANK[category] ?? []).map(toAllocationQuestion);
}

export function getDisambiguationQuestionById(
  category: BreedCategory,
  id: string
): AllocationQuestion | undefined {
  const legacy = DISAMBIGUATION_BANK[category]?.find((q) => q.id === id);
  return legacy ? toAllocationQuestion(legacy) : undefined;
}

export function getAllDisambiguationCategories(): BreedCategory[] {
  return Object.keys(DISAMBIGUATION_BANK) as BreedCategory[];
}

export function planAdaptiveQuestion(
  category: BreedCategory,
  profile: HumanTraitProfile,
  answeredIds: Set<string>,
  adaptiveCount: number
): AllocationQuestion | null {
  if (adaptiveCount >= MAX_ADAPTIVE_QUESTIONS) return null;

  const margin = getBreedRankingMargin(category, profile);
  if (margin >= DISAMBIGUATION_MARGIN) return null;

  const topBreeds = rankBreedsInCategory(category, profile, 5).map((m) => m.breed);
  const bank = getDisambiguationBank(category).filter((q) => !answeredIds.has(q.id));
  if (bank.length === 0) return null;

  let best: AllocationQuestion | null = null;
  let bestScore = -1;

  for (const question of bank) {
    const axes = allocationQuestionAxes(question);
    let splitScore = 0;
    for (const axis of axes) {
      splitScore += varianceOnAxis(topBreeds, axis);
    }
    if (splitScore > bestScore) {
      bestScore = splitScore;
      best = question;
    }
  }

  return best;
}

export function isRefinementSeparated(
  category: BreedCategory,
  profile: HumanTraitProfile,
  adaptiveCount: number
): boolean {
  if (adaptiveCount >= MAX_ADAPTIVE_QUESTIONS) return true;
  return getBreedRankingMargin(category, profile) >= DISAMBIGUATION_MARGIN;
}
