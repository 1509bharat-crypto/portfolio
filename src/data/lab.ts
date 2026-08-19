import type { LabEntry } from '@/lib/types';

/** No hierarchy here, all play. The grid just grows as entries are added. */
export const lab: LabEntry[] = [
  {
    slug: 'de-wacht',
    category: 'Voice',
    title: 'De Wacht',
    blurb: 'Voice agent for Dutch tradespeople. Parked, documented.',
    status: 'parked',
    detail: 'Fully documented · one working prototype call flow.',
  },
  {
    slug: 'talking-objects',
    category: 'Character',
    title: 'Talking Objects',
    blurb: 'What makes a character feel alive?',
    status: 'active',
    detail:
      'Vision AI gives objects a voice · the open question is return visits.',
  },
  {
    slug: 'token-sculpture',
    category: 'Hardware',
    title: 'Token Sculpture',
    blurb: 'Kinetic AI usage visualization on Arduino/ESP32.',
    status: 'building',
    detail: 'Tokens per second become physical motion.',
  },
];

/** Empty boxes that keep the grid honest about there being room for more. */
export const labSlots = [
  'Next experiment. One box per idea.',
  'The grid just grows.',
  'No hierarchy here, all play.',
];
