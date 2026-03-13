'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [loaderTitleTranslate, setLoaderTitleTranslate] = useState({ x: 0, y: 0 });
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

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
        // After title has grown, measure hero position and translate loader title there
        setTimeout(() => {
          if (heroTitleRef.current) {
            const rect = heroTitleRef.current.getBoundingClientRect();
            setLoaderTitleTranslate({
              x: (rect.left + rect.width / 2) - window.innerWidth / 2,
              y: (rect.top + rect.height / 2) - window.innerHeight / 2,
            });
          }
        }, 1220);
        // Reveal hero title + fade loader after translate settles
        setTimeout(() => { setLoaderOut(true); setHeroTitleReady(true); }, 1980);
        // Reveal rest of hero
        setTimeout(() => {
          document.body.style.overflow = '';
          setLoaderDone(true);
          setHeroRevealed(true);
        }, 2880);
      }
    }, INTERVAL);

    return () => { clearInterval(timer); document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      {/* ─── LOADER ──────────────────────────────────── */}
      {!loaderDone && (
        <div id="loader" style={{ opacity: loaderOut ? 0 : 1, pointerEvents: loaderOut ? 'none' : undefined, transition: loaderOut ? 'opacity 0.9s ease' : undefined }}>
          <div id="loader-title" style={{
            fontSize: loaderTitleBig ? '12.5vw' : '5vw',
            letterSpacing: loaderTitleBig ? '0.04em' : '0.22em',
            transform: `translate(${loaderTitleTranslate.x}px, ${loaderTitleTranslate.y}px)`,
            transition: loaderTitleBig
              ? 'font-size 0.95s cubic-bezier(0.16,1,0.3,1), letter-spacing 0.95s cubic-bezier(0.16,1,0.3,1), transform 0.72s cubic-bezier(0.16,1,0.3,1) 0.98s'
              : undefined
          }}>LUMI ATELIER</div>
          <div id="loader-sub" className={loaderLabelsVisible ? '' : 'hidden'}>
            Venda do Pinheiro · Estúdio de Tattoo &amp; Piercing
          </div>
          <div id="loader-bar-wrap">
            <div id="loader-bar" style={{ width: `${loaderPct}%` }}></div>
          </div>
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
          <h1 ref={heroTitleRef} className={`hero-main-title${(heroRevealed || heroTitleReady) ? ' revealed' : ''}`}>LUMI ATELIER</h1>
        </div>
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
      </section>

      {/* ─── STUDIO ABOUT ─────────────────────────────── */}
      <section className="section" id="studio">
        <div className="studio-inner">
          <div className="studio-left fade-up">
            <p className="studio-eyebrow-label">O Atelier</p>
            <h2 className="studio-heading">
              Um santuário para<br/><em>arte permanente</em>
            </h2>
          </div>
          <div className="studio-right fade-up delay-1">
            <p className="studio-body">
              Criado com intenção, para durar uma vida. Um espaço onde cada peça é concebida à medida — traço a traço, com cuidado e propósito.
            </p>
            <div className="studio-meta">
              <div className="studio-meta-row">
                <span className="studio-meta-label">Fundado</span>
                <span className="studio-meta-value">2025 · Venda do Pinheiro, Portugal</span>
              </div>
              <div className="studio-meta-row">
                <span className="studio-meta-label">Especialidades</span>
                <span className="studio-meta-value">Fineline Tattoo · Piercing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────── */}
      <section id="services">
        <div className="services-header">
          <div className="services-header-left fade-up">
            <p className="services-section-label">Serviços</p>
            <h2 className="services-heading">Arte que<br/><em>ressoa</em></h2>
          </div>
          <div className="services-header-right fade-up delay-1">
            <p className="services-desc">
              Cada peça é concebida à medida — traço fino, detalhes delicados, arte que envelhece contigo. Apenas por marcação.
            </p>
            <a href="book.html" className="services-cta-link">Reservar sessão →</a>
          </div>
        </div>
        <div className="services-grid-numbered">
          <div className="service-item fade-up">
            <img src="/media/DSCF4917.jpg" alt="Tattoo Fineline" loading="eager" />
            <div className="service-item-overlay"></div>
            <div className="service-item-content">
              <span className="service-item-num">01</span>
              <h3 className="service-item-name">Tattoo</h3>
              <p className="service-item-sub">Fineline · Ilustração · Script</p>
              <a href="book.html?service=tattoo" className="service-item-arrow">Reservar →</a>
            </div>
          </div>
          <div className="service-item fade-up delay-1">
            <img src="/media/DSCF4915.jpg" alt="Piercing" loading="lazy" />
            <div className="service-item-overlay"></div>
            <div className="service-item-content">
              <span className="service-item-num">02</span>
              <h3 className="service-item-name">Piercing</h3>
              <p className="service-item-sub">Ouvido · Facial · Corpo</p>
              <a href="book.html?service=piercing" className="service-item-arrow">Reservar →</a>
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

      {/* ─── CONTACT CTA ──────────────────────────────── */}
      <section id="contact-cta">
        <p className="contact-cta-label fade-up">Contacto</p>
        <h2 className="contact-cta-heading fade-up delay-1">Marca o teu<br/><em>momento</em></h2>
        <div className="contact-cta-links fade-up delay-2">
          <a href="mailto:studio@lumiatelier.com" className="contact-cta-link">studio@lumiatelier.com</a>
          <a href="https://instagram.com/lumi.atelier_" className="contact-cta-link" target="_blank" rel="noopener noreferrer">@lumi.atelier_</a>
          <a href="book.html" className="contact-cta-link">Reservar →</a>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────── */}
      <div className="footer-marquee">
        <div className="footer-marquee-track">
          {['LUMI ATELIER', 'TATTOO', 'PIERCING', 'ARTE PERMANENTE', 'VENDA DO PINHEIRO', 'CRIADO COM INTENÇÃO'].concat(['LUMI ATELIER', 'TATTOO', 'PIERCING', 'ARTE PERMANENTE', 'VENDA DO PINHEIRO', 'CRIADO COM INTENÇÃO']).map((item, i) => (
            <span key={i} className="footer-marquee-item">{item} ·</span>
          ))}
        </div>
      </div>
      <footer>
        <div className="footer-grid">
          <div>
            <a href="#home" className="footer-brand-name">Lumi Atelier</a>
            <p className="footer-tagline">Arte permanente criada com intenção, para durar uma vida.</p>
          </div>
          <div>
            <p className="footer-col-label">Menu</p>
            <div className="footer-col-links">
              <a href="#services" className="footer-col-link">Serviços</a>
              <a href="#art" className="footer-col-link">Arte</a>
              <a href="book.html" className="footer-col-link">Reservar</a>
              <a href="artists.html" className="footer-col-link">Artistas</a>
            </div>
          </div>
          <div>
            <p className="footer-col-label">Seguir</p>
            <div className="footer-col-links">
              <a href="https://instagram.com/lumi.atelier_" className="footer-col-link" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
          <div>
            <p className="footer-col-label">Contacto</p>
            <div className="footer-col-links">
              <a href="mailto:studio@lumiatelier.com" className="footer-col-link">studio@lumiatelier.com</a>
              <span className="footer-col-link" style={{cursor:'default'}}>Venda do Pinheiro, Portugal</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2025 LUMI Atelier. Todos os direitos reservados.</p>
          <a href="https://stephanytattoo.com" className="footer-personal-link" target="_blank" rel="noopener noreferrer">Portfólio da Stephany →</a>
        </div>
      </footer>
    </>
  );
}
