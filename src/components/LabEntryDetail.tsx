import type { LabEntry } from '@/lib/types';
import { BarLines, Placeholder } from './Primitives';

/**
 * The body of one lab log. Shared by the overlay on the home card and the
 * standalone /lab/[slug] page, the same dual rendering the case studies use.
 */
export function LabEntryDetail({ entry }: { entry: LabEntry }) {
  return (
    <>
      <span className="lab">Lab · {entry.category}</span>
      <h1>{entry.title}</h1>
      <p className="lisa-sub">{entry.blurb}</p>

      <div className="meta">
        <span className="chip">Status: {entry.status}</span>
        {entry.detail ? <span>{entry.detail}</span> : null}
      </div>

      <div className="dgrid">
        <div className="dblock">
          <b>The open question</b>
          <BarLines />
        </div>
        <div className="dblock">
          <b>What exists so far</b>
          <BarLines />
        </div>
      </div>

      <Placeholder className="min-h-[110px] flex-1" />
    </>
  );
}
