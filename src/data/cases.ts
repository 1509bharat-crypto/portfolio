import type { CaseStudy } from '@/lib/types';

/**
 * Priority order is list order. Promoting a story means moving its entry up:
 * the first entry takes the flagship tile, the next two take their own tiles,
 * everything after that becomes a row in the "other case studies" tile.
 *
 * Sources, in order of authority: the two case studies Bharat has already
 * published at bharatbharat.co/works, then Bharat_CV_2026.docx. Where they
 * disagree the published case study wins, because it is the more detailed and
 * the more recent account of the same work.
 *
 * Two corrections came out of reading the published ones:
 *
 *  - 120,000+ conversations, 14+ languages and 7 clients belong to LISA, the
 *    Epiphany research platform. They had been sitting on Mona, which the CV
 *    describes as "zero to beta with a first customer" — a different project
 *    at a different scale.
 *  - LISA and Mona are not a product and its successor. LISA is the mother
 *    platform, built by a team of about ten. Mona comes after it, built solo,
 *    as a working concept for where LISA goes next — its interactions are
 *    meant to be folded back into the mother platform. That is what the old
 *    "Lisa → Mona" label in this file was pointing at.
 *
 * Block bodies are only filled where Bharat has written the material himself.
 * A block with no body renders as wireframe bars, which is the design while a
 * story is unwritten. Do not fill one with invented prose.
 */
