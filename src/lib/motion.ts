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

/**
 * A press that bounces back. Underdamped on purpose, unlike the two above:
 * critical damping here is 2·√(420 × 0.8) ≈ 36.7, so 14 lands at a ratio of
 * about 0.38, which overshoots by roughly a quarter of the travel. At 22
 * (ratio 0.6) the overshoot measured under half a pixel on the cursor and
 * read as no bounce at all.
 *
 * Integrated by hand in `Cursor`, which runs its own rAF loop rather than
 * going through Motion.
 */
export const springBounce = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 14,
  mass: 0.8,
};

/** Non-spring moves: drawing a bar, collapsing a panel. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const instant = { duration: 0 };
