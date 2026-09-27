'use client';

import { useEffect, useRef } from 'react';

/**
 * The painted backdrop, in layers, behind every route.
 *
 * Bottom to top: the wallpaper, a scrim that buys the type back its contrast,
 * mist rising off the bottom edge, then (elsewhere) the dot field inverting
 * over all of it, and grain over everything.
 *
 * The wallpaper is 739×415 and covers a viewport many times that, so it is
 * upscaled hard. `image-rendering: pixelated` makes that a decision rather
 * than an accident — the blocks are the look, instead of a smeared bilinear
 * blur pretending the source was bigger than it is.
 */

/** How far the wallpaper shifts, in px, between opposite edges of the screen. */
const CURSOR_SHIFT = 14;
/**
 * Total scroll drift, end to end, in px. Two numbers because the two kinds of
 * page move differently: on the deck a vertical scroll drives the cards
 * *sideways*, so the backdrop has to drift sideways with them or it reads as
 * fighting the travel. Everywhere else the page really does scroll down.
 *
 * Both stay inside the overscan `scale(1.12)` buys — 86px each side at 1440
 * wide, 54px at 900 tall — with room left for CURSOR_SHIFT on top.
 */
const DRIFT_X = 56;
const DRIFT_Y = 34;
/** Share of the remaining distance covered each frame. */
const EASE = 0.06;

export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const art = ref.current;
    if (!art) return;

    // Rule 8: reduced motion gets the painting, held still.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let frame = 0;
    // Cached, and only looked up again once the one we have leaves the page —
    // the deck comes and goes as routes open over it.
    let deck: Element | null = null;

    const onMove = (e: PointerEvent) => {
      // −1…1 across the viewport, so the drift is symmetric about the middle.
      tx = (e.clientX / window.innerWidth - 0.5) * -2 * CURSOR_SHIFT;
      ty = (e.clientY / window.innerHeight - 0.5) * -2 * CURSOR_SHIFT;
    };

    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!deck?.isConnected) deck = document.querySelector('.hdeck');

      // Scroll is read every frame rather than from a scroll event: the deck
      // drives its own travel off window scroll, and a listener would only be
      // racing it for the same frames.
      const span = document.documentElement.scrollHeight - window.innerHeight;
      // −1…1 across the whole page, like the cursor across the viewport, so a
      // long deck and a short article drift by the same amount overall.
      const p = span > 0 ? (window.scrollY / span - 0.5) * -2 : 0;

      // Same sign as the cards' own travel, just a fraction of the distance.
      const sx = deck ? p * DRIFT_X : 0;
      const sy = deck ? 0 : p * DRIFT_Y;

      cx += (tx + sx - cx) * EASE;
      cy += (ty + sy - cy) * EASE;
      art.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(1.12)`;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <>
      <div className="bd">
        {/* Scaled past the frame so the parallax never walks an edge into view. */}
        <div className="bd__art" ref={ref} />
        <div className="bd__scrim" />
      </div>
      {/* Above the page, not behind it — grain sits on the whole image. */}
      <div className="grain" />
    </>
  );
}
