import type { Metadata, Viewport } from 'next';
import { Archivo, Bricolage_Grotesque, IBM_Plex_Mono } from 'next/font/google';
import { profile } from '@/data/profile';
import './globals.css';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

/**
 * Display face for the deck, which sets type at 50–68px. Bricolage carries a
 * real optical-size axis, so it is drawn for display rather than scaled up to
 * it, and the width axis lets a headline be tuned to the card.
 */
const bricolage = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bharatbharat.co'),
  title: {
    default: `${profile.name} · ${profile.role}, ${profile.location}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.pitch,
  openGraph: {
    type: 'website',
    siteName: profile.name,
    title: `${profile.name} · ${profile.role}, ${profile.location}`,
    description: profile.pitch,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} · ${profile.role}, ${profile.location}`,
    description: profile.pitch,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#edeff2' },
    { media: '(prefers-color-scheme: dark)', color: '#14161a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${bricolage.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
