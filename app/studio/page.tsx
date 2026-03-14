'use client';

import { useState, useEffect, useCallback } from 'react';

/* ── Types ────────────────────────────────────────────── */

interface Booking {
  id: string;
  service: 'tattoo' | 'piercing';
  date: string;
  artist: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  lang: string;
  idea?: string;
  zone?: string;
  size?: string;
  first_tattoo?: string;
  schedule?: string;
  health?: string;
  notes?: string;
  references?: string;
  piercing_type?: string;
  piercing_location?: string;
  first_piercing?: string;
  jewelry_material?: string;
  session_date?: string;
  session_duration?: string;
  booking_uid?: string;
  sessao_sent?: string;
  lembrete_sent?: string;
  aftercare_sent?: string;
}

interface FollowUpType {
  key: string;
  label: string;
  icon: string;
  fields?: string[];
}

const FOLLOWUP_TYPES: FollowUpType[] = [
  { key: 'Orçamento', label: 'Orçamento', icon: '💰', fields: ['budget'] },
  { key: 'Mais Detalhes', label: 'Mais Detalhes', icon: '📝' },
  { key: 'Recusado', label: 'Recusar', icon: '✕', fields: ['reason'] },
  { key: 'deposito', label: 'Depósito', icon: '🏦', fields: ['budget'] },
  { key: 'deposito_confirmado', label: 'Depósito OK', icon: '✓', fields: ['eta'] },
  { key: 'esboço', label: 'Esboço', icon: '✏️', fields: ['sketch_url', 'duration'] },
];

const SESSION_DURATIONS = [
  { value: '1 hora', label: '1 hora' },
  { value: '1.5 horas', label: '1.5 horas' },
  { value: '2 horas', label: '2 horas' },
  { value: '3 horas', label: '3 horas' },
  { value: '4 horas', label: '4 horas' },
  { value: '5 horas', label: '5 horas' },
  { value: '6 horas', label: '6 horas' },
];

const REJECTION_REASONS = [
  { value: 'Fora do meu estilo', label: 'Fora do meu estilo' },
  { value: 'Não consigo fazer cover', label: 'Não consigo fazer cover' },
  { value: 'Agenda cheia', label: 'Agenda cheia' },
];

/* ── Styles ───────────────────────────────────────────── */

