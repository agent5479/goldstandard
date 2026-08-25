import {
  formatElitePriceAmount,
  formatHomeVisitPriceAmount,
  formatStandardPriceAmount,
  PRICING_AMOUNT_PROGRAMME,
  PRICING_LABEL_BEACH_60,
  PRICING_LABEL_ELITE,
  PRICING_LABEL_HOME,
  PRICING_LABEL_PROGRAMME,
} from '@shared/bookingPricing';
import { SITE_PHONE_DISPLAY, siteUrl } from './siteConfig';

export interface SiteFaqItem {
  question: string;
  /** Complete standalone answer (visible on page + FAQPage schema). */
  answer: string;
}

/** About-page FAQs — proprietary pricing and method answers for AI extraction. */
export function buildAboutFaqs(): SiteFaqItem[] {
  const beach = formatStandardPriceAmount('golden-bay');
  const home = formatHomeVisitPriceAmount();
  const elite = formatElitePriceAmount();

  return [
    {
      question: 'Who is the dog trainer at Gold Standard Dog Training?',
      answer: `Warwick Marshall is the dog trainer behind Gold Standard Dog Training. He coaches owners in person from a base in Rangihaeata, Takaka (Golden Bay), and across the Tasman region in New Zealand. Call or text ${SITE_PHONE_DISPLAY}.`,
    },
    {
      question: 'How much does dog training cost in Golden Bay?',
      answer: `The first conversation is always free. In Golden Bay, a ${PRICING_LABEL_PROGRAMME} is ${PRICING_AMOUNT_PROGRAMME} and is the usual best first step. A ${PRICING_LABEL_BEACH_60} is ${beach}; town sessions match beach pricing. ${PRICING_LABEL_HOME} is ${home}. ${PRICING_LABEL_ELITE} is ${elite}. Nelson Bays timing and pricing are confirmed by enquiry.`,
    },
    {
      question: 'Where does Gold Standard Dog Training offer sessions?',
      answer:
        'Sessions run across Golden Bay (including Takaka and Pohara) and the wider Tasman region, including Nelson Bays, Motueka, and Richmond. Work happens on beaches, reserves, town spaces, and private households — wherever behaviour has to hold in real life.',
    },
    {
      question: 'What makes Gold Standard Dog Training different from generic obedience classes?',
      answer:
        'Gold Standard coaches the owner as much as the dog: clear standards, measured leash work, and embodied leadership (Dog-Tantra / pack sensitivity). The goal is calm reliability that holds after the session — not treat bribery or a one-size class syllabus.',
    },
    {
      question: 'Do you work with reactive or difficult dogs?',
      answer:
        'Yes. Rehabilitation and dog-social calm coaching cover reactivity, anxiety, hard histories, and stuck patterns. Safety and trust come first; where needed, structured social feedback may include Controlled Confrontation with a balanced master helper dog.',
    },
    {
      question: 'How do I book a dog training session?',
      answer: `Book online at ${siteUrl('/book')}, send an enquiry via ${siteUrl('/contact')}, or call ${SITE_PHONE_DISPLAY}. Include your dog’s age, biggest challenge, and what success looks like for you.`,
    },
  ];
}
