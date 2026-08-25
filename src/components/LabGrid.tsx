'use client';

import { lab, labSlots } from '@/data/lab';
import { Label, Placeholder } from './Primitives';

/**
 * The lab is a full grid of experiment boxes. Clicking a box opens that
 * experiment's log as its own full view (the same deck pattern the case
 * studies use), so the grid itself stays calm.
 *
 * `onOpen` receives the box's rect so the log can grow out of it. Both the
 * deck's lab dimension and the standalone /lab page pass one — the boxes used
 * to be links on the standalone page, which swapped the whole route instead of
 * opening in place.
 */
export function LabGrid({
  onOpen,
}: {
  onOpen: (slug: string, origin: DOMRect) => void;
}) {
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

        return (
          <button
            key={entry.slug}
            className="labbox labbox--x"
            aria-label={`Open lab log: ${entry.title}`}
            onClick={(e) =>
              onOpen(entry.slug, e.currentTarget.getBoundingClientRect())
            }
          >
            {inner}
          </button>
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
