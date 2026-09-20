/** Local SEO entity pages — services and service areas. */

export type ServiceSlug =
  | 'obedience-training'
  | 'puppy-training'
  | 'leash-training'
  | 'recall-training'
  | 'dog-behaviour'
  | 'reactive-dog'
  | 'difficult-dogs'
  | 'owner-coaching';

export type AreaSlug =
  | 'golden-bay'
  | 'takaka'
  | 'pohara'
  | 'nelson-bays'
  | 'motueka'
  | 'richmond';

export interface GuideLink {
  anchor: string;
  label: string;
}

export interface ProblemCluster {
  /** Owner-language H2. */
  heading: string;
  /** Supporting phrases for body / lists. */
  phrases: string[];
}

export interface ServiceSeoEntry {
  slug: ServiceSlug;
  /** Canonical public path (root commercial URL). */
  path: string;
  /** Homepage card icon (emoji) when linked from home. */
  icon: string;
  /** Short card title (home / hub). */
  cardTitle: string;
  /** Short card blurb. */
  cardDescription: string;
  /** Document / OG title (≤65 chars preferred). */
  title: string;
  metaDescription: string;
  /** Page-specific meta keywords. */
  keywords: string;
  h1: string;
  lead: string;
  /** Review-style phrases clients and prompts use. */
  symptoms: string[];
  /** Problem-language H2 clusters for on-page SEO. */
  problemClusters: ProblemCluster[];
  outcomes: string[];
  /** How GSDT approaches this (unique method voice). */
  approach: string;
  /** Commercial → guide loop intro. */
  guideIntro: string;
  guideLinks: GuideLink[];
  relatedServiceSlugs: ServiceSlug[];
  /** OfferCatalog / Service schema name. */
  schemaName: string;
  schemaDescription: string;
}

export interface AreaSeoEntry {
  slug: AreaSlug;
  name: string;
  title: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  lead: string;
  body: string;
  placeName: string;
}

/** Legacy `/services/{slug}` → new commercial path (MovedPage). */
export const LEGACY_SERVICE_REDIRECTS: Record<string, string> = {
  'everyday-obedience': '/obedience-training',
  'puppy-training': '/puppy-training',
  'leash-recall-control': '/leash-training',
  'home-manners': '/dog-behaviour',
  'dog-social-calm': '/reactive-dog',
  rehabilitation: '/difficult-dogs',
  'owner-coaching': '/owner-coaching',
};

export const SERVICES_HUB = {
  title: 'Dog Training Services | Golden Bay & Takaka',
  metaDescription:
    'Dog training services in Golden Bay and Takaka — obedience, puppy, leash, recall, reactive dogs, behaviour, and difficult cases. Private coaching with Warwick Marshall.',
  keywords:
    'dog training services Golden Bay, dog trainer Takaka, obedience training, puppy training, leash training, reactive dog training, dog rehabilitation Tasman, Warwick Marshall',
  h1: 'Dog Training Services in Golden Bay & Takaka',
  lead:
    'Every offer is in-person coaching with clear standards — not a generic class syllabus. Pick the focus that matches what you are living with, then book a session in Golden Bay or across the Tasman region.',
} as const;

export const AREAS_HUB = {
  title: 'Service Areas | Golden Bay, Takaka & Nelson Bays',
  metaDescription:
    'Dog training across Golden Bay, Takaka, Pohara, Nelson Bays, Motueka, and Richmond. In-person sessions based in Takaka, serving the Tasman region.',
  keywords:
    'dog trainer Golden Bay, dog trainer Takaka, dog trainer Pohara, dog trainer Motueka, dog trainer Richmond, dog trainer Nelson Bays, Tasman dog training, Warwick Marshall',
  h1: 'Where we train.',
  lead:
    'Gold Standard Dog Training is based in Takaka, Golden Bay, and works with dogs and owners across the Tasman region — beaches, roads, homes, and everyday public spaces where behaviour has to hold. Geographic hierarchy: Golden Bay → Takaka → Tasman → Nelson/Tasman → New Zealand.',
} as const;

