import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LabEntryDetail } from '@/components/LabEntryDetail';
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
  const next = index < lab.length - 1 ? lab[index + 1] : null;

  return (
    <div className="dimpage">
      <div className="dim__bar">
        <Link className="wbtn dim__back" href="/lab">
          ← Lab
        </Link>
      </div>
      <div className="dim__scroll">
        <LabEntryDetail
          entry={entry}
          nextHref={next ? `/lab/${next.slug}` : undefined}
          nextTitle={next?.title}
        />
      </div>
    </div>
  );
}
