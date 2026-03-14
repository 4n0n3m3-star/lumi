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
  return <>{children}</>;
}
