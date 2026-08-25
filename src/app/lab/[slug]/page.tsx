import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LabGrid } from '@/components/LabGrid';
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
    description: entry.question,
    openGraph: { title: entry.title, description: entry.question },
  };
}

/**
 * The same lab page, rendered with one box already expanded. A log is not a
 * separate destination — it lives inside the grid — so a direct link opens the
 * grid with that experiment open rather than a standalone page.
 */
export default async function LabEntryPage({ params }: Props) {
  const { slug } = await params;
  if (!getEntry(slug)) notFound();

  return (
    <div className="dimpage">
      <div className="dim__bar">
        <Link className="wbtn dim__back" href="/">
          ← Back
        </Link>
      </div>
      <div className="dim__scroll">
        <div className="dimbody">
          <header className="dim__hero dim__hero--short">
            <span className="lab">Lab · open questions</span>
            <h1 className="dim__title">Experiments</h1>
          </header>
          <LabGrid initialOpen={slug} />
        </div>
      </div>
    </div>
  );
}
