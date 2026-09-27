'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cases, getCase } from '@/data/cases';
import { CaseDetail } from './CaseDetail';
import { HorizontalDeck } from './HorizontalDeck';
import { LabView } from './LabView';
import { StoryDetail } from './StoryDetail';
import { IconBack } from './Primitives';

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
  // A log lives inside the lab, so /lab/<slug> is still the lab view;
  // LabView reads the slug off the URL and shows that log.
  if (path === '/lab' || path.startsWith('/lab/')) return { kind: 'lab' };
  if (path === '/story') return { kind: 'story' };
  return { kind: 'grid' };
}

/**
 * Home is the deck; clicking a card opens it as a full view.
 *
 * There are no transition animations between views: a view is either up or it
 * isn't. The deck's own scroll-driven motion stays, because that is the deck
 * working rather than a page changing.
 *
 * The URL is kept in step with `history.pushState`; a cold load of
 * /work/<slug> is served by the real route instead.
 */
export function BentoCard({ initialView }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView ?? { kind: 'grid' });
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const study = view.kind === 'case' ? getCase(view.slug) : undefined;
  const caseIndex = study ? cases.findIndex((c) => c.slug === study.slug) : -1;
  const nextCase =
    caseIndex >= 0 && caseIndex < cases.length - 1 ? cases[caseIndex + 1] : undefined;
  const prevCase = caseIndex > 0 ? cases[caseIndex - 1] : undefined;

  const stepCase = (delta: -1 | 1) => {
    const target = delta === -1 ? prevCase : nextCase;
    if (!target) return;
    go({ kind: 'case', slug: target.slug }, `/work/${target.slug}`);
  };

  // Browser back/forward drives the same state the buttons do.
  useEffect(() => {
    const onPop = () => setView(viewFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Escape closes; arrows step within the open set.
  useEffect(() => {
    if (view.kind === 'grid') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (view.kind === 'case') {
        if (e.key === 'ArrowRight') stepCase(1);
        if (e.key === 'ArrowLeft') stepCase(-1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  // The deck must not scroll behind an open view, but its scroll position has
  // to survive: `overflow: hidden` on the body would reset it to 0. So block
  // the input instead of collapsing the scroller; the open view opts out.
  useEffect(() => {
    if (view.kind === 'grid') return;
    const block = (e: Event) => {
      if (overlayRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
    };
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    return () => {
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
    };
  }, [view.kind]);

  // Keyboard scrolling stays inside the open view.
  useEffect(() => {
    if (view.kind === 'grid') return;
    const scroller = overlayRef.current?.querySelector<HTMLElement>('.dim__scroll');
    (scroller ?? overlayRef.current)?.focus();
  }, [view.kind]);

  // Fresh content starts at its top when stepping between projects.
  const contentKey = view.kind === 'case' ? view.slug : view.kind;
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  return (
    <>
      <HorizontalDeck
        onOpenCase={openCase}
        onOpenLab={openLab}
        onOpenStory={openStory}
      />

      {study ? (
        <div
          ref={overlayRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={`Case study: ${study.title}`}
          className="dim"
        >
          <div className="dim__bar">
            <button
              className="wbtn dim__back"
              onClick={close}
              aria-label="Back to the deck"
            >
              <IconBack />
            </button>
          </div>
          <div className="dim__scroll" ref={scrollRef} tabIndex={-1}>
            <CaseDetail
              study={study}
              onNext={nextCase ? () => stepCase(1) : undefined}
              nextTitle={nextCase?.title}
            />
          </div>
        </div>
      ) : null}

      {view.kind === 'lab' ? (
        <div
          ref={overlayRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Lab"
          className="dim"
        >
          <LabView onExit={close} />
        </div>
      ) : null}

      {view.kind === 'story' ? (
        <div
          ref={overlayRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="The story"
          className="dim"
        >
          <div className="dim__bar">
            <button
              className="wbtn dim__back"
              onClick={close}
              aria-label="Back to the deck"
            >
              <IconBack />
            </button>
          </div>
          <div className="dim__scroll" tabIndex={-1}>
            <StoryDetail />
          </div>
        </div>
      ) : null}
    </>
  );
}
