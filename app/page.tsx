'use client';

import { useState, useEffect } from 'react';
import ZoomParallaxSection from '@/components/zoom-parallax-section';

const translations = {
  pt: {
    'nav-services': 'Serviços',
    'nav-artists': 'Artistas',
    'nav-art': 'Arte',
    'nav-book': 'Reservar',
    'nav-menu': 'Menu',
    'nav-close': 'Fechar',
    'hero-eyebrow': 'Venda do Pinheiro · Estúdio de Tattoo & Piercing',
    'hero-cta': 'Explorar os serviços',
    'hero-scroll': 'Rolar',
    'studio-eyebrow': 'O Atelier',
    'studio-statement': 'Um santuário para <em>arte permanente</em> — criado com intenção, para durar uma vida.',
    'studio-founded-label': 'Fundado',
    'studio-specs-label': 'Especialidades',
    'studio-specs-value': 'Fineline Tattoo · Piercing',
    'tattoo-label': 'Fineline · Ilustração · Script',
    'tattoo-title': 'Tattoo',
    'tattoo-desc': 'Arte permanente desenhada à medida — traço fino, detalhes delicados, peças que envelhecem contigo.',
    'tattoo-artist': 'Stephany Ribeiro — Artista Residente',
    'tattoo-cta': 'Reservar Sessão',
    'tattoo-link': 'Ver portfólio →',
    'piercing-label': 'Ouvido · Facial · Corpo',
    'piercing-title': 'Piercing',
    'piercing-desc': 'Piercing profissional por marcação. Jóias de qualidade, cuidado meticuloso, resultados que duram.',
    'piercing-artist': '[Nome da Artista] — Apenas por marcação',
    'piercing-cta': 'Reservar Sessão',
    'art-eyebrow': 'Coleção de Arte',
    'art-ed1-num': 'Edição Nº 001',
    'art-ed1-label': 'Primeiro Drop',
    'art-ed2-num': 'Edição Nº 002',
    'art-ed2-label': 'Reservado',
    'art-ed3-num': 'Edição Nº 003',
    'art-ed3-label': 'Reservado',
    'art-footer-title': 'Edições limitadas. Primeiro drop em breve.',
    'art-footer-sub': 'Peças de arte originais de Stephany Ribeiro — disponíveis em série numerada.',
    'art-notify-btn': 'Notifica-me',
    'art-confirm': 'Estás na lista. Entraremos em contacto.',
    'art-email-placeholder': 'O teu endereço de email',
    'footer-copy': '© 2025 LUMI Atelier. Todos os direitos reservados.',
    'footer-personal': 'Visitar o Portfólio da Stephany →',
  },
  en: {
    'nav-services': 'Services',
    'nav-artists': 'Artists',
    'nav-art': 'Art',
    'nav-book': 'Book',
    'nav-menu': 'Menu',
    'nav-close': 'Close',
    'hero-eyebrow': 'Venda do Pinheiro · Tattoo & Piercing Studio',
    'hero-cta': 'Explore our services',
    'hero-scroll': 'Scroll',
    'studio-eyebrow': 'The Atelier',
    'studio-statement': 'A sanctuary for <em>permanent art</em> — crafted with intention, worn for life.',
    'studio-founded-label': 'Founded',
    'studio-specs-label': 'Specialities',
    'studio-specs-value': 'Fineline Tattoo · Piercing',
    'tattoo-label': 'Fineline · Illustration · Script',
    'tattoo-title': 'Tattoo',
    'tattoo-desc': 'Permanent art drawn to order — fine lines, delicate details, pieces that age with you.',
    'tattoo-artist': 'Stephany Ribeiro — Resident Artist',
    'tattoo-cta': 'Book a Session',
    'tattoo-link': 'View portfolio →',
    'piercing-label': 'Ear · Facial · Body',
    'piercing-title': 'Piercing',
    'piercing-desc': 'Professional piercing by appointment. Quality jewelry, meticulous care, lasting results.',
    'piercing-artist': '[Artist Name] — By appointment only',
    'piercing-cta': 'Book a Session',
    'art-eyebrow': 'Art Collection',
    'art-ed1-num': 'Edition No. 001',
    'art-ed1-label': 'First Drop',
    'art-ed2-num': 'Edition No. 002',
    'art-ed2-label': 'Reserved',
    'art-ed3-num': 'Edition No. 003',
    'art-ed3-label': 'Reserved',
    'art-footer-title': 'Limited editions. First drop coming soon.',
    'art-footer-sub': 'Original art pieces by Stephany Ribeiro — available in numbered series.',
    'art-notify-btn': 'Notify me',
    'art-confirm': "You're on the list. We'll be in touch.",
    'art-email-placeholder': 'Your email address',
    'footer-copy': '© 2025 LUMI Atelier. All rights reserved.',
    'footer-personal': "Visit Stephany's Portfolio →",
  },
} as const;