export const cases: CaseStudy[] = [
  {
    slug: 'lisa',
    year: '2024',
    number: '01',
    rank: 'flagship',
    kicker: 'Epiphany RBC · 2024 · one year',
    title: 'LISA',
    company: 'Epiphany RBC',
    skills: ['Conversation design', 'Systems thinking', 'Design systems'],
    headline: 'Cut a two-month research study down to a fortnight.',
    tagline:
      'An AI research platform that replaced surveys with conversations, and the analysis that used to wait for them.',
    summary:
      'Product designer on LISA, leading the respondent conversation experience and the data visualisation system, with two designers, a head of product and seven developers. It ran 120,000+ conversations in 14+ languages for seven global clients.',
    stats: [
      { value: '€350k', label: 'saved a year' },
      { value: '120k+', label: 'conversations' },
      { value: '2 wks', label: 'from 2 months' },
    ],
    stack: ['React', 'Postgres', 'OpenAI', 'Figma', 'Rive'],
    blocks: [
      {
        title: 'Analysis used to start only after fieldwork ended',
        body: 'A study took about two months. Data cleaning was manual, third parties added cost and delay, and complex routing and translations took weeks on their own. Researchers said the visuals were outdated and would not scale.',
      },
      {
        title: 'A builder that borrows its mental model from PowerPoint',
        body: 'Visual-first, so a researcher could see the conversation they were composing rather than fill in a form describing one.',
      },
      {
        title: 'Moving the AI to where researchers actually touch it',
        body: 'Out of the backend, into a setup copilot with templates and an analysis assistant. Pattern and sentiment detection runs across 70+ languages.',
      },
      {
        title: 'Variables, viewport, settings',
        body: 'A three-part visualiser, so exploring the data was a matter of moving between panels rather than regenerating a chart.',
      },
      {
        title: 'A hundred components, and a much shorter handover',
        body: 'The design system went from scattered pieces to 100+ tokenised components. Validated on pilot projects before it scaled, with weekly co-creation sessions alongside the researchers using it.',
      },
    ],
  },
  {
    slug: 'robin-jr',
    year: '2026',
    number: '02',
    rank: 'primary',
    kicker: 'Recruit Robin · Utrecht',
    title: 'Robin Jr.',
    company: 'Recruit Robin',
    skills: ['AI workflows', 'Agent behaviour', 'Product design'],
    headline:
      "Put the recruiting agent inside the recruiter's own ATS, as an extension.",
    tagline:
      'A Chrome extension carrying an AI recruiting agent into the tools recruiters already use.',
    summary:
      'Taken from first concept to the Chrome Web Store and a pilot with a first customer. It spots new vacancies, finds candidates across 13 job boards and the client database, contacts and pre-screens them, and books interviews.',
    stats: [
      { value: '13', label: 'job boards' },
      { value: '1st', label: 'pilot customer' },
      { value: 'Live', label: 'on the Chrome Web Store' },
    ],
    stack: ['React', 'Node.js', 'Chrome extensions'],
    blocks: [
      { title: 'Meeting recruiters inside the ATS they already open' },
      { title: 'From a new vacancy to a booked interview' },
      { title: 'Searching 13 job boards and the client database at once' },
      { title: 'What shipping to the Chrome Web Store changed' },
    ],
  },
  {
    slug: 'mona',
    year: '2025',
    number: '03',
    rank: 'primary',
    kicker: 'TwentyEighth Conversation · 2025 · built solo',
    title: 'Mona',
    company: 'TwentyEighth Conversation',
    skills: ['Voice UX', 'Conversation design', 'AI-assisted build'],
    headline: "The version we couldn't ship yet, built anyway.",
    tagline:
      'A working concept for where LISA goes next, designed and built end to end on my own.',
    summary:
      "It started as an exploration, built with AI, and ended up a fully working mini SaaS that could hold thirty users. Not a mockup: the whole interaction vocabulary, running. I built the version we couldn't ship yet, so we'd know what LISA should aim at.",
    stats: [
      { value: '30', label: 'users it can hold' },
      { value: 'Solo', label: 'designed and built' },
      { value: 'Beta', label: 'with a first customer' },
    ],
    /* Groq and Pinecone are from bharatbharat.co, which lists a RAG
       architecture the CV leaves out entirely. */
    stack: [
      'React',
      'Postgres',
      'Railway',
      'OpenAI',
      'Groq',
      'ElevenLabs',
      'Pinecone',
    ],
    blocks: [
      { title: 'Why voice, not chat' },
      { title: 'Questions people answer honestly' },
      { title: 'Trust and anonymity at enterprise scale' },
      { title: 'One person, the whole product' },
    ],
  },
  {
    slug: 'engaging-interactions',
    number: '04',
    rank: 'other',
    kicker: 'Epiphany RBC · 2023 · six months',
    title: 'The moderator',
    company: 'Epiphany RBC',
    skills: ['Interaction design', 'Motion', 'Conversation design'],
    headline: 'Gave the survey a moderator that reacts to how you answer.',
    tagline:
      "Interaction design for LISA's moderator: animation, colour and state that follow the conversation.",
    summary:
      "Led the interaction design of LISA's moderator, with one developer. Human conversation mapped into behaviour: dynamic dialogue, colour that follows sentiment, and animation that signals presence.",
    stats: [
      { value: '~100h', label: 'development time saved' },
      { value: '4.6', label: 'respondent rating, from 4.0' },
      { value: '~20%', label: 'more engagement' },
    ],
    stack: ['Rive'],
    blocks: [
      {
        title: 'GSAP was slow, and it was not reactive',
        body: 'The first attempt used GSAP and did not work as expected. Rive replaced it, which handed control back to the designers and saved roughly a hundred hours of development.',
      },
      {
        title: 'Answering gibberish, silence, and someone typing too fast',
        body: 'AI pattern detection on open-ended responses, across 70+ languages, so the moderator has something to do when an answer is not an answer.',
      },
      {
        title: 'Colour that follows sentiment',
        body: 'Background colour shifts with the emotional state of the conversation, and small animations signal that something is listening.',
      },
      {
        title: 'One state machine, for every tool',
        body: 'What started tool-specific became a single standardised set of state machines, with flows broken into frames so a new developer could follow them.',
      },
    ],
  },
  {
    slug: 'adecco-uber',
    year: '2026',
    number: '05',
    rank: 'other',
    kicker: 'Recruit Robin · for Adecco × Uber',
    title: 'Adecco × Uber',
    company: 'Recruit Robin',
    skills: ['Service design', 'AI workflows', 'Systems thinking'],
    headline: 'Hiring bike couriers end to end, with nobody re-typing anything.',
    tagline:
      'A fully automated hiring flow for Adecco × Uber bike couriers, from application to onboarding.',
    summary:
      "The candidate flow for a fully automated hiring process: application, pre-screening by AI or a recruiter, then the onboarding invite. Every step updates Adecco's recruitment system on its own. In testing.",
    stack: ['React', 'Node.js'],
    blocks: [
      { title: 'Where the AI screens, and where a person still should' },
      { title: 'Application to onboarding without a handoff' },
      { title: "Keeping Adecco's system in step, automatically" },
      { title: 'The prototype that went to the board' },
    ],
  },
  {
    slug: 'conversation-scoring',
    number: '06',
    rank: 'other',
    kicker: 'Recruit Robin · Utrecht',
    title: 'Scoring the chatbot',
    company: 'Recruit Robin',
    skills: ['Conversation design', 'Agent behaviour'],
    headline: 'Before this there was no repeatable way to tell if it was good.',
    tagline: "The first way to test and score Robin's AI recruiting chatbot.",
    summary:
      "Built the first way to test and score Robin's AI recruiting chatbot. Before it, the team had no repeatable way to check conversation quality.",
    blocks: [
      { title: 'What a good recruiting conversation actually looks like' },
      { title: 'Turning that into something you can score' },
      { title: 'Catching a regression before a candidate does' },
    ],
  },
  {
    slug: 'research-tool',
    number: '07',
    rank: 'other',
    kicker: 'Recruit Robin · own initiative',
    title: 'The research tool',
    company: 'Recruit Robin',
    skills: ['User research', 'Voice UX', 'AI-assisted build'],
    headline: 'Built the tool I needed to find out what to build.',
    tagline:
      'A research tool mixing quick yes/no questions with a voice agent, built on my own initiative.',
    summary:
      'A user research tool built on my own initiative. It mixes short yes/no questions with a voice conversation agent to run studies for upcoming product work.',
    stack: ['Vapi', 'Railway', 'Node.js'],
    blocks: [
      { title: 'Why a voice agent asks a better second question' },
      { title: 'Quick answers and long ones in the same study' },
    ],
  },
  {
    slug: 'asset-manager',
    number: '08',
    rank: 'other',
    kicker: 'Epiphany RBC · own initiative',
    title: 'The asset manager',
    company: 'Epiphany RBC',
    skills: ['Product design', 'AI-assisted build'],
    headline: 'Researchers stopped redrawing the same icon every report.',
    tagline:
      'An internal tool for uploading, finding and generating icons for client reports.',
    summary:
      'An internal asset manager built on my own initiative, so researchers could upload, find, and generate matching icons for client reports.',
    blocks: [
      { title: 'Finding an icon is harder than drawing one' },
      { title: 'Generating one that matches the rest' },
    ],
  },
  {
    slug: 'ai-adoption',
    number: '09',
    rank: 'other',
    kicker: 'TwentyEighth Conversation · Amsterdam',
    title: 'Getting the team onto AI',
    company: 'TwentyEighth Conversation',
    skills: ['AI-assisted build', 'Systems thinking'],
    headline:
      'A second designer shipping code, and researchers making their own charts.',
    tagline:
      'Brought AI-assisted building to the company by showing it working on real projects.',
    summary:
      'Got the company onto Claude, a second designer shipping code, and researchers making their own data visualisations, by bringing AI-assisted building to the team and showing it working on real projects.',
    stack: ['Claude Code', 'Cursor'],
    blocks: [
      { title: 'Showing it on real work, not in a workshop' },
      { title: 'What changes when a designer can ship' },
    ],
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
