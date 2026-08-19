import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { BarLines, Placeholder } from '@/components/Primitives';
import { lab } from '@/data/lab';

type Props = { params: Promise<{ slug: string }> };

const getEntry = (slug: string) => lab.find((e) => e.slug === slug);

export function generateStaticParams() {
  return lab.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.title} — Lab`,
    description: entry.blurb,
    openGraph: { title: entry.title, description: entry.blurb },
  };
}

/** The log behind one experiment. Reached from "Read the log →" in the lab. */
export default async function LabEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  return (
    <div className="shell">
      <TopBar />
      <div className="frame">
        <div className="frame__body">
          <div className="focusview">
            <div className="focus__main">
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
            </div>

            <aside className="map" aria-label="All experiments">
              <Link href="/lab" className="mapitem mapitem--back">
                ⌗ Back to the lab
              </Link>
              <div className="map__lab">Experiments</div>
              {lab.map((e) => (
                <Link
                  key={e.slug}
                  href={`/lab/${e.slug}`}
                  className="mapitem"
                  aria-current={e.slug === entry.slug}
                >
                  {e.title}
                </Link>
              ))}
              <div className="map__lab">Elsewhere</div>
              <Link href="/" className="mapitem">
                The bento card
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