const styles = {
  app: {
    minHeight: '100vh',
    background: '#FAF7F1',
    fontFamily: "'Montserrat', sans-serif",
    color: '#3F2F24',
  } as React.CSSProperties,

  // Login
  loginWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: '#1A0E06',
  } as React.CSSProperties,
  loginCard: {
    width: '100%',
    maxWidth: '360px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  loginTitle: {
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: '0.28em',
    textTransform: 'uppercase' as const,
    color: '#ECD9D0',
    marginBottom: '8px',
  } as React.CSSProperties,
  loginSub: {
    fontSize: '9px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    color: '#B09080',
    marginBottom: '48px',
  } as React.CSSProperties,
  loginInput: {
    width: '100%',
    padding: '14px 20px',
    background: 'transparent',
    border: '1px solid rgba(236,217,208,0.2)',
    borderRadius: '0',
    color: '#ECD9D0',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '14px',
    letterSpacing: '0.08em',
    outline: 'none',
    marginBottom: '16px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  loginBtn: {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    border: '1px solid #A77049',
    color: '#A77049',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '10px',
    fontWeight: 400,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
  } as React.CSSProperties,
  loginError: {
    color: '#c97a5a',
    fontSize: '12px',
    marginTop: '16px',
  } as React.CSSProperties,

  // Header
  header: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    background: '#1A0E06',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  headerTitle: {
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.28em',
    textTransform: 'uppercase' as const,
    color: '#ECD9D0',
  } as React.CSSProperties,
  headerBtn: {
    background: 'none',
    border: 'none',
    color: '#B09080',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '9px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    padding: '8px 0',
  } as React.CSSProperties,

  // Content
  content: {
    padding: '20px 16px 100px',
    maxWidth: '600px',
    margin: '0 auto',
  } as React.CSSProperties,

  // Filters
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    overflowX: 'auto' as const,
  } as React.CSSProperties,
  filterPill: (active: boolean) => ({
    padding: '8px 16px',
    border: `1px solid ${active ? '#3F2F24' : '#D0B8AC'}`,
    borderRadius: '999px',
    background: active ? '#3F2F24' : 'transparent',
    color: active ? '#FAF7F1' : '#806A58',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '10px',
    fontWeight: 400,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  } as React.CSSProperties),

  // Cards
  card: {
    background: '#FDFAF7',
    border: '1px solid rgba(208,184,172,0.3)',
    padding: '20px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  } as React.CSSProperties,
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  } as React.CSSProperties,
  cardName: {
    fontSize: '15px',
    fontWeight: 400,
    color: '#2C1A0E',
    lineHeight: 1.3,
  } as React.CSSProperties,
  cardBadge: (service: string) => ({
    fontSize: '8px',
    fontWeight: 500,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    padding: '4px 10px',
    borderRadius: '999px',
    background: service === 'tattoo' ? 'rgba(167,112,73,0.1)' : 'rgba(128,106,88,0.1)',
    color: service === 'tattoo' ? '#A77049' : '#806A58',
    flexShrink: 0,
  } as React.CSSProperties),
  cardMeta: {
    fontSize: '11px',
    color: '#B09080',
    lineHeight: 1.6,
  } as React.CSSProperties,
  cardIdea: {
    fontSize: '12px',
    color: '#806A58',
    fontWeight: 300,
    lineHeight: 1.6,
    marginTop: '8px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  } as React.CSSProperties,

  // Detail panel
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(26,14,6,0.5)',
    zIndex: 90,
  } as React.CSSProperties,
  panel: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90vh',
    background: '#FDFAF7',
    zIndex: 100,
    overflowY: 'auto' as const,
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 -4px 32px rgba(26,14,6,0.15)',
  } as React.CSSProperties,
  panelHandle: {
    width: '40px',
    height: '4px',
    background: '#D0B8AC',
    borderRadius: '2px',
    margin: '12px auto 0',
  } as React.CSSProperties,
  panelContent: {
    padding: '24px 24px 40px',
  } as React.CSSProperties,
  panelName: {
    fontSize: '22px',
    fontWeight: 300,
    color: '#2C1A0E',
    marginBottom: '4px',
  } as React.CSSProperties,
  panelSection: {
    marginBottom: '24px',
  } as React.CSSProperties,
  panelLabel: {
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '0.3em',
    textTransform: 'uppercase' as const,
    color: '#B09080',
    marginBottom: '6px',
  } as React.CSSProperties,
  panelValue: {
    fontSize: '13px',
    color: '#3F2F24',
    lineHeight: 1.7,
    fontWeight: 300,
  } as React.CSSProperties,
  panelGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  } as React.CSSProperties,

  // Follow-up buttons
  followUpGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '20px',
  } as React.CSSProperties,
  followUpBtn: (active: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '6px',
    padding: '14px 8px',
    border: `1px solid ${active ? '#A77049' : 'rgba(208,184,172,0.4)'}`,
    background: active ? 'rgba(167,112,73,0.08)' : 'transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
  } as React.CSSProperties),
  followUpIcon: {
    fontSize: '18px',
  } as React.CSSProperties,
  followUpLabel: {
    fontSize: '8px',
    fontWeight: 500,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: '#806A58',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  // Form fields in panel
  fieldLabel: {
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: '#B09080',
    marginBottom: '6px',
    display: 'block',
  } as React.CSSProperties,
  fieldInput: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #D0B8AC',
    background: '#FDFAF7',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '13px',
    color: '#3F2F24',
    outline: 'none',
    marginBottom: '12px',
  } as React.CSSProperties,
  fieldSelect: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #D0B8AC',
    background: '#FDFAF7',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '13px',
    color: '#3F2F24',
    outline: 'none',
    marginBottom: '12px',
    appearance: 'none' as const,
  } as React.CSSProperties,
  sendBtn: {
    width: '100%',
    padding: '14px',
    background: '#A77049',
    border: 'none',
    color: '#FDFAF7',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '10px',
    fontWeight: 400,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    marginTop: '8px',
  } as React.CSSProperties,

  // Toast
  toast: (show: boolean, isError: boolean) => ({
    position: 'fixed' as const,
    bottom: '24px',
    left: '50%',
    transform: `translateX(-50%) translateY(${show ? '0' : '20px'})`,
    opacity: show ? 1 : 0,
    background: isError ? '#8B3A3A' : '#2C1A0E',
    color: '#ECD9D0',
    padding: '12px 24px',
    fontSize: '12px',
    letterSpacing: '0.1em',
    zIndex: 200,
    transition: 'all 0.3s ease',
    pointerEvents: 'none' as const,
    borderRadius: '8px',
  } as React.CSSProperties),

  // Empty state
  empty: {
    textAlign: 'center' as const,
    padding: '80px 24px',
    color: '#B09080',
  } as React.CSSProperties,
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.4,
  } as React.CSSProperties,
  emptyText: {
    fontSize: '13px',
    fontWeight: 300,
    letterSpacing: '0.05em',
  } as React.CSSProperties,

  refreshBtn: {
    background: 'none',
    border: '1px solid rgba(236,217,208,0.3)',
    color: '#B09080',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '9px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    padding: '8px 14px',
    borderRadius: '4px',
  } as React.CSSProperties,
};

