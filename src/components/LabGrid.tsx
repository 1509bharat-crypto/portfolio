'use client';

import Link from 'next/link';
import { lab, labSlots } from '@/data/lab';
import { Label, Placeholder } from './Primitives';

/**
 * The lab is a full grid of experiment boxes. Clicking a box opens that
 * experiment's log as its own full view (the same deck pattern the case
 * studies use), so the grid itself stays calm.
 *
 * Pass `onOpen` to drive the overlay on the home card; leave it off and the
 * boxes render as real links for the standalone /lab page.
 */
export function LabGrid({ onOpen }: { onOpen?: (slug: string) => void }) {
  return (
    <div className="labgrid">
      {lab.map((entry) => {
        const inner = (
          <>
            <span className="cellhead">
              <Label>{entry.category}</Label>
              <span className="csnum" aria-hidden>
                →
              </span>
            </span>
            <Placeholder />
            <span className="headline">{entry.question}</span>
          </>
        );

        return onOpen ? (
          <button
            key={entry.slug}
            className="labbox labbox--x"
            onClick={() => onOpen(entry.slug)}
          >
            {inner}
          </button>
        ) : (
          <Link
            key={entry.slug}
            href={`/lab/${entry.slug}`}
            className="labbox labbox--x"
          >
            {inner}
          </Link>
        );
      })}

      {labSlots.map((copy, i) => (
        <div className="labbox labbox--slot" key={i}>
          <Label>Slot</Label>
          <Placeholder />
          <p className="storyline">{copy}</p>
        </div>
      ))}
    </div>
  );
}
