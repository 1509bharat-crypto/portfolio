import type { Profile } from '@/lib/types';

// TODO(bharat): the email and the resume PDF still need real values.
// /resume.pdf does not exist yet, so that button 404s until it's added
// to the public/ directory.
export const profile: Profile = {
  name: 'Bharat Bharat',
  role: 'Product designer',
  location: 'Amsterdam',
  availability: 'Open to senior IC roles',
  pitch: 'I design and build conversations between people and machines.',
  pitchParts: {
    lead: 'I design and build',
    /**
     * One phrase per project, and four different connectors so the line does
     * not settle into a rhythm: conversations and trust from Mona (the second
     * from its "Trust & anonymity at enterprise scale" block), agents from
     * De Wacht's voice agent, workflows from Robin.
     *
     * The first must match `pitch`, which is what metadata and screen readers
     * get. Add or reorder freely — the slot sizes itself to the longest.
     */
    rotating: [
      'conversations between',
      'trust across',
      'agents linking',
      'workflows for',
    ],
    tail: 'people and machines.',
  },
  disciplines: [
    'Conversation design',
    'Voice UX',
    'AI-assisted build',
    'Systems thinking',
  ],
  /**
   * TODO(bharat): drafts, rewrite in your voice. Each is traceable to
   * something already here — end to end from Mona's "designed and built
   * end-to-end", ethnography from the story's arc, AI in the loop from the
   * AI-assisted build discipline and Claude Code sitting in the stack.
   */
  howIWork: [
    'Design and build, end to end',
    'Ethnography before interface',
    'AI in the loop',
  ],
  /**
   * TODO(bharat): drafts, rewrite in your voice. These are Mona's own decision
   * blocks read as principles — "Questions people answer honestly", "Trust &
   * anonymity at enterprise scale", "Why voice, not chat".
   */
  values: [
    'Questions people answer honestly',
    'Trust and anonymity at scale',
    'The right medium, not the default',
  ],
  // The tile carries the arc only; the throughline itself is the story page.
  story: 'Engineer → industrial → ethnography → product.',
  now: {
    where: 'Robin, Utrecht',
    // Availability is its own field and renders beside this, so saying it
    // here too put "Open to senior IC roles" on the card twice.
    what: 'AI recruiting workflows.',
  },
  links: [
    { label: 'Email', href: 'mailto:hello@bharatbharat.co' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/1509bharat/' },
    { label: 'Resume', href: '/resume.pdf' },
  ],
};
