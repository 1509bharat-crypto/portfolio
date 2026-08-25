/**
 * One entry per tile. Adding a case study or an experiment means adding one
 * object to `src/data/` — the grid, the detail view and the map render themselves.
 */

/** Where a case study sits in the priority order the grid reads in. */
export type CaseRank =
  | 'flagship' // 01 — the big tile
  | 'primary' // 02, 03 — their own tiles
  | 'other'; // 04+ — rows inside the "other case studies" tile

export type Stat = {
  value: string;
  label: string;
};

/**
 * A decision block inside a case study. `body` is optional on purpose: a block
 * with no body renders as wireframe bars, so an unwritten story still lays out
 * correctly instead of shipping invented copy.
 */
export type Block = {
  title: string;
  body?: string;
};

export type CaseStudy = {
  slug: string;
  /** Display number: "01", "02", … Drives the mono numeral in the corner. */
  number: string;
  rank: CaseRank;
  kicker: string;
  title: string;
  /**
   * The name a recruiter would recognise — the company or the shipped product,
   * not an internal codename. Half of the grid label.
   */
  company: string;
  /**
   * What the work demonstrates, in the reader's language rather than the
   * project's. The first entry is the other half of the grid label, which
   * reads COMPANY · VALUE — a recruiter has never heard of Lisa or Mona, but
   * knows what voice UX is. Three is the practical ceiling — past that the
   * label wraps to three lines and stops being scannable. Draw from
   * `profile.disciplines` where the same skill applies, so the vocabulary of
   * the site stays consistent.
   */
  skills: string[];
  /**
   * The one line the grid tile carries. Conversational, and it should land the
   * arc — what the situation was, and what changed — so the tile needs no
   * supporting prose beneath it. Keep it under about fifteen words.
   */
  headline: string;
  tagline: string;
  summary: string;
  stats?: Stat[];
  stack?: string[];
  blocks: Block[];
  /** A reserved slot: renders as a dashed placeholder and is excluded from sitemaps. */
  slot?: boolean;
};

export type LabEntry = {
  slug: string;
  category: string;
  title: string;
  /** The open question, asked plainly. This is the tile's whole text. */
  question: string;
  blurb: string;
  status: string;
  /** Shown when the box expands in place. */
  detail?: string;
};

export type Profile = {
  name: string;
  role: string;
  location: string;
  availability: string;
  pitch: string;
  /**
   * The pitch as chosen phrases. On a phone each becomes its own line, because
   * a good break there is a decision rather than something the browser should
   * guess; on wider screens they run together and wrap normally.
   *
   * Joining these with single spaces must reproduce `pitch` exactly — the deck
   * asserts it in development.
   */
  pitchLines: string[];
  disciplines: string[];
  story: string;
  now: {
    where: string;
    what: string;
  };
  links: {
    label: string;
    href: string;
  }[];
};
