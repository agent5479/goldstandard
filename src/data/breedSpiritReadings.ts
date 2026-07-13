import { breedCategories, breeds, type Breed, type BreedCategory } from './breeds';
import {
  findBreedByName,
  getBreedClientMixTraitLabel,
  getBreedMixAxisProfile,
  getBreedNeuroticismPropensityDetail,
  getCategoryAxisHint,
} from './breedTraits';

export interface SpiritReadingSection {
  id: string;
  title: string;
  body: string;
}

export interface BreedSpiritReading {
  breedName: string;
  epithet: string;
  sections: SpiritReadingSection[];
  closing: string;
}

export interface CategorySpiritTemplate {
  defaultEpithet: string;
  inThePack: string;
  growthEdge: string;
  closing: string;
}

export const REQUIRED_SPIRIT_SECTION_IDS = [
  'core-essence',
  'in-the-pack',
  'your-drive',
  'body-presence',
  'growth-edge',
] as const;

export const CHART_HIGHLIGHTS_SECTION_ID = 'chart-highlights';

export const CATEGORY_SPIRIT_TEMPLATES: Record<BreedCategory, CategorySpiritTemplate> = {
  clingy: {
    defaultEpithet: 'The Velcro Heart',
    inThePack:
      'You read the room through the people in it — loyalty is your love language, and you would rather follow your person than explore alone. Warmth is your default; you just need boundaries that feel kind, not cold.',
    growthEdge:
      'Your chart warns against taking every mood personally — when someone needs space, it is not rejection. Practice resting your optimism without losing it.',
    closing: 'The universe assigned you a heart that stays — just remember you are whole even when the room is quiet.',
  },
  sighthound: {
    defaultEpithet: 'The Elegant Sprinter',
    inThePack:
      'You are selective with your energy — affectionate on your terms, spectacular when something moves. You prefer calm company to chaos and dignity to drama.',
    growthEdge:
      'Your shadow is the sudden launch — impulse can outrun politeness. Channel the chase into something worthy before the reflex takes the wheel.',
    closing: 'You were born to conserve, then astonish — rest is not laziness, it is strategy.',
  },
  herding: {
    defaultEpithet: 'The Motion Supervisor',
    inThePack:
      'You notice who is doing what and feel a quiet obligation to organise it. Teams trust your focus; you trust a job worth finishing.',
    growthEdge:
      'Not everything that moves needs managing — sometimes the kindest leadership is letting the flock sort itself out.',
    closing: 'Your eyes were made to track patterns — aim them at work that deserves your precision.',
  },
  spitz: {
    defaultEpithet: 'The Opinionated Free Spirit',
    inThePack:
      'You negotiate rather than obey — fair terms matter more than applause. People either love your honesty or learn to appreciate it.',
    growthEdge:
      'Independence is a gift until it becomes a wall — practice meeting people halfway without dimming your voice.',
    closing: 'You were built for endurance and truth-telling — the right pack will hear you without trying to silence you.',
  },
  terrier: {
    defaultEpithet: 'The Chaos Gremlin',
    inThePack:
      'You bring intensity to every alliance — bored is not in your vocabulary, and your friends learn quickly that you need a mission.',
    growthEdge:
      'Idle hands (or paws) brew mischief — when frustration spikes, look for a puzzle before you look for a fight.',
    closing: 'Your drive is a superpower when it has somewhere honourable to go.',
  },
  scenthound: {
    defaultEpithet: 'The Nose-First Detective',
    inThePack:
      'Once your curiosity hooks, the rest of the world can wait — you are charming, stubborn, and ruled by interesting trails.',
    growthEdge:
      'The trail will still be there tomorrow — practice lifting your nose when the people you love are calling.',
    closing: 'Trust your instincts, but let your people be part of the adventure.',
  },
  guardian: {
    defaultEpithet: 'The Quiet Sentinel',
    inThePack:
      'You read the room before you enter it and take your circle seriously — protective without being performative.',
    growthEdge:
      'Not every unfamiliar thing is a threat — your calm is more persuasive than your alarm.',
    closing: 'You were meant to stand watch — just remember you are allowed to stand down, too.',
  },
  giant: {
    defaultEpithet: 'The Gentle Mountain',
    inThePack:
      'You move slowly, love deeply, and take up space without apology — people feel safer when you are near.',
    growthEdge:
      'Your size can intimidate even when you mean warmth — lead with softness so others see the heart under the height.',
    closing: 'Big presence, slow decisions, loyal soul — that is the chart you were given.',
  },
  small: {
    defaultEpithet: 'The Pocket Executive',
    inThePack:
      'You have learned that charm opens doors — compact frame, full-size personality, and zero interest in being overlooked.',
    growthEdge:
      'Small does not mean fragile and cute does not mean without rules — boundaries keep your confidence healthy.',
    closing: 'You were born to prove that presence is not measured in inches.',
  },
};

