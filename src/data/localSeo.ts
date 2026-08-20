/** Local SEO entity pages — services and service areas. */

export type ServiceSlug =
  | 'everyday-obedience'
  | 'puppy-training'
  | 'leash-recall-control'
  | 'home-manners'
  | 'dog-social-calm'
  | 'rehabilitation'
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

export interface ServiceSeoEntry {
  slug: ServiceSlug;
  /** Homepage card icon (emoji) when linked from home. */
  icon: string;
  /** Short card title (home / hub). */
  cardTitle: string;
  /** Short card blurb. */
  cardDescription: string;
  /** Document / OG title. */
  title: string;
  metaDescription: string;
  h1: string;
  lead: string;
  /** Review-style phrases clients and prompts use. */
  symptoms: string[];
  outcomes: string[];
  /** How GSDT approaches this (unique method voice). */
  approach: string;
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
  h1: string;
  lead: string;
  body: string;
  /** Place name for schema. */
  placeName: string;
}

export const SERVICES_HUB = {
  title: 'Dog Training Services | Golden Bay & Tasman | Gold Standard Dog Training',
  metaDescription:
    'Dog training services with Warwick Marshall in Golden Bay and the Tasman region — obedience, puppy start, leash and recall, home manners, dog-social calm, rehabilitation, and owner coaching.',
  h1: 'Services built for real households.',
  lead:
    'Every offer is in-person coaching with clear standards — not a generic class syllabus. Pick the focus that matches what you are living with, then book a session in Golden Bay or across the Tasman region.',
} as const;

export const AREAS_HUB = {
  title: 'Service Areas | Golden Bay, Takaka & Nelson Bays | Gold Standard Dog Training',
  metaDescription:
    'Dog training with Warwick Marshall across Golden Bay, Takaka, Pohara, Nelson Bays, Motueka, and Richmond. In-person sessions based in Takaka, serving the wider Tasman region.',
  h1: 'Where we train.',
  lead:
    'Gold Standard Dog Training is based in Takaka, Golden Bay, and works with dogs and owners across the Tasman region — beaches, roads, homes, and everyday public spaces where behaviour has to hold.',
} as const;

