import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LabView } from '@/components/LabView';
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

export default async function LabEntryPage({ params }: Props) {
  const { slug } = await params;
  if (!getEntry(slug)) notFound();

  return (
    <div className="dimpage">
      <LabView initialOpen={slug} />
    </div>
  );
}
