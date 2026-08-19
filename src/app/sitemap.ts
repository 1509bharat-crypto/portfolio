import type { MetadataRoute } from 'next';
import { cases } from '@/data/cases';
import { lab } from '@/data/lab';

const BASE = 'https://bharatbharat.co';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, priority: 1 },
    { url: `${BASE}/story`, priority: 0.8 },
    { url: `${BASE}/lab`, priority: 0.6 },
    // Slots have nothing written in them yet, so they stay out of the sitemap.
    ...cases
      .filter((c) => !c.slot)
      .map((c) => ({ url: `${BASE}/work/${c.slug}`, priority: 0.9 })),
    ...lab.map((e) => ({ url: `${BASE}/lab/${e.slug}`, priority: 0.5 })),
  ];
}
