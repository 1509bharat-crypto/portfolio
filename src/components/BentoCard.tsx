'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cases, getCase } from '@/data/cases';
import { lab } from '@/data/lab';
import { springCrisp } from '@/lib/motion';
import { BentoGrid } from './BentoGrid';
import { CaseDetail } from './CaseDetail';
import { LabEntryDetail } from './LabEntryDetail';
import { LabGrid } from './LabGrid';
import { Pager } from './Pager';
import { StoryDetail } from './StoryDetail';

type View =
  | { kind: 'grid' }
  | { kind: 'case'; slug: string }
  | { kind: 'lab' }
  | { kind: 'labEntry'; slug: string }
  | { kind: 'story' };

const getLabEntry = (slug: string) => lab.find((e) => e.slug === slug);
const pad = (n: number) => String(n).padStart(2, '0');

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
 * The whole experience lives inside one card: case studies and the lab open as
 * overlays rather than navigations, which is what keeps the "everything at a
 * glance, minimal scrolling" concept intact.
 *
 * Detail views are a deck: one case study (or lab log) per viewport, left and
 * right arrows plus a position counter to move through the set. Arrow keys
 * work too.
 *
 * The URL is kept in step with `history.pushState`, so a case study is still
 * shareable and the back button still works; a cold load of /work/<slug> is
 * served by the real route instead.
 */
export function BentoCard({ initialView }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView ?? { kind: 'grid' });
  const reduced = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  /** -1 stepping back, 1 stepping forward, 0 opening from the grid. */
  const [dir, setDir] = useState(0);

  const go = useCallback((next: View, path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setView(next);
  }, []);

  const openCase = useCallback(
    (slug: string) => {
      setDir(0);
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
    go({ kind: 'grid' }, '/');
    lastFocused.current?.focus?.();
  }, [go]);

  // Current position in each deck, when a deck view is open.
  const study = view.kind === 'case' ? getCase(view.slug) : undefined;
  const caseIndex = study ? cases.findIndex((c) => c.slug === study.slug) : -1;
  const prevCase = caseIndex > 0 ? cases[caseIndex - 1] : undefined;
  const nextCase =
    caseIndex >= 0 && caseIndex < cases.length - 1
      ? cases[caseIndex + 1]
      : undefined;

  const labEntry = view.kind === 'labEntry' ? getLabEntry(view.slug) : undefined;
  const labIndex = labEntry
    ? lab.findIndex((e) => e.slug === labEntry.slug)
    : -1;
  const prevLab = labIndex > 0 ? lab[labIndex - 1] : undefined;
  const nextLab =
    labIndex >= 0 && labIndex < lab.length - 1 ? lab[labIndex + 1] : undefined;

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

  // Escape climbs one level; arrow keys page through the open deck.
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

  // The overlay covers the screen below 1100px; stop the page scrolling behind it.
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
  }, [view]);

  const panel = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : dir
      ? {
          initial: { opacity: 0, x: dir * 44 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: dir * -32 },
        }
      : {
          initial: { opacity: 0, y: 10, scale: 0.99 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 6, scale: 0.995 },
        };

  const transition = reduced ? { duration: 0 } : springCrisp;

  return (
    <div className="shell">
      <div className="frame">
        <div className="frame__body">
          <BentoGrid
            onOpenCase={openCase}
            onOpenLab={openLab}
            onOpenStory={openStory}
          />

          <AnimatePresence>
            {study ? (
              <motion.div
                key={`case-${study.slug}`}
                ref={overlayRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={`Case study: ${study.title}`}
                className="focusview"
                transition={transition}
                {...panel}
              >
                <div className="focus__main">
                  <CaseDetail study={study} morph={dir === 0} />
                </div>
                <Pager
                  position={`${study.number} / ${pad(cases.length)}`}
                  label={study.title}
                  onBack={close}
                  onPrev={prevCase ? () => stepCase(-1) : undefined}
                  onNext={nextCase ? () => stepCase(1) : undefined}
                />
              </motion.div>
            ) : null}

            {view.kind === 'story' ? (
              <motion.div
                key="story"
                ref={overlayRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="The story"
                className="focusview"
                transition={transition}
                {...panel}
              >
                <div className="focus__main">
                  <StoryDetail />
                </div>
                <Pager onBack={close} showArrows={false} />
              </motion.div>
            ) : null}

            {view.kind === 'lab' ? (
              <motion.div
                key="lab"
                ref={overlayRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Lab"
                className="labview"
                transition={transition}
                {...panel}
              >
                <div className="labview__head">
                  <div>
                    <span className="lab">Lab · open questions</span>
                    <h1>Experiments</h1>
                  </div>
                  <button className="wbtn" onClick={close}>
                    ⌗ Back to grid
                  </button>
                </div>
                <LabGrid onOpen={openLabEntry} />
              </motion.div>
            ) : null}

            {labEntry ? (
              <motion.div
                key={`lab-${labEntry.slug}`}
                ref={overlayRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={`Lab: ${labEntry.title}`}
                className="focusview focusview--top"
                transition={transition}
                {...panel}
              >
                <div className="focus__main">
                  <LabEntryDetail entry={labEntry} />
                </div>
                <Pager
                  position={`${pad(labIndex + 1)} / ${pad(lab.length)}`}
                  label={labEntry.title}
                  backLabel="⌗ Back to the lab"
                  onBack={openLab}
                  onPrev={prevLab ? () => stepLab(-1) : undefined}
                  onNext={nextLab ? () => stepLab(1) : undefined}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
