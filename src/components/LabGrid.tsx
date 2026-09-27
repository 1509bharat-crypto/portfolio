'use client';

import { lab, labSlots } from '@/data/lab';
import { IconForward, Label, Placeholder } from './Primitives';

/** The grid of experiments. Clicking one opens its log in the lab page. */
export function LabGrid({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <div className="labgrid">
      {lab.map((entry) => (
        <button
          key={entry.slug}
          className="labbox labbox--x"
          aria-label={`Open lab log: ${entry.title}`}
          onClick={() => onOpen(entry.slug)}
        >
          <span className="cellhead">
            <Label>{entry.category}</Label>
            <span className="csnum" aria-hidden>
              <IconForward />
            </span>
          </span>
          <Placeholder />
          <span className="headline">{entry.question}</span>
        </button>
      ))}

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
