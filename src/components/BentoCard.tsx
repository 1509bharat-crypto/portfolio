'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cases, getCase } from '@/data/cases';
import { lab } from '@/data/lab';
import { springCrisp } from '@/lib/motion';
import { CaseDetail } from './CaseDetail';
import { HorizontalDeck } from './HorizontalDeck';
import { LabEntryDetail } from './LabEntryDetail';
import { LabGrid } from './LabGrid';
import { StoryDetail } from './StoryDetail';

type View =
  | { kind: 'grid' }
  | { kind: 'case'; slug: string }
  | { kind: 'lab' }
  | { kind: 'labEntry'; slug: string }
  | { kind: 'story' };

const getLabEntry = (slug: string) => lab.find((e) => e.slug === slug);

function viewFromPath(path: string): View {
  if (path.startsWith('/work/')) {
    const slug = path.slice('/work/'.length).replace(/\/$/, '');
    return getCase(slug) ? { kind: 'case', slug } : { kind: 'grid' };
  }
  if (path.startsWith('/lab/')) {
    const slug = path.slice('/lab/'.length).replace(/\/$/, '');
    return getLabEntry(slug) ? { kind: 'labEntry', slug } : { kind: 'lab' };
  }
  if (path === '/lab') return { kind: 'lab' };
  if (path === '/story') return { kind: 'story' };
  return { kind: 'grid' };
}

/**
 * Home is the deck; each card is a dimension. Clicking a card morphs it into
 * a full page (shared layoutId): the card's surface becomes the page's
 * background, a lone back button sits on top, and closing morphs it back into
 * its slot on the shelf.
 *
 * Stepping to the next project swaps the content inside the open dimension;
 * the dimension itself keeps the identity of the card it grew from, so Back
 * always returns to where you entered.
 *
 * The URL is kept in step with `history.pushState`; a cold load of
 * /work/<slug> is served by the real route instead.
 */
