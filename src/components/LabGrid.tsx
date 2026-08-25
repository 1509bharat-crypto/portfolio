'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { lab, labSlots } from '@/data/lab';
import { easeOut, springLayout } from '@/lib/motion';
import { BarLines, Label, Placeholder } from './Primitives';

/**
 * The lab is a grid of experiment boxes that expand in place. Clicking a box
 * grows it to span 2×2 and reveals its log inside itself; the other boxes
 * animate to their new slots around it.
 *
 * Nothing opens over the page. An earlier pass sent a click to a full-screen
 * view, which read as a navigation away from the lab rather than as opening
 * something in it.
 *
 * The URL still follows the open box, so /lab/<slug> stays shareable and the
 * back button still closes it; `initialOpen` lets the /lab/[slug] route render
 * already expanded rather than flashing the collapsed grid first.
 */
export function LabGrid({ initialOpen }: { initialOpen?: string }) {
  const [open, setOpen] = useState<string | null>(initialOpen ?? null);
  const reduced = useReducedMotion();
  const transition = reduced ? { duration: 0 } : springLayout;

  const toggle = (slug: string) => {
    const next = open === slug ? null : slug;
    setOpen(next);
    window.history.pushState(null, '', next ? `/lab/${next}` : '/lab');
  };

  // Back/forward closes or reopens the same box.
  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname;
      const slug = p.startsWith('/lab/') ? p.slice('/lab/'.length) : null;
      setOpen(slug && lab.some((e) => e.slug === slug) ? slug : null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        window.history.pushState(null, '', '/lab');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="labgrid">
      {lab.map((entry) => {
        const expanded = open === entry.slug;
        const panelId = `lab-log-${entry.slug}`;

        return (
          <motion.div
            key={entry.slug}
            layout
            transition={transition}
            className="labbox labbox--x"
            data-expanded={expanded}
          >
            <button
              className="labbox__toggle"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggle(entry.slug)}
            >
              <motion.span layout="position" className="cellhead">
                <Label>{entry.category}</Label>
                <span className="csnum" aria-hidden>
                  {expanded ? '−' : '+'}
                </span>
              </motion.span>

              {expanded ? null : <Placeholder />}

              <motion.span layout="position" className="headline">
                {entry.question}
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  key="log"
                  id={panelId}
                  className="labmore"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.28, ease: easeOut }}
                >
                  <div className="meta">
                    <span className="chip">Status: {entry.status}</span>
                    {entry.detail ? <span>{entry.detail}</span> : null}
                  </div>

                  <div className="labmore__blocks">
                    <div className="dblock">
                      <b>The open question</b>
                      <BarLines />
                    </div>
                    <div className="dblock">
                      <b>What exists so far</b>
                      <BarLines />
                    </div>
                  </div>

                  <Placeholder className="labmore__ph" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {labSlots.map((copy, i) => (
        <motion.div layout transition={transition} className="labbox labbox--slot" key={i}>
          <Label>Slot</Label>
          <Placeholder />
          <p className="storyline">{copy}</p>
        </motion.div>
      ))}
    </div>
  );
}
