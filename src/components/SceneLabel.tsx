'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Names the scene you are on, set above that scene's own content.
 *
 * The cover moves between five scenes with nothing saying what any of them
 * is — you land on twenty scattered words and have to infer it. Bharat had
 * already named four of the five in the source file, as the `aria-label` on
 * <section>; they were simply never shown. These are those names verbatim.
 *
 * It is positioned by measuring the active scene's container, because each
 * scene puts its content somewhere different: the copy sits left of centre,
 * the rest are centred blocks of their own widths. A fixed corner would make
 * it a caption for the page; measured, it is a heading for the thing under it.
 *
 * The scene is read off `document.body`, which `06-scenes.js` maintains, so
 * nothing here touches the vendored page.
 */

/** Bharat's own names, and the element each scene lays out. */
const SCENES = [
  { name: 'About', sel: '.copy' },
  { name: 'Skills', sel: '.scene2 .area' },
  { name: 'Timeline', sel: '.tl' },
  { name: 'Selected work', sel: '.wk' },
  { name: 'More projects', sel: '.mg' },
];

/** Later classes win: s2 stays set once you have left the frame. */
const sceneFromBody = (cls: string) => {
  if (/\bs5\b/.test(cls)) return 4;
  if (/\bs4\b/.test(cls)) return 3;
  if (/\bs3\b/.test(cls)) return 2;
  if (/\bs2\b/.test(cls)) return 1;
  return 0;
};

/** The gap between the label's baseline and the content it heads. */
const GAP = 34;

/**
 * How long a scene has to stop changing before it counts as arrived.
 *
 * Every scene staggers its own contents in at 125ms a step and some add one
 * more beat at the end — the timeline's note, the work scene's "View more".
 * Rather than restate those timings here, where they would drift from the
 * vendored script, watch the scene's own subtree and call it finished once it
 * has been quiet for longer than a step.
 */
const QUIET = 220;

export function SceneLabel() {
  const [at, setAt] = useState<{ x: number; y: number; i: number } | null>(
    null,
  );
  const raf = useRef(0);

  useEffect(() => {
    let settle = 0;
    let watched: Element | null = null;

    const active = () => {
      const cls = document.body.className;
      if (!/\bready\b/.test(cls)) return null;
      const i = sceneFromBody(cls);
      const el = document.querySelector(SCENES[i].sel);
      return el ? { i, el } : null;
    };

    /**
     * Measure and show. This runs once the scene has settled, never before:
     * measuring at transition time read a zero-height box, because the scene
     * is empty until its own contents start arriving.
     */
    const reveal = () => {
      const now = active();
      if (!now) return setAt(null);
      const r = now.el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return setAt(null);
      const next = { x: Math.round(r.left), y: Math.round(r.top - GAP), i: now.i };
      setAt((was) =>
        was && was.x === next.x && was.y === next.y && was.i === next.i
          ? was
          : next,
      );
    };

    const arm = () => {
      clearTimeout(settle);
      settle = window.setTimeout(reveal, QUIET);
    };

    /**
     * Watches the active scene only. A body-level observer cannot do this job:
     * it sees the scene classes themselves, which change before the content.
     *
     * Only `on` being *added* counts, for two reasons.
     *
     * The scattered words carry an `<i>` pixel that blinks a `lit` class about
     * ten times a second for as long as that scene is up, so counting every
     * class change meant the skills scene never read as settled.
     *
     * And a scene leaving removes `on` from everything it owns. Counting those
     * armed the clock on the way out, and since every `hide` strips its own
     * scene class — leaving `body="ready s2"`, which reads as scene one — the
     * label flashed "Skills" partway through every single transition.
     */
    const quiet = new MutationObserver((records) => {
      for (const m of records) {
        const was = /\bon\b/.test(m.oldValue ?? '');
        if (!was && (m.target as Element).classList.contains('on')) return arm();
      }
    });

    const watch = () => {
      cancelAnimationFrame(raf.current);
      // A frame late, so a scene that has just been shown has been laid out.
      raf.current = requestAnimationFrame(() => {
        const now = active();
        if (!now) {
          quiet.disconnect();
          watched = null;
          return;
        }
        if (now.el !== watched) {
          quiet.disconnect();
          quiet.observe(now.el, {
            subtree: true,
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true,
          });
          watched = now.el;
        }
        // Already on screen — a resize, or reduced motion, where every stagger
        // runs at zero delay and no further mutation is coming. Otherwise the
        // scene is mid-transition and the observer will start the clock.
        if (now.el.querySelector('.on')) arm();
      });
    };

    // The transition has begun. The content is about to go, so the label goes
    // with it rather than hanging over the empty beat between scenes.
    const leave = () => {
      clearTimeout(settle);
      setAt(null);
    };

    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    addEventListener('sceneout', leave);
    addEventListener('splashdone', watch);
    addEventListener('resize', watch);
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(settle);
      quiet.disconnect();
      mo.disconnect();
      removeEventListener('sceneout', leave);
      removeEventListener('splashdone', watch);
      removeEventListener('resize', watch);
    };
  }, []);

  if (!at) return null;

  return (
    <p className="scene" style={{ left: at.x, top: at.y }} aria-live="polite">
      {SCENES[at.i].name}
    </p>
  );
}
