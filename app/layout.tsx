import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
    url: "https://lumiatelier.pt",
    images: [{ url: "https://lumiatelier.pt/media/DSCF4917.jpg" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    canonical: "https://lumiatelier.pt",
    languages: { pt: "https://lumiatelier.pt", en: "https://lumiatelier.pt" },
  },
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
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TattooParlor",
              name: "LUMI Atelier",
              description: "Estúdio de tattoo fineline e piercing em Venda do Pinheiro, Portugal.",
              url: "https://lumiatelier.pt",
              logo: "https://lumiatelier.pt/favicon.ico",
              image: "https://lumiatelier.pt/media/DSCF4917.jpg",
              telephone: "+351932558951",
              email: "studio@lumiatelier.pt",
              address: { "@type": "PostalAddress", addressLocality: "Venda do Pinheiro", addressCountry: "PT" },
              geo: { "@type": "GeoCoordinates", latitude: 38.8695, longitude: -9.2395 },
              sameAs: ["https://www.instagram.com/lumi.atelier_/", "https://www.instagram.com/stephany.tattoo/"],
              priceRange: "$$",
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "10:00",
                closes: "19:00",
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        {/* Google Ads tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17997598675"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-17997598675');`}
        </Script>
      </body>
    </html>
  );
}
