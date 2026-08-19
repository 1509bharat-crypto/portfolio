'use client';

import Link from 'next/link';
import { cases } from '@/data/cases';

/**
 * The column that keeps every case study one click away while you're reading
 * one of them. Pass `onSelect` to drive the overlay on the home card; leave it
 * off and the same markup renders as real links for the /work/[slug] pages.
 */
export function CaseMap({
  activeSlug,
  onSelect,
  onBack,
}: {
  activeSlug?: string;
  onSelect?: (slug: string) => void;
  onBack?: () => void;
}) {
  const groups = [
    { label: 'Case studies', items: cases.filter((c) => c.rank !== 'other') },
    { label: 'Other case studies', items: cases.filter((c) => c.rank === 'other') },
  ];

  return (
    <aside className="map" aria-label="All case studies">
      {onBack ? (
        <button className="mapitem mapitem--back" onClick={onBack}>
          ⌗ Back to grid
        </button>
      ) : (
        <Link href="/" className="mapitem mapitem--back">
          ⌗ Back to grid
        </Link>
      )}

      {groups.map((group) => (
        <div key={group.label} className="contents">
          <div className="map__lab">{group.label}</div>
          {group.items.map((c) => {
            const label = `${c.number} · ${c.slot ? 'slot' : c.title}`;
            const current = c.slug === activeSlug;
            return onSelect ? (
              <button
                key={c.slug}
                className="mapitem"
                aria-current={current}
                onClick={() => onSelect(c.slug)}
              >
                {label}
              </button>
            ) : (
              <Link
                key={c.slug}
                href={`/work/${c.slug}`}
                className="mapitem"
                aria-current={current}
              >
                {label}
              </Link>
            );
          })}
        </div>
      ))}

      <div className="map__lab">Elsewhere</div>
      <Link href="/story" className="mapitem">
        The story
      </Link>
      <Link href="/lab" className="mapitem">
        Lab
      </Link>
    </aside>
  );
}
