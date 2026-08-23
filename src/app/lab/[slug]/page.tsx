import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LabEntryDetail } from '@/components/LabEntryDetail';
import { Pager } from '@/components/Pager';
import { lab } from '@/data/lab';

type Props = { params: Promise<{ slug: string }> };

const getEntry = (slug: string) => lab.find((e) => e.slug === slug);
const pad = (n: number) => String(n).padStart(2, '0');

export function generateStaticParams() {
  return lab.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.title} · Lab`,
    description: entry.blurb,
    openGraph: { title: entry.title, description: entry.blurb },
  };
}

/** The log behind one experiment. Reached by clicking a box in the lab. */
export default async function LabEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const index = lab.findIndex((e) => e.slug === entry.slug);
  const prev = index > 0 ? lab[index - 1] : null;
  const next = index < lab.length - 1 ? lab[index + 1] : null;

  return (
    <div className="shell">
      <div className="frame">
        <div className="frame__body">
          <div className="focusview">
            <div className="focus__main">
              <LabEntryDetail entry={entry} />
            </div>
            <Pager
              position={`${pad(index + 1)} / ${pad(lab.length)}`}
              label={entry.title}
              backHref="/lab"
              backLabel="⌗ Back to the lab"
              prevHref={prev ? `/lab/${prev.slug}` : null}
              nextHref={next ? `/lab/${next.slug}` : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
