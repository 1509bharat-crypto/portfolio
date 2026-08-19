import type { Profile } from '@/lib/types';

// TODO(bharat): confirm the contact addresses below before this goes live.
export const profile: Profile = {
  name: 'Bharat Bharat',
  role: 'Product designer',
  location: 'Amsterdam',
  availability: 'Open to senior IC roles',
  pitch: 'I design conversations between people and machines.',
  disciplines: [
    'Conversation design',
    'Voice UX',
    'AI-assisted build',
    'Systems thinking',
  ],
  story:
    'Engineer → industrial → ethnography → product. One throughline: how people and things communicate.',
  now: {
    where: 'Robin, Utrecht',
    what: 'AI recruiting workflows. Open to senior IC roles.',
  },
  links: [
    { label: 'Email', href: 'mailto:hello@bharatbharat.co' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bharatbharat' },
    { label: 'Resume', href: '/resume.pdf' },
  ],
};