export const SERVICE_SEO: ServiceSeoEntry[] = [
  {
    slug: 'everyday-obedience',
    icon: '🐕',
    cardTitle: 'Everyday manners & obedience',
    cardDescription:
      'Sit, lie, wait, heel, come when called — the basics that make daily life easy, built around your goals. With the right mix of correction, reward, and your own energy, your dog can be shaped into almost anything you want.',
    title: 'Everyday Obedience & Manners | Dog Training Golden Bay | Gold Standard',
    metaDescription:
      'Everyday dog obedience in Golden Bay and Takaka — sit, wait, heel, and reliable recall with Warwick Marshall. Clear standards for daily life across the Tasman region.',
    h1: 'Everyday manners that hold when life gets busy.',
    lead:
      'Sit, lie, wait, heel, and come when called — the basics that make walks, doorways, and guests manageable. Built around your household goals, not a one-size class script.',
    symptoms: [
      'won’t sit or wait at the door',
      'ignores known cues when distracted',
      'pulls ahead instead of walking with you',
      'comes when called only when it suits them',
      'basic manners collapse around guests or food',
    ],
    outcomes: [
      'Cues that land the first time in normal home and street contexts',
      'A handler who knows when to ask, when to correct, and when to release',
      'Daily life that feels calmer because standards are consistent',
    ],
    approach:
      'We treat obedience as relationship and rank clarity, not treat bribery. Your energy, timing, and follow-through do more than a longer cue list. Sessions calibrate what “done” looks like for your dog, then coach you to hold that line after Warwick leaves.',
    guideLinks: [
      { anchor: 'gold-standard-rule', label: 'The Gold Standard Rule' },
      { anchor: 'cue-once', label: 'Cue once' },
      { anchor: 'i-dont-care', label: 'The “I don’t care” standard' },
    ],
    relatedServiceSlugs: ['leash-recall-control', 'home-manners', 'owner-coaching'],
    schemaName: 'Everyday obedience and manners training',
    schemaDescription:
      'In-person obedience and daily manners coaching — sit, wait, heel, recall, and owner standards for home and public life.',
  },
  {
    slug: 'puppy-training',
    icon: '🐶',
    cardTitle: 'Puppies started right',
    cardDescription:
      'The early months set everything up. Toilet training, biting and mouthing, crate and sleep routines, and calm structure — matched to your puppy’s age so you build the right habits before problems ever take hold.',
    title: 'Puppy Training Golden Bay & Takaka | Gold Standard Dog Training',
    metaDescription:
      'Puppy training in Golden Bay and Takaka — toilet training, biting, crate routines, and early structure with Warwick Marshall. Start habits before problems lock in.',
    h1: 'Puppies started with structure, not guesswork.',
    lead:
      'The early months set the household. Toilet training, biting and mouthing, crate and sleep routines, and calm access — matched to age so you build the right habits before problems take hold.',
    symptoms: [
      'puppy biting and mouthing that won’t settle',
      'toilet accidents and no clear house routine',
      'crate or sleep battles at night',
      'jumping and wild greetings already starting',
      'unsure what to allow at seven weeks vs seven months',
    ],
    outcomes: [
      'Age-appropriate expectations you can actually hold',
      'Toilet, rest, and access routines that reduce chaos',
      'A puppy learning calm access instead of rehearsing demand',
    ],
    approach:
      'Puppy work here is about leadership and nervous-system capacity, not endless socialisation playdates. We match structure to developmental stage and teach you to read arousal early — so freedom is earned, not assumed.',
    guideLinks: [
      { anchor: 'expectations', label: 'Age and expectation standards' },
      { anchor: 'i-dont-care', label: 'Seven-month adult standard' },
      { anchor: 'eight-week-separation', label: 'Early separation and attachment' },
    ],
    relatedServiceSlugs: ['everyday-obedience', 'home-manners', 'owner-coaching'],
    schemaName: 'Puppy training and early structure',
    schemaDescription:
      'In-person puppy coaching — toilet training, biting and mouthing, crate routines, and calm household structure.',
  },
  {
    slug: 'leash-recall-control',
    icon: '🛡️',
    cardTitle: 'Safe and under control',
    cardDescription:
      'Stopping the lunge, breaking a fixation, walking without pulling or cutting in front, staying aware of the road. The skills that matter when something unexpected happens — so you can trust your dog in any situation.',
    title: 'Leash Training & Recall | Golden Bay Dog Trainer | Gold Standard',
    metaDescription:
      'Leash training and recall in Golden Bay — stop pulling, lunging, and road fixation. Warwick Marshall coaches reliable control for walks and real-world distractions.',
    h1: 'Leash work and recall you can trust on the road.',
    lead:
      'Stopping the lunge, breaking a fixation, walking without pulling or cutting in front, staying aware of the road — the skills that matter when something unexpected happens.',
    symptoms: [
      'pulls on the leash the whole walk',
      'lunges at dogs, bikes, or cars',
      'won’t come back at the beach or park',
      'fixation that won’t break with a cue',
      'cuts in front and ignores road danger',
    ],
    outcomes: [
      'Walks that feel shared instead of dragged',
      'A recall that means leave and return, not negotiate',
      'Handler timing that interrupts fixation in the one-second window',
    ],
    approach:
      'Leash and recall are trained as measured communication — body, voice, and collar clarity — not endless treat trails. We practice where distractions are real: beaches, roads, and public edges of Golden Bay and Nelson Bays life.',
    guideLinks: [
      { anchor: 'go-get-recall', label: 'Go-get recall' },
      { anchor: 'ready-stance', label: 'Ready stance' },
      { anchor: 'timing', label: 'Timing and the one-second window' },
    ],
    relatedServiceSlugs: ['everyday-obedience', 'dog-social-calm', 'rehabilitation'],
    schemaName: 'Leash training and recall coaching',
    schemaDescription:
      'In-person leash manners, lunging interruption, road awareness, and reliable recall coaching.',
  },
  {
    slug: 'home-manners',
    icon: '🏠',
    cardTitle: 'Calm at home & greetings',
    cardDescription:
      'Jumping on visitors, bolting the door, barking, or a dog that just can’t settle. We build calm thresholds and quiet greetings so your home feels relaxed — for you, your guests, and your dog.',
    title: 'Home Manners & Door Training | Golden Bay | Gold Standard Dog Training',
    metaDescription:
      'Home dog manners in Golden Bay — stop door bolting, jumping on visitors, and demand barking. Calm thresholds and greetings with Warwick Marshall.',
    h1: 'Calm thresholds, doors, and greetings at home.',
    lead:
      'Jumping on visitors, bolting the door, barking, or a dog that can’t settle. We build calm access and quiet greetings so the house feels relaxed for you, guests, and the dog.',
    symptoms: [
      'jumps on visitors',
      'bolts out the front door',
      'barks at every knock or delivery',
      'can’t settle when company arrives',
      'demand pawing and lean-ins at thresholds',
    ],
    outcomes: [
      'Doors and greetings under your control',
      'A dog that can hold place while life moves around them',
      'Less household tension because access is earned',
    ],
    approach:
      'Home manners are access training. We rebuild who controls doorways, space, and attention — then practice greetings as structured events, not chaos the dog rehearses every day.',
    guideLinks: [
      { anchor: 'front-door', label: 'Front door and thresholds' },
      { anchor: 'i-dont-care', label: 'Calm access standard' },
      { anchor: 'love-at-the-right-time', label: 'Love at the right time' },
    ],
    relatedServiceSlugs: ['everyday-obedience', 'puppy-training', 'owner-coaching'],
    schemaName: 'Home manners and greeting training',
    schemaDescription:
      'In-person coaching for door manners, visitor greetings, settle, and calm household thresholds.',
  },
  {
    slug: 'dog-social-calm',
    icon: '🤝',
    cardTitle: 'Calm around other dogs',
    cardDescription:
      'Structured sessions with the right dogs — including Controlled Confrontation with a balanced master helper dog when pushiness needs native canine feedback. Yours learns healthy social habits and how to be corrected naturally.',
    title: 'Reactive Dog Training & Social Calm | Golden Bay | Gold Standard',
    metaDescription:
      'Dog reactivity and social calm training in Golden Bay — structured dog meetings, Controlled Confrontation, and handler coaching with Warwick Marshall.',
    h1: 'Calm around other dogs — structured, not chaotic.',
    lead:
      'Structured work with the right dogs — including Controlled Confrontation with a balanced master helper dog when pushiness needs native canine feedback. A social dog is a settled dog.',
    symptoms: [
      'reactive on leash toward other dogs',
      'explosive greetings or fence fighting',
      'pushy mounting and barging in groups',
      'can’t read play vs escalation',
      'owner freezes and misses the early signals',
    ],
    outcomes: [
      'Clearer reads of social friction before the snap',
      'Meetings held on terms you control',
      'A dog that can hold neutrality instead of rehearsing chaos',
    ],
    approach:
      'We do not “socialise” by flooding. Facilitated dog-to-dog work uses pack language — including master-helper feedback when appropriate — while you learn micro-signals of social friction and when to intervene.',
    guideLinks: [
      { anchor: 'controlled-confrontation', label: 'Controlled Confrontation' },
      { anchor: 'social-friction', label: 'Micro-signals of social friction' },
      { anchor: 'master-dog', label: 'The master dog' },
    ],
    relatedServiceSlugs: ['leash-recall-control', 'rehabilitation', 'owner-coaching'],
    schemaName: 'Dog social calm and reactivity training',
    schemaDescription:
      'In-person coaching for dog-to-dog calm, leash reactivity, and structured social feedback including Controlled Confrontation.',
  },
  {
    slug: 'rehabilitation',
    icon: '🔗',
    cardTitle: 'A fresh start for tough cases',
    cardDescription:
      'For dogs with a hard history, high anxiety, or habits that feel stuck. We meet your dog where it is — safely, without force — and rebuild the trust that training needs to take hold.',
    title: 'Dog Rehabilitation Coaching | Golden Bay & Tasman | Gold Standard',
    metaDescription:
      'Dog rehabilitation in Golden Bay — anxiety, hard history, and stuck habits. Structured, safety-first coaching with Warwick Marshall across the Tasman region.',
    h1: 'Rehabilitation for hard histories and stuck patterns.',
    lead:
      'For dogs with a hard history, high anxiety, or habits that feel stuck. We meet the dog where it is — safely — and rebuild the trust and structure training needs to take hold.',
    symptoms: [
      'high anxiety that won’t settle',
      'shutdown or fear around handling',
      'compulsive licking, pacing, or fixation loops',
      'aggression or panic with a difficult past',
      'training that collapses after every setback',
    ],
    outcomes: [
      'A clearer map of drivers vs symptoms',
      'Safer handling and access while capacity rebuilds',
      'A path that substitutes needs instead of only suppressing behaviour',
    ],
    approach:
      'Rehab here uses pattern playbooks and behaviour-driver calibration — trauma vs hardship, substitution not suppression — so you stop chasing symptoms and start answering what the nervous system is asking for.',
    guideLinks: [
      { anchor: 'rehabilitation-patterns', label: 'Rehabilitation patterns' },
      { anchor: 'behavior-driver-calibration', label: 'Behaviour-driver calibration' },
      { anchor: 'trauma-vs-hardship', label: 'Trauma vs hardship' },
    ],
    relatedServiceSlugs: ['dog-social-calm', 'owner-coaching', 'leash-recall-control'],
    schemaName: 'Dog rehabilitation coaching',
    schemaDescription:
      'Structured rehabilitation coaching for reactivity, anxiety, hard histories, and stuck behavioural patterns.',
  },
  {
    slug: 'owner-coaching',
    icon: '🧭',
    cardTitle: 'Coaching for you, too',
    cardDescription:
      "Your energy, attention, and consistency are the most powerful tools your dog has. Every session coaches you in how to hold your own — so the results don't disappear the moment Warwick leaves.",
    title: 'Owner Coaching & Elite Dog Training | Golden Bay | Gold Standard',
    metaDescription:
      'Owner coaching and elite private dog training in Golden Bay — embodied leadership, private household sessions, and standards that last after the trainer leaves.',
    h1: 'Coaching for the handler — so results stay.',
    lead:
      'Your energy, attention, and consistency are the most powerful tools your dog has. Sessions coach you to hold your own — including private household and elite coaching paths — so results don’t vanish when Warwick leaves.',
    symptoms: [
      'knows what to do but can’t hold the line at home',
      'inconsistent between partners in the household',
      'anxious handler energy that the dog feeds on',
      'wants deeper private or elite-level coaching',
      'results fade between sessions',
    ],
    outcomes: [
      'Clearer pack-leader energy and timing',
      'Household alignment on standards',
      'Skills that transfer when you are alone with the dog',
    ],
    approach:
      'Every session is owner coaching. Elite and private household work intensify that: embodied leadership, measured correction, and a standard for both dog and handler — relationship before a longer cue list.',
    guideLinks: [
      { anchor: 'pack-leader-energy', label: 'Pack-leader energy' },
      { anchor: 'owner-mindset', label: 'Owner mindset' },
      { anchor: 'gold-standard-rule', label: 'The Gold Standard Rule' },
    ],
    relatedServiceSlugs: ['everyday-obedience', 'rehabilitation', 'home-manners'],
    schemaName: 'Owner coaching and private dog training',
    schemaDescription:
      'In-person owner coaching, private household sessions, and elite coaching for lasting handler leadership.',
  },
];

