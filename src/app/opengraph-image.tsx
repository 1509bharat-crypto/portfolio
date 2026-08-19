import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

export const alt = `${profile.name} — ${profile.role}, ${profile.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The share card carries the same wireframe language as the site: paper
 * ground, one hairline card, mono label, display pitch.
 */
export default function Image() {
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
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              color: '#5b626d',
              textTransform: 'uppercase',
            }}
          >
            The pitch / story
          </div>

          <div
            style={{
              fontSize: 76,
              lineHeight: 1.12,
              letterSpacing: -2.4,
              color: '#13161b',
              maxWidth: 900,
            }}
          >
            {profile.pitch}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
            <div style={{ color: '#13161b' }}>{profile.name}</div>
            {/* One interpolation, not three: Satori counts each JSX text
                fragment as a child and requires display:flex past one. */}
            <div style={{ color: '#5b626d' }}>{`${profile.role}, ${profile.location}`}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
