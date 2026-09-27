import type { Metadata, Viewport } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import '@/pixel/pixel.css';
import './nav.css';
import { PixelNav } from '@/components/PixelNav';

/**
 * Root layout for the pixel site — the whole of `/`.
 *
 * It is a root layout of its own, beside `(deck)`'s, so the two designs never
 * share a document: no Tailwind, no deck stylesheet, and moving between them
 * is a full page load. That isolation is what lets the pixel page's CSS and
 * scripts run exactly as they do in the source file.
 *
 * The head reproduces the source file's: its inline SVG favicon and the same
 * Google Fonts request for Archivo 400/500. Neither is replaced with Next's
 * own font or icon handling on purpose — this page is meant to be the source
 * file, served by Next, and not an interpretation of it.
 */

const head = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/pixel/head.json'), 'utf8'),
) as { favicon: string; fontHref: string };

/**
 * The favicon href, lifted out of the source's <link> tag. The value is an
 * inline SVG data URI containing quotes of its own, so the match runs to the
 * last quote on the tag rather than the first.
 */
const faviconHref = head.favicon.match(/href="([\s\S]+)"/)![1];

export const metadata: Metadata = {
  // The source file's <title>, exactly.
  title: 'Bharat',
  // Without this, Next resolves the opengraph-image at src/app/ against
  // localhost and warns on every build. The deck's root layout sets the same
  // origin; each root layout needs its own.
  metadataBase: new URL('https://bharatbharat.co'),
};

/** Matches the source's `viewport-fit=cover`, which Next's default omits. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function PixelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href={faviconHref} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* The source loads Archivo from Google Fonts rather than next/font,
            and so does this: the page is meant to be the source file served by
            Next, not an interpretation of it. The URL comes from head.json so
            that changing it in the source file carries over.

            `@next/next/no-page-custom-font` would normally object here. It
            reads the href statically, so it no longer fires now the value is a
            variable — the reasoning above is why it would be wrong anyway. */}
        <link href={head.fontHref} rel="stylesheet" />
      </head>
      <body>
        {children}
        {/* A sibling of the vendored page, never inside it. */}
        <PixelNav />
      </body>
    </html>
  );
}
