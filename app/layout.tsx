import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1A0E06",
};

export const metadata: Metadata = {
  title: "LUMI Atelier — Estúdio de Tattoo & Piercing em Venda do Pinheiro",
  description:
    "LUMI Atelier — estúdio de tattoo fineline e piercing em Venda do Pinheiro, Portugal. Apenas por marcação. Arte permanente criada com intenção.",
  openGraph: {
    type: "website",
    title: "LUMI Atelier — Tattoo & Piercing",
    description: "Estúdio de tattoo fineline e piercing em Venda do Pinheiro. Onde a luz encontra a pele.",
    url: "https://lumiatelierpt.com",
    images: [{ url: "https://lumiatelierpt.com/media/DSCF4917.jpg" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://lumiatelierpt.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tenor+Sans&family=Montserrat:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
