'use client';

import Link from 'next/link';
import { IdentityLinks } from './Identity';

function Arrow({
  glyph,
  label,
  onClick,
  href,
}: {
  glyph: string;
  label: string;
  onClick?: () => void;
  href?: string | null;
}) {
  if (href) {
    return (
      <Link className="pager__arrow" href={href} aria-label={label}>
        {glyph}
      </Link>
    );
  }
  return (
    <button
      className="pager__arrow"
      onClick={onClick}
      disabled={!onClick}
      aria-label={label}
    >
      {glyph}
    </button>
  );
}

/**
 * The one navigation element inside a detail view: back on the left, where you
 * are in the middle, contact, and the left and right arrows. Callbacks drive
 * the overlay on the home card; hrefs make the same bar work on the standalone
 * pages.
 */
export function Pager({
  position,
  label,
  backLabel = '⌗ Back to grid',
  onBack,
  backHref,
  onPrev,
  onNext,
  prevHref,
  nextHref,
  showArrows = true,
}: {
  position?: string;
  label?: string;
  backLabel?: string;
  onBack?: () => void;
  backHref?: string;
  onPrev?: () => void;
  onNext?: () => void;
  prevHref?: string | null;
  nextHref?: string | null;
  showArrows?: boolean;
}) {
  return (
    <nav className="pager" aria-label="Detail navigation">
      {onBack ? (
        <button className="wbtn pager__back" onClick={onBack}>
          {backLabel}
        </button>
      ) : (
        <Link className="wbtn pager__back" href={backHref ?? '/'}>
          {backLabel}
        </Link>
      )}

      <div className="pager__pos">
        {position ? <span className="csnum">{position}</span> : null}
        {label ? <span className="pager__label">{label}</span> : null}
      </div>

      <IdentityLinks compact />

      {showArrows ? (
        <div className="pager__nav">
          <Arrow glyph="←" label="Previous" onClick={onPrev} href={prevHref} />
          <Arrow glyph="→" label="Next" onClick={onNext} href={nextHref} />
        </div>
      ) : null}
    </nav>
  );
}
