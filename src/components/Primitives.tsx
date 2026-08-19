'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { easeOut } from '@/lib/motion';

/**
 * The wireframe vocabulary, as components. These are what keep the built site
 * reading like the locked skeleton: crossed boxes stand in for imagery, bars
 * stand in for copy that hasn't been written yet.
 */

export function Placeholder({ className = '' }: { className?: string }) {
  return <div className={`ph ${className}`} aria-hidden />;
}

/**
 * Two bars, the wireframe's shorthand for a paragraph. They draw in from the
 * left on arrival — the one motion that belongs to a wireframe natively, since
 * it's how a rule gets drawn in the first place.
 */
export function BarLines({ widths = [90, 60] }: { widths?: number[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col gap-1.5" aria-hidden>
      {widths.map((w, i) => (
        <motion.div
          key={i}
          className="bar"
          style={{ width: `${w}%`, transformOrigin: 'left center' }}
          initial={reduced ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={
            reduced
              ? { duration: 0 }
              : { delay: 0.14 + i * 0.07, duration: 0.52, ease: easeOut }
          }
        />
      ))}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="lab">{children}</span>;
}

export function CellHead({
  label,
  number,
}: {
  label: string;
  number?: string;
}) {
  return (
    <div className="cellhead">
      <Label>{label}</Label>
      {number ? <span className="csnum">{number}</span> : null}
    </div>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <div className="chips">
      {items.map((c) => (
        <span key={c} className="chip">
          {c}
        </span>
      ))}
    </div>
  );
}
