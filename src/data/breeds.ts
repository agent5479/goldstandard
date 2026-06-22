/* ============================================================
   Gold Standard Dog Training — breed → temperament category map
   Categories mirror the guide (#breed-temperament, #common-pitfalls).
   ============================================================ */

export type BreedCategory =
  | 'clingy'
  | 'sighthound'
  | 'herding'
  | 'spitz'
  | 'terrier'
  | 'scenthound'
  | 'guardian'
  | 'giant'
  | 'small';

export interface BreedCategoryInfo {
  label: string;
  note: string;
}

export interface Breed {
  name: string;
  category: BreedCategory;
}

export const breedCategories: Record<BreedCategory, BreedCategoryInfo> = {
  clingy: {
    label: 'Clingy & people-focused',
    note: 'Bonds intensely and is highly responsive to affection — but sensitive to harsh rejection or corrections delivered with frustration. Calm, matter-of-fact energy; rebuild quickly after a reset.'
  },
  sighthound: {
    label: 'Sighthound & chase type',
    note: 'Calm, even lazy at rest — then an explosive chase trigger when movement flashes. Independent and soft-tempered: harsh corrections shut them down, and no correction outruns the chase once it has launched. Manage the trigger window.'
  },
  herding: {
    label: 'Visual & herding type',
    note: 'Wired to track motion and prone to eye-lock fixation. Watch the stare before the lunge, favour access and environmental rewards, and avoid prolonged face-to-face gazing rituals.'
  },
  spitz: {
    label: 'Spitz & sled type',
    note: 'Independent, endurance-driven, and famously vocal. Weak default recall, strong escape instincts — fences and thresholds matter. Earned access and structured outlets beat repetition drills.'
  },
  terrier: {
    label: 'Terrier & high-drive working type',
    note: 'Needs sniff, run, and problem-solving outlets. Denied those, frustration surfaces as fixation, reactivity, or destruction. Access training is often the right currency.'
  },
  scenthound: {
    label: 'Scenthound & nose-led type',
    note: 'When the nose engages, the ears switch off — recall fails on scent, not defiance. Usually strongly food-motivated; reserve a high-value treat and train recall before the nose locks on. Vocal baying is communication, not naughtiness.'
  },
  guardian: {
    label: 'Guardian & protection type',
    note: 'Prone to vigilance. Rewarding every wary glance with reassurance entrenches anxiety — calm leadership and earned access matter more than comfort-talk.'
  },
  giant: {
    label: 'Giant & livestock guardian',
    note: 'Independent decision-makers bred to work without instruction, and slow to mature. Their size makes leash manners, thresholds, and calm greetings non-negotiable from day one — habits cute in a puppy are dangerous at sixty kilograms.'
  },
  small: {
    label: 'Small breed',
    note: 'Carrying, hand-feeding, and excusing pushy behaviour because it is "cute" often produces a dog that cannot tolerate boundaries from anyone — including you.'
  }
};

/* Breed list — name plus category key. Mixed/unlisted dogs choose the
   closest temperament directly via the category cards, or use the
   mixed/cross flow to attribute traits from two parent breeds. */
