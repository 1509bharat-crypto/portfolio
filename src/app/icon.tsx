import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** The ⌗ mark from the top bar, so the tab carries the same identity. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#13161b',
          color: '#ffffff',
          fontSize: 22,
          borderRadius: 7,
        }}
      >
        ⌗
      </div>
    ),
    size,
  );
}
