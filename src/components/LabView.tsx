'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { lab } from '@/data/lab';
import { BarLines, Placeholder } from './Primitives';
import { LabGrid } from './LabGrid';

const getEntry = (slug: string) => lab.find((e) => e.slug === slug);

/**
 * The lab, and the logs inside it. Opening a log swaps the lab's own content
 * for that log — it becomes a page within the lab page. Nothing opens over the
 * top and nothing navigates away, so the log reads as somewhere you already
 * are rather than somewhere you were sent.
 *
 * The URL still follows: /lab/<slug> is shareable, and back closes the log.
 *
 * LabView owns the single back control, because what "back" means depends on
 * state it holds: inside a log it returns to the experiments, and at the grid
 * it leaves the lab. Letting the page shell render one too put two arrows on
 * top of each other.
 */
export function LabView({
  initialOpen,
  onExit,
}: {
  initialOpen?: string;
  /** Leaves the lab. Omitted on the standalone route, which links to `/`. */
  onExit?: () => void;
}) {
  const [open, setOpen] = useState<string | null>(initialOpen ?? null);

  const show = useCallback((slug: string) => {
    setOpen(slug);
    window.history.pushState(null, '', `/lab/${slug}`);
  }, []);

  const back = useCallback(() => {
    setOpen(null);
    window.history.pushState(null, '', '/lab');
  }, []);

  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname;
      const slug = p.startsWith('/lab/') ? p.slice('/lab/'.length) : null;
      setOpen(slug && getEntry(slug) ? slug : null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const entry = open ? getEntry(open) : undefined;

  const exit = onExit ? (
    <button className="wbtn dim__back" onClick={onExit} aria-label="Back to the deck">
      <span aria-hidden>←</span>
    </button>
  ) : (
    <Link className="wbtn dim__back" href="/" aria-label="Back to the deck">
      <span aria-hidden>←</span>
    </Link>
  );

  if (entry) {
    return (
      <>
        <div className="dim__bar">
          <button
            className="wbtn dim__back"
            onClick={back}
            aria-label="Back to the experiments"
          >
            <span aria-hidden>←</span>
          </button>
        </div>
        <div className="dim__scroll">
        <div className="dimbody">
        <header className="dim__hero">
          <span className="lab">Lab · {entry.category}</span>
          <h1 className="dim__title">{entry.question}</h1>
          <div className="meta">
            <span className="chip">Status: {entry.status}</span>
            {entry.detail ? <span>{entry.detail}</span> : null}
          </div>
        </header>

        <div className="dgrid">
          <div className="dblock">
            <b>The open question</b>
            <BarLines />
          </div>
          <div className="dblock">
            <b>What exists so far</b>
            <BarLines />
          </div>
        </div>

        <Placeholder className="dim__ph" />
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dim__bar">{exit}</div>
      <div className="dim__scroll">
        <div className="dimbody">
          <header className="dim__hero dim__hero--short">
            <span className="lab">Lab · open questions</span>
            <h1 className="dim__title">Experiments</h1>
          </header>
          <LabGrid onOpen={show} />
        </div>
      </div>
    </>
  );
}
