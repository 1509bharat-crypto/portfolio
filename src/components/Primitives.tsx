import type { ReactNode } from 'react';
import ArrowBack from '@material-symbols/svg-600/rounded/arrow_back.svg';
import ArrowForward from '@material-symbols/svg-600/rounded/arrow_forward.svg';

/**
 * The wireframe vocabulary, as components. These are what keep the built site
 * reading like the locked skeleton: crossed boxes stand in for imagery, bars
 * stand in for copy that hasn't been written yet.
 */

/**
 * The two directional icons, Material Symbols Rounded at weight 600.
 *
 * The weight is why the package is `@material-symbols/svg-600` and not the
 * classic `@material-design-icons/svg`: the classic set has a rounded style
 * but no weight axis, so it only ships the equivalent of 400. This family
 * pre-renders Symbols per axis, which keeps the icons as static files with no
 * icon font to load.
 *
 * Both are `aria-hidden`: every place they appear, the button or link already
 * carries an `aria-label` or visible text, so announcing the arrow as well
 * would just be noise. They size to 1em and inherit `currentColor`, which is
 * what the `←` and `→` characters they replaced did for free.
 */
export function IconBack() {
  return <ArrowBack className="icon" aria-hidden focusable="false" />;
}

export function IconForward() {
  return <ArrowForward className="icon" aria-hidden focusable="false" />;
}

export function Placeholder({ className = '' }: { className?: string }) {
  return <div className={`ph ${className}`} aria-hidden />;
}

/** Two bars, the wireframe's shorthand for a paragraph. */
export function BarLines({ widths = [90, 60] }: { widths?: number[] }) {
  return (
    <div className="flex flex-col gap-1.5" aria-hidden>
      {widths.map((w) => (
        <div key={w} className="bar" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="lab">{children}</span>;
}

export function CellHead({
  label,
  number,
}: {
  label: string;
  number?: string;
}) {
  return (
    <div className="cellhead">
      <Label>{label}</Label>
      {number ? <span className="csnum">{number}</span> : null}
    </div>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <div className="chips">
      {items.map((c) => (
        <span key={c} className="chip">
          {c}
        </span>
      ))}
    </div>
  );
}
