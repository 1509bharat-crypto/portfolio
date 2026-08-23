import type { CaseStudy } from '@/lib/types';

/**
 * Priority order is list order. Promoting a story means moving its entry up:
 * the first entry takes the flagship tile, the next two take their own tiles,
 * everything after that becomes a row in the "other case studies" tile.
 */
export const cases: CaseStudy[] = [
  {
    slug: 'lisa-mona',
    number: '01',
    rank: 'flagship',
    kicker: 'Case study · flagship · 2023–2025',
    title: 'Lisa → Mona',
    headline: 'Replaced the employee survey with 120k+ real conversations.',
    tagline:
      'Voice AI that replaced employee surveys with real conversations. Designed and built end-to-end.',
    summary:
      'Voice AI replacing employee surveys with natural conversations. Designed and built end-to-end.',
    stats: [
      { value: '120k+', label: 'conversations' },
      { value: '14', label: 'languages' },
      { value: '7+', label: 'clients' },
    ],
    stack: ['React', 'Postgres', 'ElevenLabs', 'OpenAI', 'Claude Code'],
    blocks: [
      { title: 'Why voice, not chat' },
      { title: 'Questions people answer honestly' },
      { title: 'Trust & anonymity at enterprise scale' },
      { title: 'The build: Claude Code + CLAUDE.md' },
    ],
  },
  {
    slug: 'robin',
    number: '02',
    rank: 'primary',
    kicker: 'Case study · current · Robin, Utrecht',
    title: 'Robin',
    tag: 'current',
    headline: 'Blue-collar recruiting, rebuilt around AI workflows.',
    tagline: 'Recruiting workflows, redesigned around AI.',
    summary:
      'Recruitment platform for blue-collar workers. Seamless AI workflows for faster recruiting.',
    blocks: [
      { title: 'The workflow, before / after' },
      { title: 'One decision, told properly' },
    ],
  },
  {
    slug: 'case-study-03',
    number: '03',
    rank: 'primary',
    slot: true,
    kicker: 'Case study 03 · slot',
    title: 'Next shipped story',
    headline: 'Reserved for whatever ships next.',
    tagline: 'Reserved top-three slot.',
    summary:
      'Reserved top-three slot. One data entry fills this tile and this detail view.',
    blocks: [{ title: 'Decision block' }, { title: 'Decision block' }],
  },
  {
    slug: 'case-study-04',
    number: '04',
    rank: 'other',
    slot: true,
    kicker: 'Case study 04 · slot',
    title: 'Case study 04',
    headline: 'One data entry fills this tile and its detail view.',
    tagline: 'Lives in the other case studies tile.',
    summary:
      'Lives in the other case studies tile on the grid, and still gets the same full card and map row here.',
    blocks: [{ title: 'Decision block' }, { title: 'Decision block' }],
  },
  {
    slug: 'case-study-05',
    number: '05',
    rank: 'other',
    slot: true,
    kicker: 'Case study 05 · slot',
    title: 'Case study 05',
    headline: 'Same template, one more entry.',
    tagline: 'Same template, one more data entry.',
    summary:
      'Same template, one more data entry. The map column simply grows by a row.',
    blocks: [{ title: 'Decision block' }, { title: 'Decision block' }],
  },
];

export const flagship = cases.find((c) => c.rank === 'flagship')!;
export const primaryCases = cases.filter((c) => c.rank === 'primary');
export const otherCases = cases.filter((c) => c.rank === 'other');

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}
