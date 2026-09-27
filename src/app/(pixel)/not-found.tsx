import './case.css';

/*
 * Links to `/` are plain anchors, never `next/link`.
 *
 * The cover is a vendored HTML string with six inline scripts that run as the
 * document parses. A client-side navigation injects that markup through React
 * instead, which does not execute script tags, so the cover arrives dead — no
 * `ready` class, no scenes, nothing. It has to be a document load.
 */

/**
 * 404, in the cover's language.
 *
 * It lives in (pixel) because that is now the only root layout, so this
 * composes with it and inherits the paper, the type and the grain, and it is
 * built from the project page's masthead so the two read as one site.
 */
export default function NotFound() {
  return (
    <>
      <a className="cs__home" href="/">
        Bharat
      </a>
      <article className="cs">
        <header className="cs__head">
          <h1 className="cs__title">Nothing here.</h1>
          <div>
            <p className="cs__kicker">404</p>
            <p className="cs__lede">
              That page does not exist, or it moved. The work is all reachable
              from the menu.
            </p>
          </div>
        </header>
        <a className="cs__back" href="/">
          ← Back to the start
        </a>
      </article>
    </>
  );
}
