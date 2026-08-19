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
