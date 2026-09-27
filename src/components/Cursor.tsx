'use client';

import { useEffect, useRef } from 'react';
import { springBounce } from '@/lib/motion';

/**
 * A white dot that trails the pointer instead of sitting on it.
 *
 * This has to be a drawn element rather than `cursor: url(…)`, because a
 * url() cursor is drawn by the operating system: it is always exactly on the
 * pointer, and there is nothing to delay. Taking it over in the page means
 * hiding the native one, which is why the component is careful about when it
 * does that — see the two media queries below.
 *
 * Four states, none of which snap:
 *
 *   idle        18px   the resting dot
 *   over        44px   the pointer is on a link or a button — this is what
 *                      replaces the system hand, which `cursor: none` took away
 *   pressed     0.72×  of whatever it is at, so a click reads as a press
 *   away        hidden the pointer has left the window
 *
 * Scale is run by a spring rather than an ease, so a press overshoots coming
 * back instead of gliding to a stop. Position stays a plain lerp — a trailing
 * dot that overshot the pointer would read as a bug.
 */

/** Share of the remaining distance the dot covers each frame. Lower = more lag. */
const EASE = 0.16;

/**
 * The dot is laid out at its LARGEST and only ever scaled down.
 *
 * `will-change: transform` puts it on its own compositor layer, and that layer
 * is rasterised once, at layout size. Scaling a layer up stretches the bitmap
 * it already has rather than redrawing it, so an 18px circle blown up to 2.4×
 * arrives as a 36-device-pixel circle stretched to 86 — a visibly jagged edge.
 * Scaling down resamples cleanly, so the sizes below are expressed in px and
 * divided by the rendered size to get a scale that never exceeds 1.
 *
 * RENDERED is deliberately larger than the biggest state: the press spring
 * overshoots by about a quarter of its travel, which carried the 44px state to
 * a measured 47.7px, back above 1 and upscaling again for a few frames. 48
 * leaves the peak just under. Must match .cursor's width and height.
 */
const RENDERED = 48;
const IDLE = 18;
const OVER = 44;
const PRESSED = 0.72;

/** What counts as something you can act on. */
const INTERACTIVE = 'a[href], button, [role="button"], input, select, textarea';

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = ref.current;
    if (!dot) return;

    // A dot that trails a pointer needs a pointer to trail. On touch there
    // isn't one, and hiding the system cursor would leave nothing at all.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const root = document.documentElement;
    // Only now does the native cursor go away — so no-JS and touch keep it.
    root.dataset.cursor = 'custom';

    // Rule 8. The lag *is* the motion here, so reduced motion keeps the dot
    // and the states, and drops only the delay.
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let scale = 1;
    /** Scale's velocity, carried between frames by the spring. */
    let vScale = 0;
    let last = 0;
    let over = false;
    let pressed = false;
    let live = false;
    let frame = 0;

    const target = () =>
      ((over ? OVER : IDLE) / RENDERED) * (pressed ? PRESSED : 1);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      over =
        e.target instanceof Element && !!e.target.closest(INTERACTIVE);
      if (!live) {
        // Start under the pointer, rather than flying in from the corner.
        cx = tx;
        cy = ty;
        scale = target();
        vScale = 0;
        live = true;
        dot.style.opacity = '1';
      }
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    // Leaving the window parks the dot instead of stranding it mid-trail.
    const onLeave = () => {
      live = false;
      pressed = false;
      dot.style.opacity = '0';
    };

    const draw = (t: number) => {
      frame = requestAnimationFrame(draw);
      // Clamped, so a stalled tab resuming cannot hand the spring a huge step
      // and blow it up.
      const dt = last ? Math.min((t - last) / 1000, 1 / 30) : 0;
      last = t;
      if (!live) return;
      if (reduced) {
        cx = tx;
        cy = ty;
        scale = target();
      } else {
        cx += (tx - cx) * EASE;
        cy += (ty - cy) * EASE;
        const { stiffness, damping, mass } = springBounce;
        const force = -stiffness * (scale - target()) - damping * vScale;
        vScale += (force / mass) * dt;
        scale += vScale * dt;
      }
      // translate(-50%, -50%) after the move so the dot centres on the point,
      // and scale last so it grows about that centre rather than off it.
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      delete root.dataset.cursor;
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden />;
}
