'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { lab } from '@/data/lab';
import { springCrisp } from '@/lib/motion';
import { LabEntryDetail } from './LabEntryDetail';
import { LabGrid } from './LabGrid';

const getEntry = (slug: string) => lab.find((e) => e.slug === slug);

/**
 * The standalone /lab page, behaving like the lab dimension on the deck.
 *
 * It used to render the boxes as links, so opening a log swapped the whole
 * route: no morph, the header and grid torn down and rebuilt. Clicking a box
 * now grows the log out of the box it came from, exactly as it does inside the
 * deck, and the URL is kept in step with pushState so /lab/<slug> stays
 * shareable and Back still works.
 */
export function LabPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const reduced = useReducedMotion();

  const openEntry = useCallback((slug: string, from?: DOMRect) => {
    if (from) setOrigin(from);
    window.history.pushState(null, '', `/lab/${slug}`);
    setOpen(slug);
  }, []);

  const close = useCallback(() => {
    window.history.pushState(null, '', '/lab');
    setOpen(null);
  }, []);

  // Browser back/forward drives the same state the buttons do.
  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname;
      const slug = p.startsWith('/lab/') ? p.slice('/lab/'.length) : null;
      setOpen(slug && getEntry(slug) ? slug : null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const entry = open ? getEntry(open) : undefined;
  const transition = reduced ? { duration: 0 } : springCrisp;

  // Grow out of the box's rect, the same way the deck grows a card.
  const grow =
    reduced || !origin
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }
      : (() => {
          const at = {
            opacity: 0,
            x: origin.left,
            y: origin.top,
            scale: origin.width / window.innerWidth,
          };
          return { initial: at, animate: { opacity: 1, x: 0, y: 0, scale: 1 }, exit: at };
        })();

  return (
    <>
      <div className="dimpage">
        <div className="dim__bar">
          <Link className="wbtn dim__back" href="/">
            ← Back
          </Link>
        </div>
        <div className="dim__scroll">
          <div className="dimbody">
            <header className="dim__hero dim__hero--short">
              <span className="lab">Lab · open questions</span>
              <h1 className="dim__title">Experiments</h1>
            </header>
            <LabGrid onOpen={openEntry} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {entry ? (
          <motion.div
            key="labentry-dim"
            role="dialog"
            aria-modal="true"
            aria-label={`Lab: ${entry.title}`}
            className="dim dim--top"
            style={{ transformOrigin: 'top left' }}
            transition={transition}
            {...grow}
          >
            <div className="dim__bar">
              <button className="wbtn dim__back" onClick={close}>
                ← Lab
              </button>
            </div>
            <div className="dim__scroll" tabIndex={-1}>
              <LabEntryDetail entry={entry} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
