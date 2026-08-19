'use client';

import Link from 'next/link';
import { profile } from '@/data/profile';

/**
 * Its own card, reachable from every page: name, availability, contact.
 * `onHome` closes an open overlay on the home card; without it the mark is a
 * real link back to `/`.
 */
export function TopBar({ onHome }: { onHome?: () => void }) {
  const home = (
    <>
      <span className="mono" aria-hidden>
        ⌗
      </span>
      {profile.name}
    </>
  );

  return (
    <header className="dock">
      {onHome ? (
        <button className="dock__home" onClick={onHome}>
          {home}
        </button>
      ) : (
        <Link href="/" className="dock__home">
          {home}
        </Link>
      )}

      <div className="dock__links">
        <span className="dock__meta">
          <span className="dot" aria-hidden />
          {profile.availability}
        </span>
        {profile.links.map((l) => (
          <a
            key={l.label}
            className="wbtn"
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
          >
            {l.label}
          </a>
        ))}
      </div>
    </header>
  );
}