export const SERVICE_SEO: ServiceSeoEntry[] = [
  {
    slug: 'obedience-training',
    path: '/obedience-training',
    icon: '🐕',
    cardTitle: 'Everyday manners & obedience',
    cardDescription:
      'Sit, lie, wait, heel, come when called — the basics that make daily life easy, built around your goals. With the right mix of correction, reward, and your own energy, your dog can be shaped into almost anything you want.',
    title: 'Dog Obedience Training Golden Bay & Takaka',
    metaDescription:
      'Dog obedience training in Golden Bay and Takaka — sit, wait, heel, and calm everyday manners with Warwick Marshall. Clear standards for daily life.',
    keywords:
      'dog obedience training Golden Bay, dog obedience Takaka, everyday manners training, heel training, sit wait come, Warwick Marshall',
    h1: 'Dog Obedience Training in Golden Bay & Takaka',
    lead:
      'Sit, lie, wait, heel, and come when called — calm obedience and impulse control that hold when life gets busy. Built around your household goals, not a one-size class script.',
    symptoms: [
      'won’t sit or wait at the door',
      'ignores known cues when distracted',
      'pulls ahead instead of walking with you',
      'comes when called only when it suits them',
      'basic manners collapse around guests or food',
    ],
    problemClusters: [
      {
        heading: 'Everyday manners that collapse under distraction',
        phrases: [
          'ignores sit or wait when guests arrive',
          'heel falls apart on busy streets',
          'selective listening around food or dogs',
        ],
      },
      {
        heading: 'Impulse control and clear boundaries',
        phrases: [
          'rushes doors and thresholds',
          'acts first, asks later',
          'needs structured dog training, not longer cue lists',
        ],
      },
    ],
    outcomes: [
      'Cues that land the first time in normal home and street contexts',
      'A handler who knows when to ask, when to correct, and when to release',
      'Daily life that feels calmer because standards are consistent',
    ],
    approach:
      'We treat obedience as relationship and rank clarity — structured dog training with clear boundaries — not treat bribery. Your energy, timing, and follow-through do more than a longer cue list. Sessions calibrate what “done” looks like for your dog, then coach you to hold that line after Warwick leaves.',
    guideIntro:
      'If you want the principles behind calm obedience and the Gold Standard Rule, see the Client Guide.',
    guideLinks: [
      { anchor: 'gold-standard-rule', label: 'The Gold Standard Rule' },
      { anchor: 'cue-once', label: 'Cue once' },
      { anchor: 'i-dont-care', label: 'The “I don’t care” standard' },
    ],
    relatedServiceSlugs: ['leash-training', 'recall-training', 'dog-behaviour', 'owner-coaching'],
    schemaName: 'Dog obedience and manners training',
    schemaDescription:
      'In-person obedience and daily manners coaching in Golden Bay — sit, wait, heel, recall, and owner standards for home and public life.',
  },
  {
    slug: 'puppy-training',
    path: '/puppy-training',
    icon: '🐶',
    cardTitle: 'Puppies started right',
    cardDescription:
      'The early months set everything up. Toilet training, biting and mouthing, crate and sleep routines, and calm structure — matched to your puppy’s age so you build the right habits before problems ever take hold.',
    title: 'Puppy Training Golden Bay & Takaka',
    metaDescription:
      'Puppy training in Golden Bay and Takaka — toilet, biting, crate routines, and early structure with Warwick Marshall. Start habits before problems lock in.',
    keywords:
      'puppy training Golden Bay, puppy trainer Takaka, toilet training puppy NZ, crate training Golden Bay, puppy obedience, Warwick Marshall puppy',
    h1: 'Puppy Training in Golden Bay & Takaka',
    lead:
      'The early months set the household. Toilet training, biting and mouthing, crate and sleep routines, and calm access — matched to age so you build the right habits before problems take hold.',
    symptoms: [
      'puppy biting and mouthing that won’t settle',
      'toilet accidents and no clear house routine',
      'crate or sleep battles at night',
      'jumping and wild greetings already starting',
      'unsure what to allow at seven weeks vs seven months',
    ],
    problemClusters: [
      {
        heading: 'Puppy toilet training and house routines',
        phrases: ['accidents indoors', 'no clear toilet schedule', 'crate and sleep battles'],
      },
      {
        heading: 'Puppy biting, jumping, and early manners',
        phrases: ['mouthing that won’t settle', 'wild greetings', 'puppy obedience foundations'],
      },
      {
        heading: 'Puppy socialisation with structure',
        phrases: [
          'age-appropriate exposure',
          'calm access instead of chaotic playdates',
          'structure matched to developmental stage',
        ],
      },
    ],
    outcomes: [
      'Age-appropriate expectations you can actually hold',
      'Toilet, rest, and access routines that reduce chaos',
      'A puppy learning calm access instead of rehearsing demand',
    ],
    approach:
      'Puppy work here is about leadership and nervous-system capacity, not endless socialisation playdates. We match structure to developmental stage and teach you to read arousal early — so freedom is earned, not assumed.',
    guideIntro:
      'If you want the developmental detail behind puppy structure, toilet routines, and early expectations, see the Client Guide.',
    guideLinks: [
      { anchor: 'expectations', label: 'Age and expectation standards' },
      { anchor: 'i-dont-care', label: 'Seven-month adult standard' },
      { anchor: 'eight-week-separation', label: 'Early separation and attachment' },
      { anchor: 'puppy-toilet-training', label: 'Puppy toilet training' },
    ],
    relatedServiceSlugs: ['obedience-training', 'dog-behaviour', 'owner-coaching'],
    schemaName: 'Puppy training and early structure',
    schemaDescription:
      'In-person puppy coaching in Golden Bay — toilet training, biting and mouthing, crate routines, and calm household structure.',
  },
  {
    slug: 'leash-training',
    path: '/leash-training',
    icon: '🦮',
    cardTitle: 'Leash training & loose leash',
    cardDescription:
      'Stop pulling, break fixation on the walk, and build leash reliability so walks feel shared — not dragged. Measured communication for roads, beaches, and everyday Golden Bay distractions.',
    title: 'Dog Leash Training Golden Bay & Takaka',
    metaDescription:
      'Dog leash training in Golden Bay — stop pulling, lunging on walks, and road fixation. Loose leash coaching with Warwick Marshall for walks you can trust.',
    keywords:
      'dog leash training Golden Bay, dog pulling on lead Golden Bay, loose leash training, leash training Takaka, dog pulls on walks, Warwick Marshall',
    h1: 'Dog Leash Training in Golden Bay & Takaka',
    lead:
      'Stop the pull, break fixation, and walk without being dragged — leash reliability for roads, beaches, and everyday distractions across Golden Bay and Takaka.',
    symptoms: [
      'pulls on the leash the whole walk',
      'lunges at dogs, bikes, or cars on the lead',
      'fixation that won’t break with a cue',
      'cuts in front and ignores road danger',
      'walks feel like a fight instead of a shared outing',
    ],
    problemClusters: [
      {
        heading: 'Dog pulling on lead',
        phrases: [
          'dog pulls on walks',
          'won’t walk nicely',
          'loose leash training and heel on the road',
        ],
      },
      {
        heading: 'Lunging and fixation on walks',
        phrases: [
          'lunges at dogs, bikes, or cars',
          'locked stare that won’t release',
          'handler timing in the one-second window',
        ],
      },
    ],
    outcomes: [
      'Walks that feel shared instead of dragged',
      'Handler timing that interrupts fixation early',
      'Leash communication that is clear without constant nagging',
    ],
    approach:
      'Leash work is trained as measured communication — body, voice, and collar clarity — not endless treat trails. We practice where distractions are real: beaches, roads, and public edges of Golden Bay and Nelson Bays life. Related: reliable come-when-called is coached on our recall training page.',
    guideIntro:
      'If you want the technique behind leash handling, collar selection, and timing, see the Client Guide.',
    guideLinks: [
      { anchor: 'leash', label: 'Leash & line' },
      { anchor: 'collar-selection', label: 'Collar selection' },
      { anchor: 'timing', label: 'Timing and the one-second window' },
      { anchor: 'ready-stance', label: 'Ready stance' },
    ],
    relatedServiceSlugs: ['recall-training', 'reactive-dog', 'obedience-training'],
    schemaName: 'Dog leash training and loose leash coaching',
    schemaDescription:
      'In-person leash manners, pulling interruption, and walk reliability coaching in Golden Bay and Takaka.',
  },
  {
    slug: 'recall-training',
    path: '/recall-training',
    icon: '📣',
    cardTitle: 'Recall training',
    cardDescription:
      'Come when called — at the beach, park, or when something unexpected happens. Reliable recall so you can trust your dog off-leash and on the road.',
    title: 'Dog Recall Training Golden Bay & Takaka',
    metaDescription:
      'Dog recall training in Golden Bay and Takaka — come when called, off-leash reliability, and road-aware returns with Warwick Marshall.',
    keywords:
      'dog recall training Golden Bay, dog won\'t come when called, off-leash recall, reliable recall training Takaka, Warwick Marshall',
    h1: 'Dog Recall Training in Golden Bay & Takaka',
    lead:
      'Come when called — at the beach, the park, or when something unexpected happens. Reliable recall so freedom is earned and returns are non-negotiable.',
    symptoms: [
      'won’t come back at the beach or park',
      'comes only when it suits them',
      'runs toward roads, dogs, or wildlife',
      'recall collapses under excitement',
      'afraid to let them off-leash',
    ],
    problemClusters: [
      {
        heading: 'Dog won’t come when called',
        phrases: [
          'selective listening outdoors',
          'recall that turns into a negotiation',
          'reliable recall training under distraction',
        ],
      },
      {
        heading: 'Off-leash recall and road awareness',
        phrases: [
          'dog runs away or toward traffic',
          'beach and park returns',
          'go-get recall that means leave and return',
        ],
      },
    ],
    outcomes: [
      'A recall that means leave and return, not negotiate',
      'Confidence to practice freedom in the right places',
      'Handler standards that hold when excitement spikes',
    ],
    approach:
      'Recall is trained as a non-negotiable return — measured communication and clear consequences — not endless treat trails. We practice where Golden Bay life is real: beaches, roads, and public edges. Related: pulling and walk manners are coached on our leash training page.',
    guideIntro:
      'If you want the method behind go-get recall and expectation standards, see the Client Guide.',
    guideLinks: [
      { anchor: 'go-get-recall', label: 'Go-get recall' },
      { anchor: 'expectations', label: 'Expectation standards' },
      { anchor: 'road-safety', label: 'Road safety' },
      { anchor: 'timing', label: 'Timing and the one-second window' },
    ],
    relatedServiceSlugs: ['leash-training', 'obedience-training', 'reactive-dog'],
    schemaName: 'Dog recall training',
    schemaDescription:
      'In-person recall coaching in Golden Bay — come when called, off-leash reliability, and road-aware returns.',
  },
  {
    slug: 'dog-behaviour',
    path: '/dog-behaviour',
    icon: '🏠',
    cardTitle: 'Home manners & behaviour',
    cardDescription:
      'Jumping on visitors, bolting the door, barking, or a dog that just can’t settle. We build calm thresholds and quiet greetings so your home feels relaxed — for you, your guests, and your dog.',
    title: 'Dog Behaviour Training Golden Bay & Takaka',
    metaDescription:
      'Dog behaviour training in Golden Bay — stop door bolting, jumping on visitors, demand barking, and unsettled home life. Calm thresholds with Warwick Marshall.',
    keywords:
      'dog behaviour training Golden Bay, dog behaviourist Golden Bay, door bolting dog, jumping on visitors, dog won\'t settle, Warwick Marshall',
    h1: 'Dog Behaviour Training in Golden Bay & Takaka',
    lead:
      'Jumping on visitors, bolting the door, barking, or a dog that can’t settle. We build calm access and quiet greetings so the house feels relaxed for you, guests, and the dog.',
    symptoms: [
      'jumps on visitors',
      'bolts out the front door',
      'barks at every knock or delivery',
      'can’t settle when company arrives',
      'demand pawing and lean-ins at thresholds',
    ],
    problemClusters: [
      {
        heading: 'Door behaviour and visitor greetings',
        phrases: ['door bolting', 'jumping on people', 'barking at knocks and deliveries'],
      },
      {
        heading: 'Dogs that can’t settle',
        phrases: [
          'can’t settle when company arrives',
          'demand pawing at thresholds',
          'household tension around access',
        ],
      },
    ],
    outcomes: [
      'Doors and greetings under your control',
      'A dog that can hold place while life moves around them',
      'Less household tension because access is earned',
    ],
    approach:
      'Home manners are access training — clear boundaries and impulse control. We rebuild who controls doorways, space, and attention — then practice greetings as structured events, not chaos the dog rehearses every day.',
    guideIntro:
      'If you want the principles behind thresholds, access, and household dynamics, see the Client Guide.',
    guideLinks: [
      { anchor: 'front-door', label: 'Front door and thresholds' },
      { anchor: 'i-dont-care', label: 'Calm access standard' },
      { anchor: 'love-at-the-right-time', label: 'Love at the right time' },
      { anchor: 'access', label: 'Access training' },
    ],
    relatedServiceSlugs: ['obedience-training', 'puppy-training', 'owner-coaching'],
    schemaName: 'Dog behaviour and home manners training',
    schemaDescription:
      'In-person coaching for door manners, visitor greetings, settle, and calm household thresholds in Golden Bay.',
  },
  {
    slug: 'reactive-dog',
    path: '/reactive-dog',
    icon: '🤝',
    cardTitle: 'Reactive dog & social calm',
    cardDescription:
      'Structured sessions with the right dogs — including Controlled Confrontation with a balanced master helper dog when pushiness needs native canine feedback. Yours learns healthy social habits and how to be corrected naturally.',
    title: 'Reactive Dog Training Golden Bay & Takaka',
    metaDescription:
      'Reactive dog training in Golden Bay — lunging, barking at dogs, lead aggression, and fixation. Structured social calm with Warwick Marshall.',
    keywords:
      'reactive dog training Golden Bay, dog lunging at other dogs, dog barking at dogs, dog aggressive on lead, dog socialisation, Warwick Marshall',
    h1: 'Reactive Dog Training in Golden Bay',
    lead:
      'Lunging, barking at other dogs, fixation, or explosive greetings — structured dog-to-dog work and handler coaching so social moments stay on your terms. Socialisation here means clear structure, not chaotic flooding.',
    symptoms: [
      'reactive on leash toward other dogs',
      'explosive greetings or fence fighting',
      'pushy mounting and barging in groups',
      'can’t read play vs escalation',
      'owner freezes and misses the early signals',
    ],
    problemClusters: [
      {
        heading: 'Dog lunging and barking at other dogs',
        phrases: [
          'leash reactivity',
          'dog aggressive on lead',
          'fence fighting and explosive greetings',
        ],
      },
      {
        heading: 'Dog fixation and social friction',
        phrases: [
          'locked stare that won’t break',
          'misread play vs escalation',
          'structured dog socialisation — not flooding',
        ],
      },
    ],
    outcomes: [
      'Clearer reads of social friction before the snap',
      'Meetings held on terms you control',
      'A dog that can hold neutrality instead of rehearsing chaos',
    ],
    approach:
      'We do not “socialise” by flooding. Facilitated dog-to-dog work uses pack language — including master-helper feedback when appropriate — while you learn micro-signals of social friction and when to intervene. Behavioural rehabilitation for harder cases pairs with our difficult-dogs coaching.',
    guideIntro:
      'If you want to understand why fixation develops and how Controlled Confrontation works, see the Client Guide.',
    guideLinks: [
      { anchor: 'controlled-confrontation', label: 'Controlled Confrontation' },
      { anchor: 'social-friction', label: 'Micro-signals of social friction' },
      { anchor: 'master-dog', label: 'The master dog' },
      { anchor: 'reading-dog', label: 'Reading behaviour' },
    ],
    relatedServiceSlugs: ['leash-training', 'difficult-dogs', 'owner-coaching'],
    schemaName: 'Reactive dog and social calm training',
    schemaDescription:
      'In-person coaching for dog-to-dog calm, leash reactivity, and structured social feedback including Controlled Confrontation.',
  },
  {
    slug: 'difficult-dogs',
    path: '/difficult-dogs',
    icon: '🔗',
    cardTitle: 'Difficult or complex cases',
    cardDescription:
      'For dogs with a hard history, high anxiety, or habits that feel stuck. We meet your dog where it is — safely, without force — and rebuild the trust that training needs to take hold.',
    title: 'Dog Training for Difficult Dogs | Golden Bay',
    metaDescription:
      'Dog training for difficult or complex cases in Golden Bay — anxiety, hard history, and stuck habits. Structured rehabilitation coaching with Warwick Marshall.',
    keywords:
      'dog training difficult dogs Golden Bay, anxious dog training Takaka, dog rehabilitation Golden Bay, hard history dog coaching, Warwick Marshall',
    h1: 'Dog Training for Difficult or Complex Cases',
    lead:
      'For dogs with a hard history, high anxiety, or habits that feel stuck. We meet the dog where it is — safely — and rebuild the trust and structure behavioural rehabilitation needs to take hold.',
    symptoms: [
      'high anxiety that won’t settle',
      'shutdown or fear around handling',
      'compulsive licking, pacing, or fixation loops',
      'aggression or panic with a difficult past',
      'training that collapses after every setback',
    ],
    problemClusters: [
      {
        heading: 'Anxiety and stuck patterns',
        phrases: [
          'won’t settle',
          'compulsive licking or pacing',
          'training that collapses after every setback',
        ],
      },
      {
        heading: 'Hard histories and complex behaviour',
        phrases: [
          'shutdown or fear around handling',
          'aggression or panic with a difficult past',
          'behavioural rehabilitation with clear safety',
        ],
      },
    ],
    outcomes: [
      'A clearer map of drivers vs symptoms',
      'Safer handling and access while capacity rebuilds',
      'A path that substitutes needs instead of only suppressing behaviour',
    ],
    approach:
      'Rehab here uses pattern playbooks and behaviour-driver calibration — trauma vs hardship, substitution not suppression — so you stop chasing symptoms and start answering what the nervous system is asking for.',
    guideIntro:
      'If you want the deeper map of drivers, trauma vs hardship, and rehabilitation patterns, see the Client Guide.',
    guideLinks: [
      { anchor: 'rehabilitation-patterns', label: 'Rehabilitation patterns' },
      { anchor: 'behavior-driver-calibration', label: 'Behaviour-driver calibration' },
      { anchor: 'trauma-vs-hardship', label: 'Trauma vs hardship' },
      { anchor: 'symptom-glossary', label: 'Symptom glossary' },
    ],
    relatedServiceSlugs: ['reactive-dog', 'owner-coaching', 'leash-training'],
    schemaName: 'Dog training for difficult and complex cases',
    schemaDescription:
      'Structured rehabilitation coaching for reactivity, anxiety, hard histories, and stuck behavioural patterns in Golden Bay.',
  },
  {
    slug: 'owner-coaching',
    path: '/owner-coaching',
    icon: '🧭',
    cardTitle: 'Owner coaching',
    cardDescription:
      "Your energy, attention, and consistency are the most powerful tools your dog has. Every session coaches you in how to hold your own — so the results don't disappear the moment Warwick leaves.",
    title: 'Dog Owner Coaching Golden Bay & Takaka',
    metaDescription:
      'Dog owner coaching in Golden Bay — learn to train your dog with embodied leadership, household sessions, and standards that last after the trainer leaves.',
    keywords:
      'dog owner coaching Golden Bay, dog owner training, learn to train your dog, private household dog training, handler leadership, Warwick Marshall',
    h1: 'Owner Coaching — Learn to Train Your Dog',
    lead:
      'Your energy, attention, and consistency are the most powerful tools your dog has. Sessions coach you to hold your own — including private household and elite coaching paths — so results don’t vanish when Warwick leaves.',
    symptoms: [
      'knows what to do but can’t hold the line at home',
      'inconsistent between partners in the household',
      'anxious handler energy that the dog feeds on',
      'wants deeper private or elite-level coaching',
      'results fade between sessions',
    ],
    problemClusters: [
      {
        heading: 'Dog owner education and handler leadership',
        phrases: [
          'learn to train your dog',
          'household alignment on standards',
          'results that stay when you are alone with the dog',
        ],
      },
      {
        heading: 'Private and elite coaching paths',
        phrases: [
          'embodied leadership',
          'anxious handler energy',
          'deeper private household sessions',
        ],
      },
    ],
    outcomes: [
      'Clearer pack-leader energy and timing',
      'Household alignment on standards',
      'Skills that transfer when you are alone with the dog',
    ],
    approach:
      'Every session is owner coaching. Elite and private household work intensify that: embodied leadership, measured correction, and a standard for both dog and handler — relationship before a longer cue list.',
    guideIntro:
      'If you want the mindset and energy principles behind lasting handler leadership, see the Client Guide.',
    guideLinks: [
      { anchor: 'pack-leader-energy', label: 'Pack-leader energy' },
      { anchor: 'owner-mindset', label: 'Owner mindset' },
      { anchor: 'gold-standard-rule', label: 'The Gold Standard Rule' },
      { anchor: 'dog-tantra', label: 'Dog-Tantra' },
    ],
    relatedServiceSlugs: ['obedience-training', 'difficult-dogs', 'dog-behaviour'],
    schemaName: 'Dog owner coaching and private training',
    schemaDescription:
      'In-person owner coaching, private household sessions, and elite coaching for lasting handler leadership in Golden Bay.',
  },
];

