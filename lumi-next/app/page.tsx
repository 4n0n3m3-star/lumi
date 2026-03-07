import ZoomParallaxSection from '@/components/zoom-parallax-section';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#1A0E06]">

      {/* ── SERVICES SECTION ─────────────────────── */}
      <section id="services" className="h-screen flex items-center justify-center">
        <p className="text-[#ECD9D0] text-sm tracking-widest uppercase">Services placeholder</p>
      </section>

      {/* ── ZOOM PARALLAX ────────────────────────── */}
      <ZoomParallaxSection />

      {/* ── ART SECTION ──────────────────────────── */}
      <section id="art" className="h-screen flex items-center justify-center">
        <p className="text-[#ECD9D0] text-sm tracking-widest uppercase">Art placeholder</p>
      </section>

    </main>
  );
}
