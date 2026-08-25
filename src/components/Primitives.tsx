import type { ReactNode } from 'react';

/**
 * The wireframe vocabulary, as components. These are what keep the built site
 * reading like the locked skeleton: crossed boxes stand in for imagery, bars
 * stand in for copy that hasn't been written yet.
 */

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
