import Link from 'next/link';
import type { LabEntry } from '@/lib/types';
import { BarLines, Placeholder } from './Primitives';

/**
 * The log behind one experiment, in the same editorial dimension layout the
 * case studies use, one size quieter. Shared by the overlay on the home deck
 * and the standalone /lab/[slug] page.
 */
export function LabEntryDetail({
  entry,
  onNext,
  nextHref,
  nextTitle,
}: {
  entry: LabEntry;
  onNext?: () => void;
  nextHref?: string;
  nextTitle?: string;
}) {
  return (
    <article className="dimbody">
      <header className="dim__hero">
        <span className="lab">Lab · {entry.category}</span>
        <h1 className="dim__title">{entry.question}</h1>
        <div className="meta">
          <span className="chip">Status: {entry.status}</span>
          {entry.detail ? <span>{entry.detail}</span> : null}
        </div>
      </header>

      <div className="dim__rows">
        <section className="dim__row">
          <h2 className="dim__h2">The open question</h2>
          <div className="dim__content">
            <BarLines widths={[90, 62]} />
            <Placeholder className="dim__ph" />
          </div>
        </section>
        <section className="dim__row">
          <h2 className="dim__h2">What exists so far</h2>
          <div className="dim__content">
            <BarLines widths={[84, 51]} />
          </div>
        </section>
      </div>

      <footer className="dim__foot">
        <span className="lab">{entry.title}</span>
        {nextTitle && onNext ? (
          <button className="go" onClick={onNext}>
            Next · {nextTitle} →
          </button>
        ) : nextTitle && nextHref ? (
          <Link className="go" href={nextHref}>
            Next · {nextTitle} →
          </Link>
        ) : null}
      </footer>
    </article>
  );
}