/* ── Component ────────────────────────────────────────── */

export default function StudioPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'tattoo' | 'piercing'>('all');

  const [selected, setSelected] = useState<Booking | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const [sentMap, setSentMap] = useState<Record<string, string[]>>({});

  const showToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  // Load sent status from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumi-sent');
      if (stored) setSentMap(JSON.parse(stored));
    } catch {}
  }, []);

  const markSent = (bookingId: string, type: string) => {
    setSentMap(prev => {
      const types = prev[bookingId] || [];
      if (types.includes(type)) return prev;
      const next = { ...prev, [bookingId]: [...types, type] };
      try { localStorage.setItem('lumi-sent', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const getSentTypes = (bookingId: string): string[] => sentMap[bookingId] || [];

  // Check if already authed
  useEffect(() => {
    fetch('/api/bookings')
      .then(r => { if (r.ok) { setAuthed(true); } })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch {
      showToast('Erro ao carregar marcações', true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchBookings();
  }, [authed, fetchBookings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthed(true);
      } else {
        setLoginError('Palavra-passe incorreta');
      }
    } catch {
      setLoginError('Erro de ligação');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthed(false);
    setBookings([]);
  };

  const handleSendFollowUp = async () => {
    if (!selected || !followUp) return;
    setSending(true);

    const payload: Record<string, string> = {
      type: followUp,
      name: selected.name,
      email: selected.email,
      lang: selected.lang || 'pt',
      artist: selected.artist || 'stephany-ribeiro',
      ...formData,
    };

    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        markSent(selected.id, followUp);
        showToast(`Email "${FOLLOWUP_TYPES.find(t => t.key === followUp)?.label}" enviado!`);
        setFollowUp(null);
        setFormData({});
      } else {
        const err = await res.json();
        showToast(err.error || 'Erro ao enviar', true);
      }
    } catch {
      showToast('Erro de ligação', true);
    }
    setSending(false);
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.service === filter);

  // ── Login screen
  if (checking) {
    return <div style={{ ...styles.loginWrap }}><p style={{ color: '#B09080', fontSize: '12px' }}>...</p></div>;
  }

  if (!authed) {
    return (
      <div style={styles.app}>
        <div style={styles.loginWrap}>
          <form style={styles.loginCard} onSubmit={handleLogin}>
            <p style={styles.loginTitle}>LUMI Studio</p>
            <p style={styles.loginSub}>Área de gestão</p>
            <input
              type="password"
              placeholder="Palavra-passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.loginInput}
              autoFocus
            />
            <button type="submit" style={styles.loginBtn}>Entrar</button>
            {loginError && <p style={styles.loginError}>{loginError}</p>}
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard
  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <span style={styles.headerTitle}>LUMI Studio</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => { cache_bust(); fetchBookings(); }} style={styles.refreshBtn}>
            {loading ? '...' : 'Atualizar'}
          </button>
          <button onClick={handleLogout} style={styles.headerBtn}>Sair</button>
        </div>
      </header>

      {/* Content */}
      <main style={styles.content}>
        {/* Filters */}
        <div style={styles.filters}>
          {(['all', 'tattoo', 'piercing'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={styles.filterPill(filter === f)}>
              {f === 'all' ? 'Todos' : f === 'tattoo' ? 'Tatuagem' : 'Piercing'}
              {f === 'all' ? ` (${bookings.length})` : ` (${bookings.filter(b => b.service === f).length})`}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading && bookings.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>A carregar...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>✦</div>
            <p style={styles.emptyText}>Sem marcações</p>
          </div>
        ) : (
          filtered.map(b => {
            const sent = getSentTypes(b.id);
            const lastSent = sent.length > 0 ? FOLLOWUP_TYPES.find(t => t.key === sent[sent.length - 1]) : null;
            return (
              <div key={b.id} style={styles.card} onClick={() => { setSelected(b); setFollowUp(null); setFormData({}); }}>
                <div style={styles.cardTop}>
                  <span style={styles.cardName}>{b.name}</span>
                  <span style={styles.cardBadge(b.service)}>
                    {b.service === 'tattoo' ? 'Tattoo' : 'Piercing'}
                  </span>
                </div>
                <div style={styles.cardMeta}>
                  {b.date} · {b.email}
                </div>
                {b.idea && b.idea !== '—' && (
                  <div style={styles.cardIdea}>{b.idea}</div>
                )}
                {sent.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {sent.map(s => {
                      const t = FOLLOWUP_TYPES.find(ft => ft.key === s);
                      return (
                        <span key={s} style={{
                          fontSize: '8px',
                          fontWeight: 500,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: 'rgba(74,130,87,0.1)',
                          color: '#4A8257',
                        }}>
                          ✓ {t?.label || s}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>

      {/* Detail Panel */}
      {selected && (
        <>
          <div style={styles.overlay} onClick={() => setSelected(null)} />
          <div style={styles.panel}>
            <div style={styles.panelHandle} />
            <div style={styles.panelContent}>
              <p style={styles.panelName}>{selected.name}</p>
              <p style={{ ...styles.cardMeta, marginBottom: '24px' }}>
                {selected.date} · {selected.service === 'tattoo' ? 'Tatuagem' : 'Piercing'}
              </p>

              {/* Details grid */}
              <div style={styles.panelGrid}>
                <div style={styles.panelSection}>
                  <p style={styles.panelLabel}>Email</p>
                  <p style={styles.panelValue}>{selected.email}</p>
                </div>
                <div style={styles.panelSection}>
                  <p style={styles.panelLabel}>Telemóvel</p>
                  <p style={styles.panelValue}>{selected.phone}</p>
                </div>
                <div style={styles.panelSection}>
                  <p style={styles.panelLabel}>Cidade</p>
                  <p style={styles.panelValue}>{selected.city}</p>
                </div>
                <div style={styles.panelSection}>
                  <p style={styles.panelLabel}>Artista</p>
                  <p style={styles.panelValue}>{selected.artist}</p>
                </div>
              </div>

              {/* Service-specific details */}
              {selected.service === 'tattoo' ? (
                <>
                  {selected.idea && selected.idea !== '—' && (
                    <div style={styles.panelSection}>
                      <p style={styles.panelLabel}>Ideia</p>
                      <p style={styles.panelValue}>{selected.idea}</p>
                    </div>
                  )}
                  <div style={styles.panelGrid}>
                    {selected.zone && selected.zone !== '—' && (
                      <div style={styles.panelSection}>
                        <p style={styles.panelLabel}>Zona</p>
                        <p style={styles.panelValue}>{selected.zone}</p>
                      </div>
                    )}
                    {selected.size && selected.size !== '—' && (
                      <div style={styles.panelSection}>
                        <p style={styles.panelLabel}>Tamanho</p>
                        <p style={styles.panelValue}>{selected.size} cm</p>
                      </div>
                    )}
                  </div>
                  {selected.references && selected.references !== '—' && (
                    <div style={styles.panelSection}>
                      <p style={styles.panelLabel}>Referências</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {selected.references.split(',').map((url, i) => {
                          const trimmed = url.trim();
                          if (!trimmed || !trimmed.startsWith('http')) return null;
                          return (
                            <a
                              key={i}
                              href={trimmed}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                border: '1px solid #D0B8AC',
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: 500,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase' as const,
                                color: '#A77049',
                                textDecoration: 'none',
                                fontFamily: "'Montserrat', sans-serif",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              📷 Imagem {i + 1}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.panelGrid}>
                  {selected.piercing_type && selected.piercing_type !== '—' && (
                    <div style={styles.panelSection}>
                      <p style={styles.panelLabel}>Tipo</p>
                      <p style={styles.panelValue}>{selected.piercing_type}</p>
                    </div>
                  )}
                  {selected.piercing_location && selected.piercing_location !== '—' && (
                    <div style={styles.panelSection}>
                      <p style={styles.panelLabel}>Local</p>
                      <p style={styles.panelValue}>{selected.piercing_location}</p>
                    </div>
                  )}
                </div>
              )}

              {selected.notes && selected.notes !== '—' && (
                <div style={styles.panelSection}>
                  <p style={styles.panelLabel}>Notas</p>
                  <p style={styles.panelValue}>{selected.notes}</p>
                </div>
              )}

              {selected.health && selected.health !== '—' && (
                <div style={styles.panelSection}>
                  <p style={styles.panelLabel}>Saúde</p>
                  <p style={styles.panelValue}>{selected.health}</p>
                </div>
              )}

              {/* Session info */}
              {selected.session_date && selected.session_date !== '—' && (
                <div style={{ background: 'rgba(74,130,87,0.06)', border: '1px solid rgba(74,130,87,0.15)', padding: '16px', marginBottom: '24px', borderRadius: '8px' }}>
                  <p style={{ ...styles.panelLabel, color: '#4A8257', marginBottom: '10px' }}>Sessão agendada</p>
                  <p style={{ fontSize: '14px', color: '#2C1A0E', fontWeight: 400, marginBottom: '4px' }}>
                    {new Date(selected.session_date).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' })}
                  </p>
                  {selected.session_duration && selected.session_duration !== '—' && (
                    <p style={{ fontSize: '12px', color: '#806A58', fontWeight: 300 }}>Duração: {selected.session_duration}</p>
                  )}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'rgba(74,130,87,0.1)', color: '#4A8257' }}>✓ Sessão</span>
                    {selected.lembrete_sent && selected.lembrete_sent !== '—' && (
                      <span style={{ fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'rgba(74,130,87,0.1)', color: '#4A8257' }}>✓ Lembrete</span>
                    )}
                    {selected.aftercare_sent && selected.aftercare_sent !== '—' && (
                      <span style={{ fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'rgba(74,130,87,0.1)', color: '#4A8257' }}>✓ Aftercare</span>
                    )}
                    {(!selected.lembrete_sent || selected.lembrete_sent === '—') && (
                      <span style={{ fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'rgba(176,144,128,0.1)', color: '#B09080' }}>Lembrete agendado</span>
                    )}
                    {(!selected.aftercare_sent || selected.aftercare_sent === '—') && (
                      <span style={{ fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'rgba(176,144,128,0.1)', color: '#B09080' }}>Aftercare agendado</span>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: '1px', background: '#ECD9D0', margin: '8px 0 24px' }} />

              {/* Follow-up actions */}
              <p style={{ ...styles.panelLabel, marginBottom: '12px' }}>Enviar email</p>

              <div style={styles.followUpGrid}>
                {FOLLOWUP_TYPES.map(t => {
                  const wasSent = selected ? getSentTypes(selected.id).includes(t.key) : false;
                  return (
                    <button
                      key={t.key}
                      onClick={() => { setFollowUp(followUp === t.key ? null : t.key); setFormData({}); }}
                      style={{
                        ...styles.followUpBtn(followUp === t.key),
                        ...(wasSent ? { background: 'rgba(74,130,87,0.08)', borderColor: 'rgba(74,130,87,0.3)' } : {}),
                      }}
                    >
                      <span style={styles.followUpIcon}>{wasSent ? '✓' : t.icon}</span>
                      <span style={{
                        ...styles.followUpLabel,
                        ...(wasSent ? { color: '#4A8257' } : {}),
                      }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Follow-up form fields */}
              {followUp && (() => {
                const type = FOLLOWUP_TYPES.find(t => t.key === followUp);
                const fields = type?.fields || [];

                return (
                  <div>
                    {fields.includes('budget') && (
                      <div>
                        <label style={styles.fieldLabel}>Valor (€)</label>
                        <input
                          type="number"
                          placeholder="Ex: 120"
                          value={formData.budget || ''}
                          onChange={e => setFormData({ ...formData, budget: e.target.value })}
                          style={styles.fieldInput}
                        />
                      </div>
                    )}
                    {fields.includes('reason') && (
                      <div>
                        <label style={styles.fieldLabel}>Motivo</label>
                        <select
                          value={formData.reason || ''}
                          onChange={e => setFormData({ ...formData, reason: e.target.value })}
                          style={styles.fieldSelect}
                        >
                          <option value="">Selecionar motivo...</option>
                          {REJECTION_REASONS.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {fields.includes('eta') && (
                      <div>
                        <label style={styles.fieldLabel}>Data prevista do esboço</label>
                        <input
                          type="date"
                          value={formData.eta || ''}
                          onChange={e => setFormData({ ...formData, eta: e.target.value })}
                          style={styles.fieldInput}
                        />
                      </div>
                    )}
                    {fields.includes('sketch_url') && (
                      <div>
                        <label style={styles.fieldLabel}>URL do esboço</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={formData.sketch_url || ''}
                          onChange={e => setFormData({ ...formData, sketch_url: e.target.value })}
                          style={styles.fieldInput}
                        />
                      </div>
                    )}
                    {fields.includes('session_url') && (
                      <div>
                        <label style={styles.fieldLabel}>URL para marcar sessão</label>
                        <input
                          type="url"
                          placeholder="https://calendly.com/..."
                          value={formData.session_url || ''}
                          onChange={e => setFormData({ ...formData, session_url: e.target.value })}
                          style={styles.fieldInput}
                        />
                      </div>
                    )}
                    {fields.includes('session_date') && (
                      <div>
                        <label style={styles.fieldLabel}>Data da sessão</label>
                        <input
                          type="date"
                          value={formData.session_date || ''}
                          onChange={e => setFormData({ ...formData, session_date: e.target.value })}
                          style={styles.fieldInput}
                        />
                      </div>
                    )}
                    {fields.includes('duration') && (
                      <div>
                        <label style={styles.fieldLabel}>Duração estimada</label>
                        <select
                          value={formData.duration || ''}
                          onChange={e => setFormData({ ...formData, duration: e.target.value })}
                          style={styles.fieldSelect}
                        >
                          <option value="">Selecionar duração...</option>
                          {SESSION_DURATIONS.map(d => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      onClick={handleSendFollowUp}
                      disabled={sending}
                      style={{ ...styles.sendBtn, opacity: sending ? 0.5 : 1 }}
                    >
                      {sending ? 'A enviar...' : `Enviar ${type?.label}`}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      <div style={styles.toast(toast.show, toast.isError)}>{toast.message}</div>
    </div>
  );
}

// Cache buster — forces a fresh fetch
function cache_bust() {
  // No-op on client side, the API handles caching
}
