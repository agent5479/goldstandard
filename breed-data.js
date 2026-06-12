/* ============================================================
   Gold Standard Dog Training — breed → temperament category map
   Categories mirror guide.html (#breed-temperament, #common-pitfalls):
     clingy   — people-focused, bonds intensely (staffy-types)
     herding  — visual, fixation-prone (collies, heading dogs)
     terrier  — high-drive working types, needs outlets
     guardian — alert / protective breeds, vigilance-prone
     small    — small breeds, carrying & "cute" excuse risks
   ============================================================ */

const GSDT_BREED_CATEGORIES = {
  clingy: {
    label: 'Clingy & people-focused',
    note: 'Bonds intensely and is highly responsive to affection — but sensitive to harsh rejection or corrections delivered with frustration. Calm, matter-of-fact energy; rebuild quickly after a reset.'
  },
  herding: {
    label: 'Visual & herding type',
    note: 'Wired to track motion and prone to eye-lock fixation. Watch the stare before the lunge, favour access and environmental rewards, and avoid prolonged face-to-face gazing rituals.'
  },
  terrier: {
    label: 'Terrier & high-drive working type',
    note: 'Needs sniff, run, and problem-solving outlets. Denied those, frustration surfaces as fixation, reactivity, or destruction. Access training is often the right currency.'
  },
  guardian: {
    label: 'Guardian & alert type',
    note: 'Prone to vigilance. Rewarding every wary glance with reassurance entrenches anxiety — calm leadership and earned access matter more than comfort-talk.'
  },
  small: {
    label: 'Small breed',
    note: 'Carrying, hand-feeding, and excusing pushy behaviour because it is "cute" often produces a dog that cannot tolerate boundaries from anyone — including you.'
  }
};

/* Breed list — name plus category key. Mixed/unlisted dogs choose the
   closest temperament directly via the category cards. */
const GSDT_BREEDS = [
  // Clingy, people-focused
  { name: 'Staffordshire Bull Terrier (Staffy)', category: 'clingy' },
  { name: 'American Staffordshire Terrier', category: 'clingy' },
  { name: 'Pit Bull type', category: 'clingy' },
  { name: 'Labrador Retriever', category: 'clingy' },
  { name: 'Golden Retriever', category: 'clingy' },
  { name: 'Boxer', category: 'clingy' },
  { name: 'Vizsla', category: 'clingy' },
  { name: 'Weimaraner', category: 'clingy' },
  { name: 'Great Dane', category: 'clingy' },
  { name: 'Greyhound', category: 'clingy' },
  { name: 'Whippet', category: 'clingy' },
  { name: 'Cocker Spaniel', category: 'clingy' },
  { name: 'Springer Spaniel', category: 'clingy' },
  { name: 'Brittany Spaniel', category: 'clingy' },
  { name: 'Pointer (English / GSP)', category: 'clingy' },
  { name: 'Dalmatian', category: 'clingy' },
  { name: 'Poodle (Standard)', category: 'clingy' },
  { name: 'Labradoodle / Groodle', category: 'clingy' },
  { name: 'Cavoodle / Spoodle', category: 'clingy' },
  { name: 'Bulldog (British)', category: 'clingy' },
  { name: 'Bull Terrier', category: 'clingy' },

  // Visual, herding types
  { name: 'Border Collie', category: 'herding' },
  { name: 'NZ Heading Dog', category: 'herding' },
  { name: 'NZ Huntaway', category: 'herding' },
  { name: 'Rough / Smooth Collie', category: 'herding' },
  { name: 'Bearded Collie', category: 'herding' },
  { name: 'Australian Shepherd', category: 'herding' },
  { name: 'Australian Cattle Dog (Blue Heeler)', category: 'herding' },
  { name: 'Kelpie', category: 'herding' },
  { name: 'Shetland Sheepdog (Sheltie)', category: 'herding' },
  { name: 'Old English Sheepdog', category: 'herding' },
  { name: 'Welsh Corgi (Pembroke / Cardigan)', category: 'herding' },
  { name: 'Belgian Shepherd (Groenendael / Tervuren)', category: 'herding' },
  { name: 'Samoyed', category: 'herding' },
  { name: 'Siberian Husky', category: 'herding' },
  { name: 'Alaskan Malamute', category: 'herding' },

  // Terriers & high-drive working types
  { name: 'Jack Russell Terrier', category: 'terrier' },
  { name: 'Fox Terrier', category: 'terrier' },
  { name: 'Border Terrier', category: 'terrier' },
  { name: 'Cairn Terrier', category: 'terrier' },
  { name: 'West Highland White Terrier (Westie)', category: 'terrier' },
  { name: 'Scottish Terrier', category: 'terrier' },
  { name: 'Airedale Terrier', category: 'terrier' },
  { name: 'Patterdale Terrier', category: 'terrier' },
  { name: 'Lakeland Terrier', category: 'terrier' },
  { name: 'Schnauzer (Standard / Miniature)', category: 'terrier' },
  { name: 'Beagle', category: 'terrier' },
  { name: 'Harrier Hound', category: 'terrier' },
  { name: 'Dachshund', category: 'terrier' },
  { name: 'Pig Dog (NZ hunting cross)', category: 'terrier' },
  { name: 'Spaniel-cross working dog', category: 'terrier' },

  // Guardian & alert breeds
  { name: 'German Shepherd', category: 'guardian' },
  { name: 'Belgian Malinois', category: 'guardian' },
  { name: 'Rottweiler', category: 'guardian' },
  { name: 'Doberman', category: 'guardian' },
  { name: 'Mastiff (English / Bull / Neapolitan)', category: 'guardian' },
  { name: 'Cane Corso', category: 'guardian' },
  { name: 'Rhodesian Ridgeback', category: 'guardian' },
  { name: 'Akita', category: 'guardian' },
  { name: 'Shar Pei', category: 'guardian' },
  { name: 'Chow Chow', category: 'guardian' },
  { name: 'Anatolian Shepherd / Maremma', category: 'guardian' },
  { name: 'Bernese Mountain Dog', category: 'guardian' },
  { name: 'Newfoundland', category: 'guardian' },
  { name: 'St Bernard', category: 'guardian' },

  // Small breeds
  { name: 'Chihuahua', category: 'small' },
  { name: 'Shih Tzu', category: 'small' },
  { name: 'Maltese', category: 'small' },
  { name: 'Pomeranian', category: 'small' },
  { name: 'Papillon', category: 'small' },
  { name: 'Toy / Miniature Poodle', category: 'small' },
  { name: 'Bichon Frise', category: 'small' },
  { name: 'Cavalier King Charles Spaniel', category: 'small' },
  { name: 'Pug', category: 'small' },
  { name: 'French Bulldog', category: 'small' },
  { name: 'Boston Terrier', category: 'small' },
  { name: 'Yorkshire Terrier', category: 'small' },
  { name: 'Lhasa Apso', category: 'small' },
  { name: 'Pekingese', category: 'small' },
  { name: 'Italian Greyhound', category: 'small' }
];