type Lang = keyof typeof translations;

export default function Home() {
  const [lang, setLangState] = useState<Lang>('pt');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [artFormSent, setArtFormSent] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [loaderPct, setLoaderPct] = useState(0);

  const [loaderLabelsVisible, setLoaderLabelsVisible] = useState(true);
  const [loaderTitleBig, setLoaderTitleBig] = useState(false);
  const [loaderOut, setLoaderOut] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [heroTitleReady, setHeroTitleReady] = useState(false);

  const t = translations[lang];

  function setLang(l: Lang) { setLangState(l); }
  function closeMenu() { setMenuOpen(false); }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ─── LOADER ───────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const STEPS = 120;
    const INTERVAL = 28;
    let current = 0;
    function ease(t: number) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

    const timer = setInterval(() => {
      current++;
      const t = Math.min(current / STEPS, 1);
      const p = ease(t);
      setLoaderPct(Math.round(p * 100));
      if (t >= 1) {
        clearInterval(timer);
        // Fade labels + percent
        setLoaderLabelsVisible(false);
        // Grow title
        setTimeout(() => setLoaderTitleBig(true), 300);
        // Fade loader out + reveal hero title simultaneously
        setTimeout(() => { setLoaderOut(true); setHeroTitleReady(true); }, 1200);
        // Reveal rest of hero after fade completes
        setTimeout(() => {
          document.body.style.overflow = '';
          setLoaderDone(true);
          setHeroRevealed(true);
        }, 2100);
      }
    }, INTERVAL);

    return () => { clearInterval(timer); document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      {/* ─── LOADER ──────────────────────────────────── */}
      {!loaderDone && (
        <div id="loader" style={{ opacity: loaderOut ? 0 : 1, pointerEvents: loaderOut ? 'none' : undefined, transition: loaderOut ? 'opacity 0.9s ease' : undefined }}>
          <span id="loader-left" style={{ opacity: loaderLabelsVisible ? 1 : 0, transition: 'opacity 0.6s ease', transform: 'translateY(-50%)' }}>Loading</span>
          <div id="loader-title" style={{ fontSize: loaderTitleBig ? '12.5vw' : '4.5vw', letterSpacing: loaderTitleBig ? '0.04em' : '0.22em', transition: loaderTitleBig ? 'font-size 0.88s cubic-bezier(0.16,1,0.3,1), letter-spacing 0.88s cubic-bezier(0.16,1,0.3,1)' : undefined }}>LUMI ATELIER</div>
          <span id="loader-right" style={{ opacity: loaderLabelsVisible ? 1 : 0, transition: 'opacity 0.6s ease', transform: 'translateY(-50%)' }}>in progres</span>
          <div id="loader-percent" style={{ opacity: loaderLabelsVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}>({loaderPct}%)</div>
        </div>
      )}

      {/* ─── MOBILE MENU ─────────────────────────────── */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-top">
          <a href="#home" className="mobile-menu-brand" onClick={closeMenu}>Lumi Atelier</a>
          <button className="mobile-menu-close" onClick={closeMenu}>{t['nav-close']}</button>
        </div>
        <ul className="mobile-menu-links">
          <li><a href="#services" onClick={closeMenu}>{t['nav-services']}</a></li>
          <li><a href="#art" onClick={closeMenu}>{t['nav-art']}</a></li>
          <li><a href="book.html" style={{ color: 'var(--warm-brown)' }}>{t['nav-book']}</a></li>
          <li><a href="artists.html" onClick={closeMenu}>{t['nav-artists']}</a></li>
        </ul>
        <div className="mobile-menu-bottom">
          <div className="mobile-menu-bottom-col">
            <a href="https://instagram.com/lumi.atelier_" target="_blank" rel="noopener noreferrer">@lumi.atelier_</a>
          </div>
          <div className="mobile-menu-bottom-col">
            <a href="mailto:studio@lumiatelier.com">studio@lumiatelier.com</a>
          </div>
          <div className="mobile-menu-bottom-col">
            <div className="lang-toggle lang-toggle--mobile">
              <button className={`lang-btn${lang === 'pt' ? ' active' : ''}`} onClick={() => setLang('pt')}>PT</button>
              <span className="lang-sep">|</span>
              <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── NAV ─────────────────────────────────────── */}
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-left">
          <ul className="nav-links">
            <li><a href="#services">{t['nav-services']}</a></li>
            <li><a href="#art">{t['nav-art']}</a></li>
          </ul>
        </div>
        <a href="#home" className="nav-center-icon">
          <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 2 Q57 43 98 50 Q57 57 50 98 Q43 57 2 50 Q43 43 50 2 Z" />
          </svg>
        </a>
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="book.html" style={{ color: 'var(--warm-brown)' }}>{t['nav-book']}</a></li>
            <li><a href="artists.html">{t['nav-artists']}</a></li>
          </ul>
          <button className="nav-menu-btn" aria-label="Menu" onClick={() => setMenuOpen(true)}>{t['nav-menu']}</button>
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="hero" id="home">
        <div className="hero-title-section">
          <h1 className={`hero-main-title${(heroRevealed || heroTitleReady) ? ' revealed' : ''}`}>LUMI ATELIER</h1>
        </div>
        <div className="hero-divider"></div>
        <div className="hero-bottom">
          <div className={`hero-bottom-left${heroRevealed ? ' revealed' : ''}`}>
            <span className="hero-left-line">Creative Studio</span>
            <span className="hero-left-line">Arte Permanente</span>
            <span className="hero-left-line italic">Criado com intenção.</span>
          </div>
          <div className={`hero-bottom-images${heroRevealed ? ' revealed' : ''}`}>
            <div className="hero-bottom-image">
              <img src="/media/DSCF4917.jpg" alt="Lumi Atelier" loading="eager" />
            </div>
            <div className="hero-bottom-image">
              <img src="/media/DSCF4915.jpg" alt="Lumi Atelier" loading="eager" />
            </div>
          </div>
          <div className={`hero-bottom-right${heroRevealed ? ' revealed' : ''}`}>
            <p className="hero-right-desc">
              Minimalista. Intencional. Eterna.<br/>
              exclusivamente à sua medida.<br/>
              Apenas por marcação.
            </p>
            <a href="book.html" className="hero-cta">{t['hero-cta']}</a>
          </div>
        </div>
        <div className="hero-scroll">
          <span className="hero-scroll-label">{t['hero-scroll']}</span>
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      {/* ─── STUDIO ABOUT ─────────────────────────────── */}
      <section className="section" id="studio">
        <div className="studio-inner">
          <p className="section-eyebrow fade-up">{t['studio-eyebrow']}</p>
          <h2
            className="studio-statement fade-up delay-1"
            dangerouslySetInnerHTML={{ __html: t['studio-statement'] }}
          />
          <div className="studio-details fade-up delay-2">
            <div className="studio-detail-item">
              <span className="studio-detail-label">{t['studio-founded-label']}</span>
              <span className="studio-detail-value">
                2025 ·{' '}
                <a
                  href="https://maps.app.goo.gl/c2zDP3NneLvdbeLX7"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'var(--rose-taupe)' }}
                >
                  Venda do Pinheiro, Portugal
                </a>
              </span>
            </div>
            <div className="studio-detail-item">
              <span className="studio-detail-label">{t['studio-specs-label']}</span>
              <span className="studio-detail-value">{t['studio-specs-value']}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────── */}
      <section id="services">
        <div className="services-grid">
          {/* Card 1: Tattoo */}
          <div className="service-card fade-up">
            <img
              src="/media/DSCF4917.jpg"
              alt="Estúdio de Tattoo"
              style={{ objectPosition: 'center 20%' }}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <p className="service-card-label">{t['tattoo-label']}</p>
              <h2 className="service-card-title">{t['tattoo-title']}</h2>
              <p className="service-card-desc">{t['tattoo-desc']}</p>
              <p className="service-card-artist">{t['tattoo-artist']}</p>
              <div className="service-card-actions">
                <a href="book.html?service=tattoo" className="service-card-cta">{t['tattoo-cta']}</a>
                <a href="https://stephanytattoo.com" className="service-card-link" target="_blank" rel="noopener noreferrer">{t['tattoo-link']}</a>
              </div>
            </div>
          </div>

          {/* Card 2: Piercing */}
          <div className="service-card fade-up delay-1">
            <img
              src="/media/DSCF4915.jpg"
              alt="Estúdio de Piercing"
              style={{ objectPosition: 'center 25%' }}
              loading="lazy"
              decoding="async"
            />
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <p className="service-card-label">{t['piercing-label']}</p>
              <h2 className="service-card-title">{t['piercing-title']}</h2>
              <p className="service-card-desc">{t['piercing-desc']}</p>
              <p className="service-card-artist">{t['piercing-artist']}</p>
              <div className="service-card-actions">
                <a href="book.html?service=piercing" className="service-card-cta">{t['piercing-cta']}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ZOOM PARALLAX ────────────────────────────── */}
      <ZoomParallaxSection />

      {/* ─── ART COLLECTION ───────────────────────────── */}
      <section className="section" id="art">
        <p className="section-eyebrow fade-up">{t['art-eyebrow']}</p>
        <div className="art-grid">
          <div className="art-slot fade-up delay-1">
            <img src="https://placehold.co/600x800/B09080/ECD9D0?text=+" alt="Art piece 1" loading="lazy" decoding="async" width={600} height={800} />
            <div className="art-glass">
              <span className="art-glass-num">{t['art-ed1-num']}</span>
              <div className="art-glass-dot"></div>
              <span className="art-glass-label">{t['art-ed1-label']}</span>
            </div>
          </div>
          <div className="art-slot fade-up delay-2">
            <img src="https://placehold.co/600x800/8C6248/D0B8AC?text=+" alt="Art piece 2" loading="lazy" decoding="async" width={600} height={800} />
            <div className="art-glass">
              <span className="art-glass-num">{t['art-ed2-num']}</span>
              <div className="art-glass-dot"></div>
              <span className="art-glass-label">{t['art-ed2-label']}</span>
            </div>
          </div>
          <div className="art-slot fade-up delay-3">
            <img src="https://placehold.co/600x800/A77049/ECD9D0?text=+" alt="Art piece 3" loading="lazy" decoding="async" width={600} height={800} />
            <div className="art-glass">
              <span className="art-glass-num">{t['art-ed3-num']}</span>
              <div className="art-glass-dot"></div>
              <span className="art-glass-label">{t['art-ed3-label']}</span>
            </div>
          </div>
        </div>
        <div className="art-footer">
          <h3 className="art-footer-title fade-up">{t['art-footer-title']}</h3>
          <p className="art-footer-sub fade-up delay-1">{t['art-footer-sub']}</p>
          {!artFormSent ? (
            <form
              className="art-subscribe fade-up delay-2"
              onSubmit={(e) => { e.preventDefault(); setArtFormSent(true); }}
            >
              <input type="email" placeholder={t['art-email-placeholder']} required aria-label="Email" />
              <button type="submit">{t['art-notify-btn']}</button>
            </form>
          ) : (
            <p className="art-subscribe-confirm">{t['art-confirm']}</p>
          )}
        </div>
      </section>

      {/* ─── CONTACT ──────────────────────────────────── */}
      <section id="contact">
        <div className="contact-links">
          <a href="mailto:studio@lumiatelier.com" className="contact-link fade-up">studio@lumiatelier.com</a>
          <a href="https://instagram.com/lumi.atelier_" className="contact-link fade-up delay-1" target="_blank" rel="noopener noreferrer">@lumi.atelier_</a>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────── */}
      <footer>
        <a href="#home" className="footer-logo">Lumi Atelier</a>
        <div className="footer-rule"></div>
        <p className="footer-copy">{t['footer-copy']}</p>
        <a href="https://stephanytattoo.com" className="footer-personal" target="_blank" rel="noopener noreferrer">{t['footer-personal']}</a>
      </footer>
    </>
  );
}
