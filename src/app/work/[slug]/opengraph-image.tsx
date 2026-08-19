import { ImageResponse } from 'next/og';
import { cases, getCase } from '@/data/cases';
import { profile } from '@/data/profile';

export const alt = 'Case study';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

/** Next 16 passes these props as Promises. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCase(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#e8eaee',
          padding: 48,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff',
            border: '1px solid #d6dae1',
            borderRadius: 28,
            padding: '52px 56px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20 }}>
            <div style={{ letterSpacing: 4, color: '#5b626d', textTransform: 'uppercase' }}>
              {study ? study.kicker : 'Case study'}
            </div>
            <div style={{ color: '#6b7280' }}>{study?.number}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                fontSize: 76,
                lineHeight: 1.1,
                letterSpacing: -2.4,
                color: '#13161b',
              }}
            >
              {study?.title ?? 'Case study'}
            </div>
            <div style={{ fontSize: 28, color: '#5b626d', maxWidth: 880, lineHeight: 1.35 }}>
              {study?.tagline ?? ''}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
            <div style={{ color: '#13161b' }}>{profile.name}</div>
            <div style={{ color: '#5b626d' }}>bharatbharat.co</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
