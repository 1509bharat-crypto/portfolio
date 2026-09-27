'use client';

import { useEffect, useRef } from 'react';

/**
 * The site's dot field: a grid of dots that rest at nothing and drift up to
 * white a few at a time, like stars coming out. Fixed to the viewport and
 * behind every route — see `.dotbg`.
 *
 * It is a canvas because the pulse has to be per-dot. Eight overlaid CSS grids
 * was the closest CSS could get to randomness, and it read as a lattice — each
 * layer being itself a regular grid, a dot's neighbours all lit on the same
 * beat. Here every dot carries its own period and phase, so nothing lines up.
 */

/** Matches --s-4, the spacing step the rest of the site is laid out on. */
const PITCH = 24;
/** A dot's core and the outer edge of its feather. */
const CORE = 1;
const EDGE = 2;

type Dot = { x: number; y: number; period: number; phase: number };

export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // Rule 8: reduced motion gets a still page rather than a slower pulse —
    // the field carries no information, so there is nothing to preserve.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dots: Dot[] = [];
    let sprite: HTMLCanvasElement | null = null;
    let dpr = 1;
    let w = 0;
    let h = 0;
    let frame = 0;

    /**
     * The lit dot, drawn once into an offscreen tile and stamped from there.
     * The feather is a full pixel wide because at a hairline edge a dot this
     * small has nothing to antialias with, and the rasteriser snaps it to
     * whole device pixels — square on some, a sliver on others.
     */
    const buildSprite = () => {
      const ink = getComputedStyle(canvas).getPropertyValue('--ink').trim();
      const size = EDGE * 2;
      const s = document.createElement('canvas');
      s.width = s.height = Math.ceil(size * dpr);
      const sctx = s.getContext('2d');
      if (!sctx) return;
      sctx.scale(dpr, dpr);
      const g = sctx.createRadialGradient(EDGE, EDGE, 0, EDGE, EDGE, EDGE);
      g.addColorStop(CORE / EDGE, ink);
      g.addColorStop(1, 'transparent');
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, size, size);
      sprite = s;
    };

    const layout = () => {
      // CSS owns the layout size; this only sizes the backing store to match,
      // which is also what keeps the ResizeObserver below from feeding itself.
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      // Half a step in, so the grid is evenly inset rather than starting hard
      // against the viewport's edge.
      for (let y = PITCH / 2; y < h; y += PITCH) {
        for (let x = PITCH / 2; x < w; x += PITCH) {
          dots.push({
            x,
            y,
            // Slow and unequal: 7–17s, so no two neighbours share a beat.
            period: 7000 + Math.random() * 10000,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      buildSprite();
    };

    const draw = (t: number) => {
      frame = requestAnimationFrame(draw);
      if (!sprite) return;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        // A gentle rise and fall. The 6th power keeps a dot dark for most of
        // its cycle, so only a scattering is ever up at once.
        const s = Math.sin((t / d.period) * Math.PI * 2 + d.phase) * 0.5 + 0.5;
        const a = Math.pow(s, 6) * 0.85;
        if (a <= 0.004) continue;
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, d.x - EDGE, d.y - EDGE, EDGE * 2, EDGE * 2);
      }
    };

    layout();
    // The browser stops serving rAF to a hidden tab on its own, so the loop
    // needs no visibility handling of its own.
    frame = requestAnimationFrame(draw);

    const ro = new ResizeObserver(layout);
    ro.observe(canvas);

    // The sprite bakes in --ink, so it has to be rebuilt when the theme flips.
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', buildSprite);
    const mo = new MutationObserver(buildSprite);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
      scheme.removeEventListener('change', buildSprite);
    };
  }, []);

  return <canvas ref={ref} className="dotbg" aria-hidden />;
}
