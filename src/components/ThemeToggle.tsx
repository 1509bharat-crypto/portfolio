'use client';

import { useSyncExternalStore } from 'react';
import DarkMode from '@material-symbols/svg-600/rounded/dark_mode.svg';
import LightMode from '@material-symbols/svg-600/rounded/light_mode.svg';

/**
 * Day or night, top right.
 *
 * The choice is written to `data-theme` on <html> and kept in localStorage.
 * `prefers-color-scheme` is deliberately not consulted: the site is light by
 * default because the painting behind it is a daytime one, and night is
 * something you ask for.
 *
 * The same key is read by an inline script in the document head, which runs
 * before first paint — see `themeScript` in layout.tsx. Without it a visitor
 * who chose night would get a frame of daylight on every navigation.
 */
export const THEME_KEY = 'theme';

/**
 * `data-theme` on <html> is the single source of truth, rather than a piece of
 * React state mirroring it. The inline script sets that attribute before React
 * exists, so any state would start out disagreeing with the page; subscribing
 * to the attribute instead means there is only ever one answer.
 */
const subscribe = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => mo.disconnect();
};
const isDark = () => document.documentElement.dataset.theme === 'dark';
/** The server cannot know, and light is the default. */
const isDarkOnServer = () => false;

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, isDarkOnServer);

  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;
    if (next) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      // Private mode, or storage refused. The toggle still works for this
      // page; it just will not be remembered.
    }
  };

  return (
    <button
      className="ctlbtn"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to day' : 'Switch to night'}
      title={dark ? 'Switch to day' : 'Switch to night'}
    >
      {/* Shows where the toggle goes, not where it is — the icon is the
          destination, which is the convention people already read. */}
      {dark ? (
        <LightMode className="icon" aria-hidden focusable="false" />
      ) : (
        <DarkMode className="icon" aria-hidden focusable="false" />
      )}
    </button>
  );
}
