/**
 * The career throughline behind the pitch. Phase titles come from the line the
 * pitch tile already states; the bodies are deliberately unwritten, so they
 * render as wireframe bars until Bharat writes them.
 */
export type Phase = {
  number: string;
  title: string;
  body?: string;
};

const phases: Phase[] = [
  { number: '01', title: 'Engineer' },
  { number: '02', title: 'Industrial design' },
  { number: '03', title: 'Ethnography' },
  { number: '04', title: 'Product' },
];

export const story = {
  kicker: 'The story · one throughline',
  title: 'How people and things communicate',
  lede: 'Engineer → industrial → ethnography → product. Four disciplines, one question: how do people and the things they use understand each other?',
  phases,
};
