import Link from 'next/link';
import type { CaseStudy } from '@/lib/types';
import { BarLines, Placeholder } from './Primitives';

/**
 * The body of one case study, laid out editorially inside its dimension:
 * a hero that owns the golden share of the first viewport, then one row per
 * section with the title in the narrow column and the content in the wide
 * one (1 : 1.618). Content is capped by the data, not the layout; keep it
 * to roughly two viewports.
 *
 * Shared by the overlay dimension on the home deck and the standalone
 * /work/[slug] page. Pass `onNext` from the overlay, `nextHref` from the
 * page; both render the same footer link.
 */
export function CaseDetail({
  study,
  onNext,
  nextHref,
  nextTitle,
}: {
  study: CaseStudy;
  onNext?: () => void;
  nextHref?: string;
  nextTitle?: string;
}) {
  return (
    <article className="dimbody">
      <header className="dim__hero">
        <span className="lab">{study.kicker}</span>
        <h1 className="dim__title">{study.headline}</h1>
        {study.stats?.length ? (
          <div className="stats">
            {study.stats.map((s) => (
              <div className="stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </header>

      <div className="dim__rows">
        {study.blocks.map((b, i) => (
          <section className="dim__row" key={`${b.title}-${i}`}>
            <h2 className="dim__h2">{b.title}</h2>
            <div className="dim__content">
              {b.body ? (
                <p className="dim__p">{b.body}</p>
              ) : (
                <BarLines widths={[92, 68, 45]} />
              )}
              {i % 2 === 0 ? <Placeholder className="dim__ph" /> : null}
            </div>
          </section>
        ))}
      </div>

      <Placeholder className="dim__wide" />

      <footer className="dim__foot">
        {study.stack?.length ? (
          <div className="meta">
            {study.stack.map((t, i) => (
              <span key={t}>
                {t}
                {i < study.stack!.length - 1 ? <span aria-hidden> ·</span> : null}
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}
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
