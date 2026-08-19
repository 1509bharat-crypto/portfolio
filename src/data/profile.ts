import type { Profile } from '@/lib/types';

// TODO(bharat): the email and the resume PDF still need real values.
// /resume.pdf does not exist yet, so that button 404s until it's added
// to the public/ directory.
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
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/1509bharat/' },
    { label: 'Resume', href: '/resume.pdf' },
  ],
};