/** Optional hand-tuned flourishes — partial merges over composed readings. */
export const BREED_SPIRIT_READING_OVERRIDES: Partial<
  Record<string, Partial<Pick<BreedSpiritReading, 'epithet' | 'closing'>> & { sections?: Partial<Record<string, string>> }>
> = {
  'Labrador Retriever': {
    epithet: 'The Golden Optimist',
    closing: 'You were charted for joy, retrieval, and showing up — the world needs your tail-wag energy.',
  },
  'Border Collie': {
    epithet: 'The Pattern Prophet',
    closing: 'Your mind was made to solve — just remember to clock off sometimes.',
  },
  'Siberian Husky': {
    epithet: 'The Chorus Leader',
    closing: 'You were born to run, sing, and negotiate — find a pack that enjoys the soundtrack.',
  },
};

function softenAxis(breed: Breed, axis: 'personality' | 'working' | 'physical'): string {
  return getBreedMixAxisProfile(breed, axis, 'client');
}

function shortenText(text: string, maxSentences = 2): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const sentences = trimmed.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length <= maxSentences) return trimmed;
  return sentences.slice(0, maxSentences).join(' ').trim();
}

function deriveEpithet(breed: Breed): string {
  const override = BREED_SPIRIT_READING_OVERRIDES[breed.name]?.epithet;
  if (override) return override;

  const label = getBreedClientMixTraitLabel(breed.name);
  const lead = label.split('—')[0]?.split(';')[0]?.trim() ?? '';
  if (lead.length > 0 && lead.length <= 48 && !/\bneurotic|\banxious\b/i.test(lead)) {
    if (/^the /i.test(lead)) return lead;
    const firstPhrase = lead.split(',')[0]?.trim() ?? lead;
    if (firstPhrase.length > 0 && firstPhrase.length <= 36) {
      return `The ${firstPhrase.charAt(0).toUpperCase()}${firstPhrase.slice(1)} Spirit`;
    }
  }

  return CATEGORY_SPIRIT_TEMPLATES[breed.category].defaultEpithet;
}

function buildGrowthEdge(breed: Breed): string {
  const override = BREED_SPIRIT_READING_OVERRIDES[breed.name]?.sections?.['growth-edge'];
  if (override) return override;

  const template = CATEGORY_SPIRIT_TEMPLATES[breed.category].growthEdge;
  const neuro = getBreedNeuroticismPropensityDetail(breed.name);
  if (neuro?.note) {
    const softened = neuro.note
      .replace(/\bneurotic\b/gi, 'stress-sensitive')
      .replace(/\banxious\b/gi, 'worry-prone');
    return `${template} ${softened}`;
  }

  const categoryNote = breedCategories[breed.category].note;
  const firstSentence = categoryNote.match(/^[^.!?]+[.!?]/)?.[0]?.trim();
  if (firstSentence) {
    return `${template} (${firstSentence})`;
  }

  return template;
}

function buildInThePack(breed: Breed): string {
  const override = BREED_SPIRIT_READING_OVERRIDES[breed.name]?.sections?.['in-the-pack'];
  if (override) return override;

  return CATEGORY_SPIRIT_TEMPLATES[breed.category].inThePack;
}

function resolveSectionBody(
  breed: Breed,
  axis: 'personality' | 'working' | 'physical',
  override?: string,
  maxSentences = 3
): string {
  if (override?.trim()) return override.trim();

  const softened = shortenText(softenAxis(breed, axis), maxSentences);
  if (softened.trim().length >= 20) return softened;

  return shortenText(getCategoryAxisHint(breed.category, axis), maxSentences);
}

