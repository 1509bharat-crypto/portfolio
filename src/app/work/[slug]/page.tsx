import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseDetail } from '@/components/CaseDetail';
import { Pager } from '@/components/Pager';
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
 * share; clicking through from the home card shows the same content as an
 * overlay instead, without a navigation.
 */
export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) notFound();

  const index = cases.findIndex((c) => c.slug === study.slug);
  const prev = index > 0 ? cases[index - 1] : null;
  const next = index < cases.length - 1 ? cases[index + 1] : null;

  return (
    <div className="shell">
      <div className="frame">
        <div className="frame__body">
          <div className="focusview">
            <div className="focus__main">
              <CaseDetail study={study} />
            </div>
            <Pager
              position={`${study.number} / ${String(cases.length).padStart(2, '0')}`}
              label={study.title}
              backHref="/"
              prevHref={prev ? `/work/${prev.slug}` : null}
              nextHref={next ? `/work/${next.slug}` : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
