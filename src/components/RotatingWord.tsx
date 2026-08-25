'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { easeOut } from '@/lib/motion';

/**
 * A phrase in the pitch, cycling. Each word rises into place a beat after the
 * one before it, and leaves the same way in reverse — so the line resolves
 * left to right rather than arriving as a block.
 *
 * Every candidate phrase is also rendered invisibly in the same grid cell, so
 * the slot is as wide as the longest and nothing around it reflows. The live
 * phrase is taken out of flow on top, which also lets the outgoing and
 * incoming phrases overlap: without that, the slot would sit empty for a beat
 * between them.
 */
export function RotatingWord({
  words,
  interval = 4800,
}: {
  words: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [words.length, interval]);

  const phrase = words[index];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.11 } },
    // Front to back on the way out as well as in, so the leading word always
    // moves first and the eye follows one direction through the swap.
    out: { transition: { staggerChildren: reduced ? 0 : 0.08 } },
  };

  const word = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0 } },
        out: { opacity: 0, transition: { duration: 0 } },
      }
    : {
        hidden: { opacity: 0, y: '0.55em' },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.66, ease: easeOut },
        },
        out: {
          opacity: 0,
          y: '-0.45em',
          transition: { duration: 0.48, ease: easeOut },
        },
      };

  return (
    <span className="rotw">
      {words.map((w) => (
        <span className="rotw__ghost" aria-hidden key={w}>
          {w}
        </span>
      ))}

      <AnimatePresence initial={false}>
        <motion.span
          key={phrase}
          className="rotw__live"
          variants={container}
          initial="hidden"
          animate="show"
          exit="out"
        >
          {phrase.split(' ').map((w, i, all) => (
            <motion.span className="rotw__word" variants={word} key={`${w}-${i}`}>
              {w}
              {i < all.length - 1 ? ' ' : null}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