export const AREA_SEO: AreaSeoEntry[] = [
  {
    slug: 'golden-bay',
    name: 'Golden Bay',
    title: 'Dog Trainer Golden Bay | Warwick Marshall',
    metaDescription:
      'Dog trainer in Golden Bay, NZ — Warwick Marshall offers obedience, puppy training, recall, reactivity, and rehab. Book in-person sessions. Call 027 814 2222.',
    keywords:
      'dog trainer Golden Bay, dog training Golden Bay NZ, Warwick Marshall Golden Bay, obedience Golden Bay',
    h1: 'Dog training across Golden Bay.',
    lead:
      'Based in Takaka and working beaches, roads, and homes across Golden Bay — structured coaching where behaviour has to hold in real life.',
    body:
      'Golden Bay is home base: Takaka, coastal walks, markets, and the everyday distractions that break soft training. Sessions are in-person and tailored — from puppy structure to rehab and reactivity. If you searched for a dog trainer in Golden Bay, this is the service area we know best. From here the geographic map widens to Tasman, Nelson Bays, and New Zealand — without thin doorway pages for every town.',
    placeName: 'Golden Bay, New Zealand',
  },
  {
    slug: 'takaka',
    name: 'Takaka',
    title: 'Dog Trainer Takaka | Warwick Marshall',
    metaDescription:
      'Dog trainer in Takaka, Golden Bay — Warwick Marshall for obedience, puppies, leash work, and rehabilitation. Based in Rangihaeata. Call 027 814 2222.',
    keywords:
      'dog trainer Takaka, dog training Takaka, Warwick Marshall Takaka, puppy training Takaka',
    h1: 'Dog training in Takaka.',
    lead:
      'Gold Standard Dog Training is based in Rangihaeata, Takaka. Local sessions, clear standards, and coaching that travels with you into daily Takaka life.',
    body:
      'Takaka is where the business is rooted. Expect hands-on work in environments your dog actually lives in — doors, streets, and public spaces — plus access to the wider Golden Bay and Tasman service map when you need it.',
    placeName: 'Takaka, New Zealand',
  },
  {
    slug: 'pohara',
    name: 'Pohara',
    title: 'Dog Trainer Pohara | Golden Bay',
    metaDescription:
      'Dog training for Pohara and Golden Bay — leash work, recall, obedience, and rehab with Warwick Marshall. In-person coaching near the coast. Call 027 814 2222.',
    keywords:
      'dog trainer Pohara, dog training Pohara Golden Bay, Warwick Marshall Pohara',
    h1: 'Dog training for Pohara households.',
    lead:
      'Coastal distractions are the point — beaches, visitors, and busy seasons. Coaching for Pohara dogs that need manners and control where it matters.',
    body:
      'Pohara clients often need leash reliability, recall near the water, and calm around holiday foot traffic. Sessions are booked through the same Golden Bay practice based in Takaka.',
    placeName: 'Pohara, New Zealand',
  },
  {
    slug: 'nelson-bays',
    name: 'Nelson Bays',
    title: 'Dog Trainer Nelson Bays | Tasman Region',
    metaDescription:
      'Dog trainer serving Nelson Bays and the Tasman region — Warwick Marshall for obedience, reactivity, and rehabilitation. Enquire or book. Call 027 814 2222.',
    keywords:
      'dog trainer Nelson Bays, dog training Nelson Bays, dog training Nelson, Warwick Marshall Tasman',
    h1: 'Dog training across Nelson Bays.',
    lead:
      'Serving the wider Nelson Bays side of the Tasman region with the same structured method used in Golden Bay — in-person coaching for real-world reliability.',
    body:
      'Nelson Bays coverage means travel and scheduling aligned to the region (Nelson/Tasman). Check current online booking options for your service type, or enquire — Warwick will confirm the best next step for your town and dog. We do not create thin town doorway pages; genuine coverage lives here and on Motueka / Richmond pages.',
    placeName: 'Nelson Bays, New Zealand',
  },
  {
    slug: 'motueka',
    name: 'Motueka',
    title: 'Dog Trainer Motueka | Tasman',
    metaDescription:
      'Dog training for Motueka and Tasman — obedience, leash work, puppies, and rehab with Warwick Marshall, serving Motueka from Golden Bay. Call 027 814 2222.',
    keywords:
      'dog trainer Motueka, dog training Motueka, Warwick Marshall Motueka',
    h1: 'Dog training for Motueka.',
    lead:
      'Motueka households looking for clear standards — not soft guesswork. In-person coaching available through the Tasman service area.',
    body:
      'From Motueka, sessions fit into the wider Nelson Bays / Tasman coverage. Bring the problems you actually live with: pulling, door manners, reactivity, or a puppy that needs structure early.',
    placeName: 'Motueka, New Zealand',
  },
  {
    slug: 'richmond',
    name: 'Richmond',
    title: 'Dog Trainer Richmond NZ | Tasman',
    metaDescription:
      'Dog training for Richmond, Tasman — Warwick Marshall for obedience, recall, reactivity, and rehab. Serving Richmond in the Tasman region. Call 027 814 2222.',
    keywords:
      'dog trainer Richmond NZ, dog training Richmond Tasman, Warwick Marshall Richmond',
    h1: 'Dog training for Richmond.',
    lead:
      'Richmond and nearby Tasman households — structured coaching for manners, control, and rehabilitation when generic classes are not enough.',
    body:
      'Richmond sits in the wider Tasman service map. Enquire or book to confirm timing and travel for your household; the method is the same Gold Standard standard used in Golden Bay.',
    placeName: 'Richmond, New Zealand',
  },
];