export function composeBreedSpiritReading(breed: Breed): BreedSpiritReading {
  const categoryTemplate = CATEGORY_SPIRIT_TEMPLATES[breed.category];
  const sectionOverrides = BREED_SPIRIT_READING_OVERRIDES[breed.name]?.sections ?? {};

  const sections: SpiritReadingSection[] = [
    {
      id: 'core-essence',
      title: 'Core Essence',
      body: resolveSectionBody(breed, 'personality', sectionOverrides['core-essence']),
    },
    {
      id: 'in-the-pack',
      title: 'In the Pack',
      body: buildInThePack(breed),
    },
    {
      id: 'your-drive',
      title: 'Your Drive',
      body: resolveSectionBody(breed, 'working', sectionOverrides['your-drive']),
    },
    {
      id: 'body-presence',
      title: 'Body & Presence',
      body: resolveSectionBody(breed, 'physical', sectionOverrides['body-presence'], 2),
    },
    {
      id: 'growth-edge',
      title: 'Growth Edge',
      body: buildGrowthEdge(breed),
    },
  ];

  return {
    breedName: breed.name,
    epithet: deriveEpithet(breed),
    sections,
    closing:
      BREED_SPIRIT_READING_OVERRIDES[breed.name]?.closing ?? categoryTemplate.closing,
  };
}

function mergeReading(
  base: BreedSpiritReading,
  patch: Partial<BreedSpiritReading>
): BreedSpiritReading {
  const sectionBodies = new Map(base.sections.map((section) => [section.id, section]));
  if (patch.sections) {
    for (const section of patch.sections) {
      const existing = sectionBodies.get(section.id);
      if (existing) {
        sectionBodies.set(section.id, { ...existing, ...section });
      } else {
        sectionBodies.set(section.id, section);
      }
    }
  }

  return {
    breedName: patch.breedName ?? base.breedName,
    epithet: patch.epithet ?? base.epithet,
    sections: [...sectionBodies.values()],
    closing: patch.closing ?? base.closing,
  };
}

export const BREED_SPIRIT_READINGS: Record<string, BreedSpiritReading> = Object.fromEntries(
  breeds.map((breed) => [breed.name, composeBreedSpiritReading(breed)])
);

export function getBreedSpiritReading(breedName: string): BreedSpiritReading | undefined {
  const breed = findBreedByName(breedName);
  if (!breed) return BREED_SPIRIT_READINGS[breedName];
  return BREED_SPIRIT_READINGS[breed.name];
}

export interface SpiritReadingPersonalization {
  highlights?: string[];
  archetypeHeadline?: string;
}

export function personalizeSpiritReading(
  reading: BreedSpiritReading,
  { highlights, archetypeHeadline }: SpiritReadingPersonalization
): BreedSpiritReading {
  const trimmedHighlights = (highlights ?? []).map((line) => line.trim()).filter(Boolean);
  if (trimmedHighlights.length === 0) return reading;

  const intro = archetypeHeadline
    ? `As ${archetypeHeadline}, your chart lights up in these ways:`
    : 'Your chart lights up in these ways:';

  const highlightsSection: SpiritReadingSection = {
    id: CHART_HIGHLIGHTS_SECTION_ID,
    title: 'Your Chart Highlights',
    body: `${intro}\n\n${trimmedHighlights.map((line) => `• ${line}`).join('\n')}`,
  };

  const withoutPrior = reading.sections.filter(
    (section) => section.id !== CHART_HIGHLIGHTS_SECTION_ID
  );

  return mergeReading(reading, {
    sections: [...withoutPrior, highlightsSection],
  });
}

export function assertAllBreedsHaveSpiritReading(): void {
  const missing = breeds.filter((breed) => !BREED_SPIRIT_READINGS[breed.name]);
  if (missing.length > 0) {
    throw new Error(`Missing spirit readings for: ${missing.map((b) => b.name).join(', ')}`);
  }

  for (const breed of breeds) {
    const reading = BREED_SPIRIT_READINGS[breed.name]!;
    if (!reading.epithet.trim()) {
      throw new Error(`Empty epithet for ${breed.name}`);
    }
    if (!reading.closing.trim()) {
      throw new Error(`Empty closing for ${breed.name}`);
    }

    for (const sectionId of REQUIRED_SPIRIT_SECTION_IDS) {
      const section = reading.sections.find((entry) => entry.id === sectionId);
      if (!section?.body.trim()) {
        throw new Error(`Missing or empty section ${sectionId} for ${breed.name}`);
      }
    }
  }
}

assertAllBreedsHaveSpiritReading();
