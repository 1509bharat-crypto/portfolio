import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseDetail } from '@/components/CaseDetail';
import { CaseMap } from '@/components/CaseMap';
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
    // Slots aren't written yet — keep them out of search results.
    robots: study.slot ? { index: false, follow: true } : undefined,
    openGraph: { title: study.title, description: study.summary },
  };
}

/**
 * The standalone case study page. Reached by a direct link, a refresh, or a
 * share; clicking through from the home card shows the same content as an
 * overlay instead, without a navigation.
 */
export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) notFound();

  return (
    <div className="shell">
      <div className="frame">
        <div className="frame__body">
          <div className="focusview">
            <div className="focus__main">
              <CaseDetail study={study} />
            </div>
            <CaseMap activeSlug={study.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
