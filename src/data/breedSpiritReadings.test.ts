import { describe, expect, it } from 'vitest';
import { breeds } from './breeds';
import {
  BREED_SPIRIT_READINGS,
  CHART_HIGHLIGHTS_SECTION_ID,
  composeBreedSpiritReading,
  getBreedSpiritReading,
  personalizeSpiritReading,
  REQUIRED_SPIRIT_SECTION_IDS,
} from './breedSpiritReadings';

describe('breedSpiritReadings', () => {
  it('materializes readings for every breed', () => {
    expect(Object.keys(BREED_SPIRIT_READINGS)).toHaveLength(breeds.length);
    for (const breed of breeds) {
      expect(BREED_SPIRIT_READINGS[breed.name]?.breedName).toBe(breed.name);
    }
  });

  it('includes required sections with non-empty copy', () => {
    for (const breed of breeds) {
      const reading = getBreedSpiritReading(breed.name)!;
      expect(reading.epithet.length).toBeGreaterThan(0);
      expect(reading.closing.length).toBeGreaterThan(0);

      for (const sectionId of REQUIRED_SPIRIT_SECTION_IDS) {
        const section = reading.sections.find((entry) => entry.id === sectionId);
        expect(section?.body.trim().length).toBeGreaterThan(20);
      }
    }
  });

  it('composes deterministically for the same breed', () => {
    const breed = breeds.find((entry) => entry.category === 'clingy')!;
    const first = composeBreedSpiritReading(breed);
    const second = composeBreedSpiritReading(breed);
    expect(second).toEqual(first);
  });

  it('adds chart highlights when quiz highlights are provided', () => {
    const breed = breeds.find((entry) => entry.name === 'Labrador Retriever')!;
    const base = composeBreedSpiritReading(breed);
    const personalized = personalizeSpiritReading(base, {
      highlights: ['Velcro soul — you bond like a Lab who heard the car keys.'],
      archetypeHeadline: 'The Velcro Cuddle Bug',
    });

    const highlights = personalized.sections.find(
      (section) => section.id === CHART_HIGHLIGHTS_SECTION_ID
    );
    expect(highlights?.title).toBe('Your Chart Highlights');
    expect(highlights?.body).toMatch(/Velcro Cuddle Bug/);
    expect(highlights?.body).toMatch(/Velcro soul/);
  });

  it('spot-checks playful tone for representative breeds', () => {
    const samples = [
      breeds.find((b) => b.category === 'clingy' && b.name === 'Labrador Retriever')!,
      breeds.find((b) => b.category === 'sighthound')!,
      breeds.find((b) => b.category === 'terrier')!,
    ];

    for (const breed of samples) {
      const reading = getBreedSpiritReading(breed.name)!;
      expect(reading.sections.some((section) => /you|your/i.test(section.body))).toBe(true);
      expect(reading.closing).toMatch(/you|your/i);
    }
  });
});