export function BentoCard({ initialView }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView ?? { kind: 'grid' });
  const reduced = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  /** -1 stepping back, 1 stepping forward, 0 opening fresh. */
  const [dir, setDir] = useState(0);
  /** The card each open dimension grew out of, for the morph home. */
  const [caseOrigin, setCaseOrigin] = useState<string | null>(null);
  const [labOrigin, setLabOrigin] = useState<string | null>(null);

  const go = useCallback((next: View, path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setView(next);
  }, []);

  const openCase = useCallback(
    (slug: string) => {
      setDir(0);
      setCaseOrigin(slug);
      lastFocused.current = document.activeElement as HTMLElement;
      go({ kind: 'case', slug }, `/work/${slug}`);
    },
    [go],
  );

  const openLab = useCallback(() => {
    setDir(0);
    lastFocused.current = document.activeElement as HTMLElement;
    go({ kind: 'lab' }, '/lab');
  }, [go]);

  const openLabEntry = useCallback(
    (slug: string) => {
      setDir(0);
      setLabOrigin(slug);
      go({ kind: 'labEntry', slug }, `/lab/${slug}`);
    },
    [go],
  );

  const openStory = useCallback(() => {
    setDir(0);
    lastFocused.current = document.activeElement as HTMLElement;
    go({ kind: 'story' }, '/story');
  }, [go]);

  const close = useCallback(() => {
    setDir(0);
    setCaseOrigin(null);
    setLabOrigin(null);
    go({ kind: 'grid' }, '/');
    lastFocused.current?.focus?.();
  }, [go]);

  // Current position in each set, when a dimension is open.
  const study = view.kind === 'case' ? getCase(view.slug) : undefined;
  const caseIndex = study ? cases.findIndex((c) => c.slug === study.slug) : -1;
  const nextCase =
    caseIndex >= 0 && caseIndex < cases.length - 1
      ? cases[caseIndex + 1]
      : undefined;
  const prevCase = caseIndex > 0 ? cases[caseIndex - 1] : undefined;

  const labEntry = view.kind === 'labEntry' ? getLabEntry(view.slug) : undefined;
  const labIndex = labEntry
    ? lab.findIndex((e) => e.slug === labEntry.slug)
    : -1;
  const nextLab =
    labIndex >= 0 && labIndex < lab.length - 1 ? lab[labIndex + 1] : undefined;
  const prevLab = labIndex > 0 ? lab[labIndex - 1] : undefined;

  const stepCase = (delta: -1 | 1) => {
    const target = delta === -1 ? prevCase : nextCase;
    if (!target) return;
    setDir(delta);
    go({ kind: 'case', slug: target.slug }, `/work/${target.slug}`);
  };

  const stepLab = (delta: -1 | 1) => {
    const target = delta === -1 ? prevLab : nextLab;
    if (!target) return;
    setDir(delta);
    go({ kind: 'labEntry', slug: target.slug }, `/lab/${target.slug}`);
  };

  // Browser back/forward drives the same state the buttons do.
  useEffect(() => {
    const onPop = () => setView(viewFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Escape climbs one level; arrow keys step within the open set.
  useEffect(() => {
    if (view.kind === 'grid') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view.kind === 'labEntry') openLab();
        else close();
        return;
      }
      if (view.kind === 'case') {
        if (e.key === 'ArrowRight') stepCase(1);
        if (e.key === 'ArrowLeft') stepCase(-1);
      }
      if (view.kind === 'labEntry') {
        if (e.key === 'ArrowRight') stepLab(1);
        if (e.key === 'ArrowLeft') stepLab(-1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  // The deck must not scroll behind an open dimension.
  useEffect(() => {
    if (view.kind === 'grid') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [view.kind]);

  useEffect(() => {
    if (view.kind !== 'grid') overlayRef.current?.focus();
  }, [view.kind]);

  // Fresh content starts at its top when stepping between projects.
  const contentKey =
    view.kind === 'case' || view.kind === 'labEntry' ? view.slug : view.kind;
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  const transition = reduced ? { duration: 0 } : springCrisp;

  const swap = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, x: dir * 40, y: dir === 0 ? 8 : 0 },
        animate: { opacity: 1, x: 0, y: 0 },
      };

  const fade = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 10, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 6, scale: 0.995 },
      };

  return (
    <>
      <HorizontalDeck
        onOpenCase={openCase}
        onOpenLab={openLab}
        onOpenStory={openStory}
      />

      <AnimatePresence>
        {study ? (
          <motion.div
            key="case-dim"
            layoutId={`dim-${caseOrigin ?? study.slug}`}
            ref={overlayRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Case study: ${study.title}`}
            className="dim"
            transition={transition}
          >
            <div className="dim__bar">
              <button className="wbtn dim__back" onClick={close}>
                ← Back
              </button>
            </div>
            <div className="dim__scroll" ref={scrollRef}>
              <motion.div key={study.slug} {...swap} transition={transition}>
                <CaseDetail
                  study={study}
                  onNext={nextCase ? () => stepCase(1) : undefined}
                  nextTitle={nextCase?.title}
                />
              </motion.div>
            </div>
          </motion.div>
        ) : null}

        {view.kind === 'lab' ? (
          <motion.div
            key="lab-dim"
            layoutId="dim-lab"
            ref={overlayRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Lab"
            className="dim"
            transition={transition}
          >
            <div className="dim__bar">
              <button className="wbtn dim__back" onClick={close}>
                ← Back
              </button>
            </div>
            <div className="dim__scroll">
              <div className="dimbody">
                <header className="dim__hero dim__hero--short">
                  <span className="lab">Lab · open questions</span>
                  <h1 className="dim__title">Experiments</h1>
                </header>
                <LabGrid onOpen={openLabEntry} />
              </div>
            </div>
          </motion.div>
        ) : null}

        {labEntry ? (
          <motion.div
            key="labentry-dim"
            layoutId={`dim-lab-${labOrigin ?? labEntry.slug}`}
            ref={overlayRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Lab: ${labEntry.title}`}
            className="dim dim--top"
            transition={transition}
          >
            <div className="dim__bar">
              <button className="wbtn dim__back" onClick={openLab}>
                ← Lab
              </button>
            </div>
            <div className="dim__scroll" ref={scrollRef}>
              <motion.div key={labEntry.slug} {...swap} transition={transition}>
                <LabEntryDetail
                  entry={labEntry}
                  onNext={nextLab ? () => stepLab(1) : undefined}
                  nextTitle={nextLab?.title}
                />
              </motion.div>
            </div>
          </motion.div>
        ) : null}

        {view.kind === 'story' ? (
          <motion.div
            key="story-dim"
            ref={overlayRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="The story"
            className="dim"
            transition={transition}
            {...fade}
          >
            <div className="dim__bar">
              <button className="wbtn dim__back" onClick={close}>
                ← Back
              </button>
            </div>
            <div className="dim__scroll">
              <div className="dimbody">
                <StoryDetail />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
