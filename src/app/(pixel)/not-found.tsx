import Link from 'next/link';
import './case.css';

/**
 * 404, in the cover's language.
 *
 * It lives in (pixel) because that is now the only root layout, so this
 * composes with it and inherits the paper, the type and the grain.
 */
export default function NotFound() {
  return (
    <>
      <Link className="cs__home" href="/">
        Bharat
      </Link>
      <article className="cs">
        <h1 className="cs__title">Nothing here.</h1>
        <div className="cs__dash" />
        <p className="cs__kicker">404</p>
        <p className="cs__lede">
          That page does not exist, or it moved. The work is all reachable
          from the menu.
        </p>
        <Link className="cs__next" href="/">
          Back to the start →
        </Link>
      </article>
    </>
  );
}
