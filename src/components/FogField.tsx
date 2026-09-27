'use client';

import { useEffect, useRef } from 'react';

/**
 * Mist, as a noise field rather than as moving shapes.
 *
 * The first version of this was three blurred ellipses tiled across the width
 * and translated on a loop. It never read as mist, because mist does not hold
 * its shape and slide — it changes while it drifts. Nothing built out of
 * fixed shapes can do that, however many you layer.
 *
 * So the density here is sampled from 3D fractal noise: two axes are the
 * screen, and the third is time. Moving along that third axis makes the field
 * *evolve* — wisps thin out, merge and reform in place — while a separate
 * horizontal offset carries the whole thing sideways. Those two together are
 * what reads as fluid.
 *
 * It renders into a deliberately tiny canvas, blown up by CSS and blurred. Fog
 * has no fine detail to lose, the upscale is free smoothing, and it keeps the
 * per-pixel noise cost to something trivial.
 */

/** Backing store, in pixels. Small on purpose — see above. */
const W = 160;
const H = 90;
/** Mist is slow; there is nothing to gain from redrawing it 60 times a second. */
const FPS = 24;
/** How much of the canvas's height the fog reaches, before its own falloff. */
const FEATHER = 1.4;
/**
 * Extra density in the last of the height, so the fog is thick along the
 * ground and breaks into wisps above it — which is what ground fog does.
 *
 * It is added *before* the threshold rather than painted as a flat floor, so
 * the line where thick becomes wispy is drawn by the noise and wanders across
 * the width. A CSS gradient cannot do that; its edge is always level, and that
 * is what made the previous version read as a block.
 */
const GROUND = 0.58;
/**
 * Sideways carry, and how fast the shapes themselves change.
 *
 * These two are a balance, and both ends of it are wrong. Too much FLOW and
 * the field is a conveyor belt: at EVOLVE 0.035 against FLOW 0.055 a flat 5px
 * translation accounted for most of four seconds of change. Too little, and
 * there is no direction to see: at EVOLVE 0.13 against FLOW 0.05 the shapes
 * changed about three times faster than they moved, and cross-correlating the
 * rendered strip over 1.6s intervals could not recover a drift at all.
 *
 * At 0.16 against 0.09 the wisps carry visibly across while still reforming.
 */
const FLOW = 0.16;
/**
 * Left to right. The sign matters and is not the obvious one: sampling the
 * noise further along x as time advances means a given wisp is found at a
 * SMALLER screen x each frame, so `+ t * FLOW` drifts the field leftward.
 * Subtracting is what carries it right.
 */
const DIRECTION = -1;
const EVOLVE = 0.09;
/**
 * Domain warp: before sampling the density, the coordinates are themselves
 * pushed around by a slower, coarser noise. It is the difference between a
 * field that fades in place and one that curls — straight fbm has no reason to
 * ever bend, and mist is mostly bending.
 */
const WARP = 3.4;

const hash = (x: number, y: number, z: number) => {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Value noise: cheaper than simplex, and indistinguishable once blurred. */
function noise(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = smooth(x - xi);
  const v = smooth(y - yi);
  const w = smooth(z - zi);

  const c = (dx: number, dy: number, dz: number) =>
    hash(xi + dx, yi + dy, zi + dz);

  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), u);
  const x10 = lerp(c(0, 1, 0), c(1, 1, 0), u);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), u);
  const x11 = lerp(c(0, 1, 1), c(1, 1, 1), u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}

/** Three octaves: the big shape of a bank, plus the ragged edge on it. */
function fbm(x: number, y: number, z: number) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 3; i++) {
    sum += noise(x * freq, y * freq, z * freq) * amp;
    freq *= 2.1;
    amp *= 0.5;
  }
  return sum;
}

export function FogField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;
    const image = ctx.createImageData(W, H);
    const px = image.data;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let mist: [number, number, number] = [252, 253, 250];
    const readMist = () => {
      const raw = getComputedStyle(canvas).getPropertyValue('--mist').trim();
      const parts = raw.split(',').map((n) => Number(n.trim()));
      if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
        mist = parts as [number, number, number];
      }
    };
    readMist();

    const render = (t: number) => {
      const [r, g, b] = mist;
      for (let y = 0; y < H; y++) {
        // Dense along the ground, gone by the top. Raised to a power so the
        // fog has a soft ceiling instead of a straight ramp.
        //
        // y/H, not 1 - y/H: canvas y counts DOWN from the top, so the row
        // nearest the ground is y = H, not y = 0. Inverted, this put the fog
        // in a bank along the top edge of its own band and left the ground
        // clear — which the old opaque floor gradient happened to hide.
        const nearGround = y / H;
        const falloff = Math.pow(nearGround, FEATHER);
        for (let x = 0; x < W; x++) {
          // One octave each — the warp only needs to be smooth, not detailed.
          const wx = (noise(x / 48, y / 36, t * 0.03) - 0.5) * WARP;
          const wy = (noise(x / 52 + 11, y / 34 + 7, t * 0.027) - 0.5) * WARP * 0.6;
          const n = fbm(x / 22 + DIRECTION * t * FLOW + wx, y / 14 + wy, t * EVOLVE);
          // Lift and clamp: below the threshold there is clear air, which is
          // what gives the bank an edge rather than a uniform haze.
          // Concentrated low: a fifth power is nothing until the very bottom.
          const ground = Math.pow(nearGround, 5) * GROUND;
          let a = (n - 0.3 + ground) * 2.3 * falloff;
          if (a < 0) a = 0;
          else if (a > 1) a = 1;
          const i = (y * W + x) * 4;
          px[i] = r;
          px[i + 1] = g;
          px[i + 2] = b;
          px[i + 3] = a * 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    if (reduced) {
      render(0);
      const mo = new MutationObserver(() => {
        readMist();
        render(0);
      });
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
      return () => mo.disconnect();
    }

    let frame = 0;
    let last = 0;
    const interval = 1000 / FPS;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < interval) return;
      last = now;
      render(now / 1000);
    };
    frame = requestAnimationFrame(loop);

    const mo = new MutationObserver(readMist);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="bd__fog" aria-hidden />;
}
