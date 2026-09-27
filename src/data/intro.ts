/**
 * The cover, in one view.
 *
 * An earlier version spread this over four cards as kishōtenketsu — question,
 * work, turn, resolution. It read well but it broke the rule the whole site is
 * built on: as much as possible in one view on desktop. It also put 68 words
 * in a single block, which `npm run design` rejects outright.
 *
 * So the structure is spatial instead of sequential. The turn is still here —
 * luggage and a prison sitting in the same row as voice AI — it just lands by
 * being next to the other two rather than by arriving after them.
 *
 * On the writing: plain first person, no triads. An earlier draft leaned on
 * "ten years, four disciplines, one question" and "a suitcase, a prison
 * workshop, a voice agent", which is rule-of-three phrasing and reads as
 * written rather than said.
 *
 * Every block here is under the 25-word limit. Check before adding to one.
 */

export type Column = {
  label: string;
  body: string;
};

/*
 * The question — "how do people and the things they use understand each
 * other?" — is deliberately NOT here. It lives in `story.ts`, which is the
 * only place it is not an echo.
 *
 * It worked when the cover was four cards and the question came first: it set
 * up the pitch that followed. In one view it sits underneath a larger, louder
 * version of the same thought, and a setup placed after its payoff is just a
 * repetition.
 */

/**
 * Three columns, oldest last. The third is the one that does the work: a
 * reader has just been told about agentic flows and voice AI, and then finds
 * luggage and a prison in the same row.
 */
export const columns: Column[] = [
  {
    label: 'Now',
    body: 'The only designer with six developers at Robin, building agentic flows for recruiters and candidates.',
  },
  {
    label: 'Before',
    body: 'Co-built Mona, a voice AI platform that replaced employee surveys with real conversations. Wrote a good part of it myself.',
  },
  {
    label: 'Before that',
    body: 'Luggage goods at VIP Industries. Field research in train coaches and a prison. Engineering before all of it.',
  },
];

/**
 * The things that do not fit a column but a recruiter still wants to know.
 *
 * Two plain sentences. The draft before this one ended "I pick up new tools
 * fast — I like having a reason to try one", which is a clever line rather
 * than a spoken one, and "pick up new tools fast" is CV wording. Say what you
 * actually do with them instead.
 */
export const also =
  "I also animate and illustrate. I'm quick with new tools and systems, and I usually learn one by building something with it.";
