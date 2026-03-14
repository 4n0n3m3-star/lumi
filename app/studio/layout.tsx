import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#1A0E06',
};

export const metadata: Metadata = {
  title: 'LUMI Studio',
  robots: 'noindex, nofollow',
  manifest: '/manifest.json',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500&family=Tenor+Sans&display=swap" rel="stylesheet" />
      {children}
    </>
  );
}
