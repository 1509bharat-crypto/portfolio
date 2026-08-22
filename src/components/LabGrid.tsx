'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import { lab, labSlots } from '@/data/lab';
import { easeOut, springLayout } from '@/lib/motion';
import { Label, Placeholder } from './Primitives';

/**
 * The lab is a full grid of experiment boxes that expand in place. The `layout`
 * prop is doing the real work: when one box grows to span 2×2, every sibling
 * animates to its new slot instead of jumping.
 *
 * The box is a wrapper rather than one big button because the expanded state
 * contains a link to the full log, and an anchor inside a button is invalid.
 * The toggle is its own button covering the box's resting content.
 */
export function LabGrid() {
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const transition = reduced ? { duration: 0 } : springLayout;

  return (
    <div className="labgrid">
      {lab.map((entry) => {
        const expanded = open === entry.slug;
        const panelId = `lab-panel-${entry.slug}`;

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
              onClick={() => setOpen(expanded ? null : entry.slug)}
            >
              <motion.span layout="position" className="cellhead">
                <Label>{entry.category}</Label>
                <span className="csnum" aria-hidden>
                  {expanded ? '−' : '+'}
                </span>
              </motion.span>

              <Placeholder />

              <motion.span layout="position" className="headline">
                {entry.question}
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  key="more"
                  id={panelId}
                  className="labmore"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 0.26, ease: easeOut }
                  }
                >
                  <span className="storyline">
                    Status: {entry.status}
                    {entry.detail ? ` · ${entry.detail}` : null}
                  </span>
                  <Link href={`/lab/${entry.slug}`} className="labmore__link">
                    Read the log →
                  </Link>
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
