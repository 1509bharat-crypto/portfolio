'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getCase } from '@/data/cases';
import { springCrisp } from '@/lib/motion';
import { BentoGrid } from './BentoGrid';
import { CaseDetail } from './CaseDetail';
import { CaseMap } from './CaseMap';
import { StoryDetail } from './StoryDetail';
import { LabGrid } from './LabGrid';
import { TopBar } from './TopBar';

type View =
  | { kind: 'grid' }
  | { kind: 'case'; slug: string }
  | { kind: 'lab' }
  | { kind: 'story' };

function viewFromPath(path: string): View {
  if (path.startsWith('/work/')) {
    const slug = path.slice('/work/'.length).replace(/\/$/, '');
    return getCase(slug) ? { kind: 'case', slug } : { kind: 'grid' };
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
 * The URL is kept in step with `history.pushState`, so a case study is still
 * shareable and the back button still works — and a cold load of /work/<slug>
 * is served by the real route instead.
 */
export function BentoCard({ initialView }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView ?? { kind: 'grid' });
  const reduced = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const go = useCallback((next: View, path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setView(next);
  }, []);

  const openCase = useCallback(
    (slug: string) => {
      lastFocused.current = document.activeElement as HTMLElement;
      go({ kind: 'case', slug }, `/work/${slug}`);
    },
    [go],
  );

  const openLab = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement;
    go({ kind: 'lab' }, '/lab');
  }, [go]);

  const openStory = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement;
    go({ kind: 'story' }, '/story');
  }, [go]);

  const close = useCallback(() => {
    go({ kind: 'grid' }, '/');
    lastFocused.current?.focus?.();
  }, [go]);

  // Browser back/forward drives the same state the buttons do.
  useEffect(() => {
    const onPop = () => setView(viewFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (view.kind === 'grid') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [view.kind, close]);

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
    : {
        initial: { opacity: 0, y: 10, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 6, scale: 0.995 },
      };

  const transition = reduced ? { duration: 0 } : springCrisp;

  const study = view.kind === 'case' ? getCase(view.slug) : undefined;

  return (
    <div className="shell">
      <TopBar onHome={close} />

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
                  <CaseDetail study={study} morph />
                </div>
                <CaseMap activeSlug={study.slug} onSelect={openCase} onBack={close} />
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
                <CaseMap onSelect={openCase} onBack={close} />
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
                <LabGrid />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
