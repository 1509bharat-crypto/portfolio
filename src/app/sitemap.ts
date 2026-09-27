import type { MetadataRoute } from 'next';
import { cases } from '@/data/cases';

const BASE = 'https://bharatbharat.co';

/**
 * The cover and the project pages are the whole site now. /story and /lab
 * were part of the deck design and went with it; `story.ts` and `lab.ts` are
 * still here, so both can come back in this style without retyping anything.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, priority: 1 },
    // Slots have nothing written in them yet, so they stay out of the sitemap.
    ...cases
      .filter((c) => !c.slot)
      .map((c) => ({ url: `${BASE}/work/${c.slug}`, priority: 0.9 })),
  ];
}
