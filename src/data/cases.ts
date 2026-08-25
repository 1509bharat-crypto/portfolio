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
    kicker: 'Lisa → Mona · 2023–2025',
    title: 'Lisa → Mona',
    // TODO(bharat): confirm. "Lisa → Mona" reads as a rename, so the name a
    // recruiter would recognise is taken to be Mona. If the employer's name
    // belongs here instead, this is the one line to change.
    company: 'Mona',
    skills: ['Voice UX', 'Conversation design', 'AI-assisted build'],
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
    kicker: 'Robin · Utrecht',
    title: 'Robin',
    company: 'Robin',
    // TODO(bharat): third skill is my inference from "platform" + "workflows".
    skills: ['AI workflows', 'Product design', 'Systems thinking'],
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
    kicker: 'Next shipped story',
    title: 'Next shipped story',
    company: 'Next shipped story',
    skills: [],
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
    kicker: 'Case study 04',
    title: 'Case study 04',
    company: 'Case study 04',
    skills: [],
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
    kicker: 'Case study 05',
    title: 'Case study 05',
    company: 'Case study 05',
    skills: [],
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

/**
 * Everything shipped with, across every case study, in first-appearance
 * order. Derived rather than listed, so adding a tool to a case study adds it
 * to the contact card and nowhere has to be kept in sync.
 */
export const stack = [...new Set(cases.flatMap((c) => c.stack ?? []))];
