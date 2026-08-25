import Link from 'next/link';
import { BarLines } from '@/components/Primitives';

export default function NotFound() {
  return (
    <div className="dimpage">
      <div className="dim__bar">
        <Link className="wbtn dim__back" href="/" aria-label="Back to the deck">
          <span aria-hidden>←</span>
        </Link>
      </div>
      <div className="dim__scroll">
        <div className="dimbody">
          <header className="dim__hero dim__hero--short">
            <span className="lab">404 · no such card</span>
            <h1 className="dim__title">This one isn&apos;t on the shelf</h1>
            <p className="dim__p">
              The page you asked for doesn&apos;t exist. It may have been a
              slot that never got filled.
            </p>
          </header>
          <div className="dim__rows">
            <section className="dim__row">
              <h2 className="dim__h2">Try the work</h2>
              <div className="dim__content">
                <BarLines />
                <Link href="/" className="go">
                  Back to the deck →
                </Link>
              </div>
            </section>
            <section className="dim__row">
              <h2 className="dim__h2">Or the lab</h2>
              <div className="dim__content">
                <BarLines />
                <Link href="/lab" className="go">
                  Experiments →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
