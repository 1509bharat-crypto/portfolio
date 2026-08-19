/**
 * One motion vocabulary for the whole site. Components import from here rather
 * than inventing springs, so everything decelerates with the same character.
 */

/** Tiles and overlays arriving: quick, barely overshooting. */
export const springCrisp = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 38,
  mass: 0.8,
};

/** Layout reflow — the lab grid rearranging around an expanded box. */
export const springLayout = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 36,
  mass: 0.9,
};

/** Non-spring moves: drawing a bar, collapsing a panel. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const instant = { duration: 0 };