const serviceBySlug = new Map(SERVICE_SEO.map((s) => [s.slug, s]));
const serviceByPath = new Map(SERVICE_SEO.map((s) => [s.path, s]));
const areaBySlug = new Map(AREA_SEO.map((a) => [a.slug, a]));

export function getServiceSeo(slug: string): ServiceSeoEntry | undefined {
  return serviceBySlug.get(slug as ServiceSlug);
}

export function getServiceSeoByPath(path: string): ServiceSeoEntry | undefined {
  return serviceByPath.get(path);
}

export function getAreaSeo(slug: string): AreaSeoEntry | undefined {
  return areaBySlug.get(slug as AreaSlug);
}

export function isServiceSlug(slug: string): slug is ServiceSlug {
  return serviceBySlug.has(slug as ServiceSlug);
}

export function isAreaSlug(slug: string): slug is AreaSlug {
  return areaBySlug.has(slug as AreaSlug);
}

export function getLegacyServiceRedirect(legacySlug: string): string | undefined {
  return LEGACY_SERVICE_REDIRECTS[legacySlug];
}

export const SERVICE_PATHS = SERVICE_SEO.map((s) => s.path);
export const AREA_PATHS = AREA_SEO.map((a) => `/areas/${a.slug}`);

/** Homepage problem chips — crawlable symptom → commercial URL. */
export const HOME_PROBLEM_CHIPS: { label: string; to: string }[] = [
  { label: 'Pulling?', to: '/leash-training' },
  { label: 'Lunging?', to: '/reactive-dog' },
  { label: 'Barking?', to: '/dog-behaviour' },
  { label: 'Jumping?', to: '/dog-behaviour' },
  { label: 'Can’t settle?', to: '/dog-behaviour' },
  { label: 'Won’t come when called?', to: '/recall-training' },
];