export const AREA_SEO: AreaSeoEntry[] = [
  {
    slug: 'golden-bay',
    name: 'Golden Bay',
    title: 'Dog Trainer Golden Bay | Warwick Marshall | Gold Standard Dog Training',
    metaDescription:
      'Dog trainer in Golden Bay, NZ — Warwick Marshall offers obedience, puppy training, recall, reactivity, and rehabilitation. Book in-person sessions. Call 027 814 2222.',
    h1: 'Dog training across Golden Bay.',
    lead:
      'Based in Takaka and working beaches, roads, and homes across Golden Bay — structured coaching where behaviour has to hold in real life.',
    body:
      'Golden Bay is home base: Takaka, coastal walks, markets, and the everyday distractions that break soft training. Sessions are in-person and tailored — from puppy structure to rehab and reactivity. If you searched for a dog trainer in Golden Bay, this is the service area we know best.',
    placeName: 'Golden Bay, New Zealand',
  },
  {
    slug: 'takaka',
    name: 'Takaka',
    title: 'Dog Trainer Takaka | Warwick Marshall | Gold Standard Dog Training',
    metaDescription:
      'Dog trainer in Takaka, Golden Bay — Warwick Marshall for obedience, puppies, leash work, and rehabilitation. Based in Rangihaeata. Call 027 814 2222.',
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
    title: 'Dog Trainer Pohara | Golden Bay | Gold Standard Dog Training',
    metaDescription:
      'Dog training for Pohara and Golden Bay — leash work, recall, obedience, and rehab with Warwick Marshall. In-person coaching near the coast. Call 027 814 2222.',
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
    title: 'Dog Trainer Nelson Bays | Tasman Region | Gold Standard Dog Training',
    metaDescription:
      'Dog trainer serving Nelson Bays and the Tasman region — Warwick Marshall for obedience, reactivity, and rehabilitation. Enquire or book. Call 027 814 2222.',
    h1: 'Dog training across Nelson Bays.',
    lead:
      'Serving the wider Nelson Bays side of the Tasman region with the same structured method used in Golden Bay — in-person coaching for real-world reliability.',
    body:
      'Nelson Bays coverage means travel and scheduling aligned to the region. Check current online booking options for your service type, or enquire — Warwick will confirm the best next step for your town and dog.',
    placeName: 'Nelson Bays, New Zealand',
  },
  {
    slug: 'motueka',
    name: 'Motueka',
    title: 'Dog Trainer Motueka | Tasman | Gold Standard Dog Training',
    metaDescription:
      'Dog training for Motueka and Tasman — obedience, leash work, puppies, and rehabilitation with Warwick Marshall. Serving the Motueka area from Golden Bay. Call 027 814 2222.',
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
    title: 'Dog Trainer Richmond NZ | Tasman | Gold Standard Dog Training',
    metaDescription:
      'Dog training for Richmond, Tasman — Warwick Marshall for obedience, recall, reactivity, and rehab. Serving Richmond as part of the wider Tasman region. Call 027 814 2222.',
    h1: 'Dog training for Richmond.',
    lead:
      'Richmond and nearby Tasman households — structured coaching for manners, control, and rehabilitation when generic classes are not enough.',
    body:
      'Richmond sits in the wider Tasman service map. Enquire or book to confirm timing and travel for your household; the method is the same Gold Standard standard used in Golden Bay.',
    placeName: 'Richmond, New Zealand',
  },
];

const serviceBySlug = new Map(SERVICE_SEO.map((s) => [s.slug, s]));
const areaBySlug = new Map(AREA_SEO.map((a) => [a.slug, a]));

export function getServiceSeo(slug: string): ServiceSeoEntry | undefined {
  return serviceBySlug.get(slug as ServiceSlug);
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

export const SERVICE_PATHS = SERVICE_SEO.map((s) => `/services/${s.slug}`);
export const AREA_PATHS = AREA_SEO.map((a) => `/areas/${a.slug}`);
