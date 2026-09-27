import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cases, getCase } from '@/data/cases';
import '../../case.css';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.summary,
    // Slots aren't written yet, so keep them out of search results.
    robots: study.slot ? { index: false, follow: true } : undefined,
    openGraph: { title: study.title, description: study.summary },
  };
}

/*
 * Links to `/` are plain anchors, never `next/link`.
 *
 * The cover is a vendored HTML string with six inline scripts that run as the
 * document parses. A client-side navigation injects that markup through React
 * instead, which does not execute script tags, so the cover arrives dead — no
 * `ready` class, no scenes, nothing. It has to be a document load.
 */

/**
 * One project, set as an editorial page rather than a case study template.
 *
 * The decisions hang off a spine, alternating sides, and that is the whole of
 * the middle of the page: no challenge/approach/outcome scaffold, no process
 * to walk through. Bharat's work is driven by craft and judgement, so what
 * the page shows is the judgement — what was chosen — and leaves the
 * reasoning to the write-ups he has done himself.
 *
 * A decision with no body renders as its title alone. The deck's design put
 * wireframe bars there, which read as something missing; here the title is
 * the content and elaboration is optional.
 *
 * It sits in the (pixel) group so it inherits the cover's paper, type and
 * grain, and the menu in that layout.
 */
export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) notFound();

  return (
    <>
      <a className="cs__home" href="/">
        Bharat
      </a>

      <article className="cs">
        {/* The corner mark goes home, which is the first scene. This goes back
            to the tiles you came from. */}
        <a className="cs__back" href="/?scene=3">
          ← Selected work
        </a>

        {/* Title on the left, the standfirst as its own column on the right.
            Before, the standfirst was one narrow measure adrift at the top of
            an otherwise full-width page. */}
        <header className="cs__head">
          <h1 className="cs__title">{study.title}</h1>
          <div>
            <p className="cs__kicker">{study.kicker}</p>
            <p className="cs__lede">{study.summary}</p>
          </div>
        </header>

        {study.blocks.length ? (
          <>
            <p className="cs__label">Decisions</p>
            <ol className="cs__tl">
              {study.blocks.map((b, i) => (
                <li className="cs__stop" key={`${b.title}-${i}`}>
                  <span className="cs__n">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="cs__t">{b.title}</h2>
                  {b.body ? <p className="cs__b">{b.body}</p> : null}
                </li>
              ))}
            </ol>
          </>
        ) : null}

        {study.stats?.length ? (
          <ul className="cs__stats">
            {study.stats.map((s) => (
              <li className="cs__stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {study.stack?.length || study.year ? (
          <footer className="cs__foot">
            <p>{study.stack?.length ? study.stack.join(' · ') : ''}</p>
            <p>{study.year ?? ''}</p>
          </footer>
        ) : null}

        {/* The corner mark goes home, which is the first scene. This goes back
            to the tiles you came from. */}
        <a className="cs__back" href="/?scene=3">
          ← Selected work
        </a>

      </article>
    </>
  );
}
