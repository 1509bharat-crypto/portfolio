import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CaseDetail } from '@/components/CaseDetail';
import { cases, getCase } from '@/data/cases';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.summary,
    // Slots aren't written yet, so keep them out of search results.
    robots: study.slot ? { index: false, follow: true } : undefined,
    openGraph: { title: study.title, description: study.summary },
  };
}

/**
 * The standalone case study page. Reached by a direct link, a refresh, or a
 * share; clicking through from the deck opens the same content as a
 * dimension overlay instead, without a navigation.
 */
export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) notFound();

  const index = cases.findIndex((c) => c.slug === study.slug);
  const next = index < cases.length - 1 ? cases[index + 1] : null;

  return (
    <div className="dimpage">
      <div className="dim__bar">
        <Link className="wbtn dim__back" href="/">
          ← Back
        </Link>
      </div>
      <div className="dim__scroll">
        <CaseDetail
          study={study}
          nextHref={next ? `/work/${next.slug}` : undefined}
          nextTitle={next?.title}
        />
      </div>
    </div>
  );
}
