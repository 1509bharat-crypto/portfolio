'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/**
 * A way around the site.
 *
 * The cover is five scenes and nothing says so, or lets you reach one
 * directly. This lists them by Bharat's own names, and the project pages
 * under them.
 *
 * Jumping scenes uses `window.__go`, which `scripts/extract-pixel.mjs`
 * publishes from the scenes script — the one line in src/pixel/ that is not
 * verbatim. Off the cover there is nothing to drive, so the scene entries
 * become links home.
 *
 * It lives here rather than in `src/pixel/` because that directory is the
 * source file, vendored and never hand-edited. The menu is a sibling of it,
 * using its tokens, so the page underneath stays as Bharat made it.
 */

/** The source file's palette, one colour per link. */
const PAL = [
  '#E63312',
  '#1F4DB7',
  '#F2C114',
  '#2E9E4F',
  '#F07D1C',
  '#D63A8E',
  '#2FA8D8',
  '#6B3FA0',
];

/**
 * The scenes worth listing, and which scene each jumps to.
 *
 * "More projects" is not here: it is where "View more" on the work scene
 * goes, so listing it as a peer of Work would offer two doors to the same
 * room. The project pages are not here either — you reach those from the work
 * tiles, which is what the work scene is for.
 */
const PAGES: { name: string; scene: number }[] = [
  { name: 'About', scene: 0 },
  { name: 'Skills', scene: 1 },
  { name: 'Timeline', scene: 2 },
  { name: 'Work', scene: 3 },
];

declare global {
  interface Window {
    __go?: (to: number) => void;
    __splashDone?: boolean;
  }
}

const subscribeToSplash = (onChange: () => void) => {
  addEventListener('splashdone', onChange);
  return () => removeEventListener('splashdone', onChange);
};
const splashDone = () => !!window.__splashDone;
/** The server cannot know, and the cover starts behind the intro. */
const splashDoneOnServer = () => false;

export function PixelNav() {
  const pathname = usePathname();
  const onCover = pathname === '/';
  const splash = useSyncExternalStore(
    subscribeToSplash,
    splashDone,
    splashDoneOnServer,
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // On the cover the toggle waits for the loader, like the sound button.
  // Everywhere else there is no loader to wait for.
  const shown = onCover ? splash : true;

  // Escape closes, and so does a click anywhere else — otherwise the panel
  // sits open while the scene behind it changes under a wheel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onDown);
    return () => {
      removeEventListener('keydown', onKey);
      removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  let n = 0;
  const colour = () => ({ '--c': PAL[n++ % PAL.length] }) as React.CSSProperties;

  return (
    <div ref={ref}>
      <button
        type="button"
        className={`nav__toggle${shown ? ' show' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>

      {open ? (
        <nav className="nav__panel" aria-label="Pages">
          <button
            type="button"
            className="nav__close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <div className="nav__group">
            {PAGES.map(({ name, scene }) =>
              onCover ? (
                <button
                  key={name}
                  type="button"
                  className="nav__link"
                  style={colour()}
                  onClick={() => {
                    window.__go?.(scene);
                    setOpen(false);
                  }}
                >
                  <span className="nav__t">{name}</span>
                  <span className="nav__chev" aria-hidden>
                    ›
                  </span>
                </button>
              ) : (
                <Link
                  key={name}
                  href="/"
                  className="nav__link"
                  style={colour()}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav__t">{name}</span>
                  <span className="nav__chev" aria-hidden>
                    ›
                  </span>
                </Link>
              ),
            )}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