export const breeds: Breed[] = [
  // Clingy, people-focused (gundogs, retrievers, bull-breed companions)
  { name: 'Staffordshire Bull Terrier (Staffy)', category: 'clingy' },
  { name: 'American Staffordshire Terrier', category: 'clingy' },
  { name: 'Pit Bull type', category: 'clingy' },
  { name: 'American Bulldog', category: 'clingy' },
  { name: 'Labrador Retriever', category: 'clingy' },
  { name: 'Golden Retriever', category: 'clingy' },
  { name: 'Flat-Coated Retriever', category: 'clingy' },
  { name: 'Chesapeake Bay Retriever', category: 'clingy' },
  { name: 'Curly-Coated Retriever', category: 'clingy' },
  { name: 'Nova Scotia Duck Tolling Retriever', category: 'clingy' },
  { name: 'Boxer', category: 'clingy' },
  { name: 'Vizsla', category: 'clingy' },
  { name: 'Wirehaired Vizsla', category: 'clingy' },
  { name: 'Weimaraner', category: 'clingy' },
  { name: 'Cocker Spaniel', category: 'clingy' },
  { name: 'Springer Spaniel', category: 'clingy' },
  { name: 'Brittany Spaniel', category: 'clingy' },
  { name: 'Clumber Spaniel', category: 'clingy' },
  { name: 'Field Spaniel', category: 'clingy' },
  { name: 'Pointer (English / GSP)', category: 'clingy' },
  { name: 'German Wirehaired Pointer', category: 'clingy' },
  { name: 'Irish Setter', category: 'clingy' },
  { name: 'Gordon Setter', category: 'clingy' },
  { name: 'English Setter', category: 'clingy' },
  { name: 'Hungarian Pointer', category: 'clingy' },
  { name: 'Portuguese Water Dog', category: 'clingy' },
  { name: 'Lagotto Romagnolo', category: 'clingy' },
  { name: 'Dalmatian', category: 'clingy' },
  { name: 'Poodle (Standard)', category: 'clingy' },
  { name: 'Miniature Poodle', category: 'clingy' },
  { name: 'Toy Poodle', category: 'clingy' },
  { name: 'Labradoodle / Groodle', category: 'clingy' },
  { name: 'Cavoodle / Spoodle', category: 'clingy' },
  { name: 'Cockapoo', category: 'clingy' },
  { name: 'Schnoodle', category: 'clingy' },
  { name: 'Bernedoodle', category: 'clingy' },
  { name: 'Retrodoodle / Sheepadoodle', category: 'clingy' },
  { name: 'Bulldog (British)', category: 'clingy' },
  { name: 'Bull Terrier', category: 'clingy' },
  { name: 'Hungarian Pumi', category: 'clingy' },

  // Sighthounds & chase types
  { name: 'Greyhound', category: 'sighthound' },
  { name: 'Whippet', category: 'sighthound' },
  { name: 'Italian Greyhound', category: 'sighthound' },
  { name: 'Saluki', category: 'sighthound' },
  { name: 'Borzoi', category: 'sighthound' },
  { name: 'Afghan Hound', category: 'sighthound' },
  { name: 'Irish Wolfhound', category: 'sighthound' },
  { name: 'Scottish Deerhound', category: 'sighthound' },
  { name: 'Lurcher', category: 'sighthound' },
  { name: 'Staghound (NZ hunting type)', category: 'sighthound' },
  { name: 'Pharaoh Hound', category: 'sighthound' },
  { name: 'Ibizan Hound', category: 'sighthound' },
  { name: 'Azawakh', category: 'sighthound' },
  { name: 'Sloughi', category: 'sighthound' },

  // Visual, herding types
  { name: 'Border Collie', category: 'herding' },
  { name: 'NZ Heading Dog', category: 'herding' },
  { name: 'NZ Huntaway', category: 'herding' },
  { name: 'Rough / Smooth Collie', category: 'herding' },
  { name: 'Bearded Collie', category: 'herding' },
  { name: 'Australian Shepherd', category: 'herding' },
  { name: 'Mini Australian Shepherd', category: 'herding' },
  { name: 'Australian Cattle Dog (Blue Heeler)', category: 'herding' },
  { name: 'Kelpie', category: 'herding' },
  { name: 'Koolie', category: 'herding' },
  { name: 'Shetland Sheepdog (Sheltie)', category: 'herding' },
  { name: 'Old English Sheepdog', category: 'herding' },
  { name: 'Welsh Corgi (Pembroke / Cardigan)', category: 'herding' },
  { name: 'Swedish Vallhund', category: 'herding' },
  { name: 'Belgian Shepherd (Groenendael / Tervuren)', category: 'herding' },
  { name: 'Briard', category: 'herding' },
  { name: 'Bouvier des Flandres', category: 'herding' },
  { name: 'Puli', category: 'herding' },
  { name: 'Polish Lowland Sheepdog', category: 'herding' },
  { name: 'Border Collie x Huntaway', category: 'herding' },
  { name: 'White Swiss Shepherd', category: 'herding' },

  // Spitz & sled types
  { name: 'Siberian Husky', category: 'spitz' },
  { name: 'Alaskan Malamute', category: 'spitz' },
  { name: 'Samoyed', category: 'spitz' },
  { name: 'Shiba Inu', category: 'spitz' },
  { name: 'Basenji', category: 'spitz' },
  { name: 'Keeshond', category: 'spitz' },
  { name: 'Norwegian Elkhound', category: 'spitz' },
  { name: 'Finnish Lapphund', category: 'spitz' },
  { name: 'Finnish Spitz', category: 'spitz' },
  { name: 'German Spitz', category: 'spitz' },
  { name: 'Japanese Spitz', category: 'spitz' },
  { name: 'Eurasier', category: 'spitz' },
  { name: 'Pomsky', category: 'spitz' },
  { name: 'Alaskan Klee Kai', category: 'spitz' },

  // Terriers & high-drive working types
  { name: 'Jack Russell Terrier', category: 'terrier' },
  { name: 'Parson Russell Terrier', category: 'terrier' },
  { name: 'Fox Terrier', category: 'terrier' },
  { name: 'Border Terrier', category: 'terrier' },
  { name: 'Cairn Terrier', category: 'terrier' },
  { name: 'West Highland White Terrier (Westie)', category: 'terrier' },
  { name: 'Scottish Terrier', category: 'terrier' },
  { name: 'Airedale Terrier', category: 'terrier' },
  { name: 'Patterdale Terrier', category: 'terrier' },
  { name: 'Lakeland Terrier', category: 'terrier' },
  { name: 'Bedlington Terrier', category: 'terrier' },
  { name: 'Manchester Terrier', category: 'terrier' },
  { name: 'Norfolk / Norwich Terrier', category: 'terrier' },
  { name: 'Rat Terrier', category: 'terrier' },
  { name: 'Welsh Terrier', category: 'terrier' },
  { name: 'Irish Terrier', category: 'terrier' },
  { name: 'Kerry Blue Terrier', category: 'terrier' },
  { name: 'Soft-Coated Wheaten Terrier', category: 'terrier' },
  { name: 'Schnauzer (Standard / Miniature)', category: 'terrier' },
  { name: 'Pig Dog (NZ hunting cross)', category: 'terrier' },
  { name: 'Bull Arab', category: 'terrier' },
  { name: 'Catahoula Leopard Dog', category: 'terrier' },
  { name: 'Spaniel-cross working dog', category: 'terrier' },

  // Scenthounds & nose-led types
  { name: 'Beagle', category: 'scenthound' },
  { name: 'Harrier Hound', category: 'scenthound' },
  { name: 'Dachshund', category: 'scenthound' },
  { name: 'Miniature Dachshund', category: 'scenthound' },
  { name: 'Basset Hound', category: 'scenthound' },
  { name: 'Bloodhound', category: 'scenthound' },
  { name: 'Foxhound (English / American)', category: 'scenthound' },
  { name: 'Coonhound', category: 'scenthound' },
  { name: 'Otterhound', category: 'scenthound' },
  { name: 'Petit Basset Griffon Vendéen', category: 'scenthound' },
  { name: 'Hamiltonstövare', category: 'scenthound' },
  { name: 'Beagle-cross', category: 'scenthound' },

  // Guardian & protection breeds
  { name: 'German Shepherd', category: 'guardian' },
  { name: 'Belgian Malinois', category: 'guardian' },
  { name: 'Rottweiler', category: 'guardian' },
  { name: 'Doberman', category: 'guardian' },
  { name: 'Mastiff (English / Bull / Neapolitan)', category: 'guardian' },
  { name: 'Bullmastiff', category: 'guardian' },
  { name: 'Cane Corso', category: 'guardian' },
  { name: 'Boerboel', category: 'guardian' },
  { name: 'Dogue de Bordeaux', category: 'guardian' },
  { name: 'Presa Canario', category: 'guardian' },
  { name: 'Rhodesian Ridgeback', category: 'guardian' },
  { name: 'Akita', category: 'guardian' },
  { name: 'Shar Pei', category: 'guardian' },
  { name: 'Chow Chow', category: 'guardian' },
  { name: 'Tibetan Mastiff', category: 'guardian' },
  { name: 'Dogo Argentino', category: 'guardian' },
  { name: 'Beauceron', category: 'guardian' },
  { name: 'Giant Schnauzer', category: 'guardian' },
  { name: 'Black Russian Terrier', category: 'guardian' },

  // Giant & livestock guardian breeds
  { name: 'Great Dane', category: 'giant' },
  { name: 'Anatolian Shepherd / Maremma', category: 'giant' },
  { name: 'Great Pyrenees (Pyrenean Mountain Dog)', category: 'giant' },
  { name: 'Komondor', category: 'giant' },
  { name: 'Kuvasz', category: 'giant' },
  { name: 'Bernese Mountain Dog', category: 'giant' },
  { name: 'Greater Swiss Mountain Dog', category: 'giant' },
  { name: 'Newfoundland', category: 'giant' },
  { name: 'St Bernard', category: 'giant' },
  { name: 'Leonberger', category: 'giant' },
  { name: 'Pyrenean Mastiff', category: 'giant' },
  { name: 'Caucasian Shepherd', category: 'giant' },
  { name: 'Central Asian Shepherd', category: 'giant' },
  { name: 'Estrela Mountain Dog', category: 'giant' },

  // Small breeds
  { name: 'Chihuahua', category: 'small' },
  { name: 'Shih Tzu', category: 'small' },
  { name: 'Maltese', category: 'small' },
  { name: 'Pomeranian', category: 'small' },
  { name: 'Papillon', category: 'small' },
  { name: 'Bichon Frise', category: 'small' },
  { name: 'Cavalier King Charles Spaniel', category: 'small' },
  { name: 'King Charles Spaniel', category: 'small' },
  { name: 'Pug', category: 'small' },
  { name: 'French Bulldog', category: 'small' },
  { name: 'Boston Terrier', category: 'small' },
  { name: 'Yorkshire Terrier', category: 'small' },
  { name: 'Silky Terrier', category: 'small' },
  { name: 'Lhasa Apso', category: 'small' },
  { name: 'Pekingese', category: 'small' },
  { name: 'Havanese', category: 'small' },
  { name: 'Coton de Tulear', category: 'small' },
  { name: 'Miniature Pinscher', category: 'small' },
  { name: 'Brussels Griffon', category: 'small' },
  { name: 'Japanese Chin', category: 'small' },
  { name: 'Tibetan Spaniel', category: 'small' },
  { name: 'Chinese Crested', category: 'small' },
  { name: 'Affenpinscher', category: 'small' },
  { name: 'Maltese Shih Tzu cross', category: 'small' },
  { name: 'Chihuahua cross', category: 'small' }
];
