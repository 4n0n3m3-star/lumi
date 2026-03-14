'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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
  healing_sent?: string;
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
  { key: 'deposito', label: 'Follow Up', icon: '💬' },
  { key: 'deposito_confirmado', label: 'Depósito OK', icon: '✓', fields: ['eta'] },
  { key: 'estudo', label: 'Estudo', icon: '✏️', fields: ['sketch_url', 'duration'] },
  { key: 'reagendar', label: 'Reagendar', icon: '📅' },
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

const WA_NUMBER = '351932558951';

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
    color: '#EFD9CC',
    marginBottom: '8px',
  } as React.CSSProperties,
  loginSub: {
    fontSize: '9px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    color: '#BFA08C',
    marginBottom: '48px',
  } as React.CSSProperties,
  loginInput: {
    width: '100%',
    padding: '14px 20px',
    background: 'transparent',
    border: '1px solid rgba(239,217,204,0.2)',
    borderRadius: '6px',
    color: '#EFD9CC',
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
    borderRadius: '6px',
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
    borderRadius: '0 0 6px 6px',
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
    color: '#EFD9CC',
  } as React.CSSProperties,
  headerBtn: {
    background: 'none',
    border: 'none',
    color: '#BFA08C',
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

  // Stats bar
  statsBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px 16px',
    background: '#FAF7F1',
    border: '1px solid rgba(191,160,140,0.2)',
    borderRadius: '16px',
  } as React.CSSProperties,
  statItem: {
    flex: 1,
    textAlign: 'center' as const,
  } as React.CSSProperties,
  statNumber: {
    fontSize: '18px',
    fontWeight: 300,
    color: '#3F2F24',
    lineHeight: 1.2,
  } as React.CSSProperties,
  statLabel: {
    fontSize: '7px',
    fontWeight: 500,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: '#BFA08C',
    marginTop: '2px',
  } as React.CSSProperties,

  // Search
  searchInput: {
    width: '100%',
    padding: '10px 14px 10px 36px',
    border: '1px solid rgba(191,160,140,0.3)',
    borderRadius: '999px',
    background: '#FAF7F1',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '12px',
    color: '#3F2F24',
    outline: 'none',
    marginBottom: '12px',
  } as React.CSSProperties,

  // Filters
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    overflowX: 'auto' as const,
  } as React.CSSProperties,
  filterPill: (active: boolean) => ({
    padding: '8px 16px',
    border: `1px solid ${active ? '#3F2F24' : '#BFA08C'}`,
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
    background: '#FAF7F1',
    border: '1px solid rgba(191,160,140,0.3)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  } as React.CSSProperties,
  cardArchived: {
    opacity: 0.5,
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
    color: '#1E1713',
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
    color: '#BFA08C',
    lineHeight: 1.6,
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
    background: '#FAF7F1',
    zIndex: 100,
    overflowY: 'auto' as const,
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 -4px 24px rgba(63,47,36,0.06), 0 -1px 4px rgba(63,47,36,0.04)',
  } as React.CSSProperties,
  panelHandle: {
    width: '40px',
    height: '4px',
    background: '#BFA08C',
    borderRadius: '2px',
    margin: '12px auto 0',
  } as React.CSSProperties,
  panelContent: {
    padding: '24px 24px 40px',
  } as React.CSSProperties,
  panelName: {
    fontSize: '22px',
    fontWeight: 300,
    color: '#1E1713',
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
    color: '#BFA08C',
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
    border: `1px solid ${active ? '#A77049' : 'rgba(191,160,140,0.4)'}`,
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
    color: '#BFA08C',
    marginBottom: '6px',
    display: 'block',
  } as React.CSSProperties,
  fieldInput: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #BFA08C',
    borderRadius: '6px',
    background: '#FAF7F1',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '13px',
    color: '#3F2F24',
    outline: 'none',
    marginBottom: '12px',
  } as React.CSSProperties,
  fieldSelect: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #BFA08C',
    borderRadius: '6px',
    background: '#FAF7F1',
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
    borderRadius: '6px',
    color: '#FAF7F1',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '10px',
    fontWeight: 400,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    marginTop: '8px',
  } as React.CSSProperties,

  // Small action buttons (WhatsApp, archive, etc.)
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    border: '1px solid rgba(191,160,140,0.4)',
    borderRadius: '6px',
    background: 'transparent',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#806A58',
    textDecoration: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  waBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    border: '1px solid rgba(37,211,102,0.3)',
    borderRadius: '6px',
    background: 'rgba(37,211,102,0.06)',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#25D366',
    textDecoration: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,

  copyBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as React.CSSProperties,

  // Notes
  notesTextarea: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(191,160,140,0.3)',
    borderRadius: '6px',
    background: '#FAF7F1',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '12px',
    color: '#3F2F24',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '60px',
  } as React.CSSProperties,

  // Toast
  toast: (show: boolean, isError: boolean) => ({
    position: 'fixed' as const,
    bottom: '24px',
    left: '50%',
    transform: `translateX(-50%) translateY(${show ? '0' : '20px'})`,
    opacity: show ? 1 : 0,
    background: isError ? '#8B3A3A' : '#1E1713',
    borderRadius: '999px',
    color: '#EFD9CC',
    padding: '12px 24px',
    fontSize: '12px',
    letterSpacing: '0.1em',
    zIndex: 200,
    transition: 'all 0.3s ease',
    pointerEvents: 'none' as const,
  } as React.CSSProperties),

  // Empty state
  empty: {
    textAlign: 'center' as const,
    padding: '80px 24px',
    color: '#BFA08C',
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
    border: '1px solid rgba(239,217,204,0.3)',
    color: '#BFA08C',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '9px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    padding: '8px 14px',
    borderRadius: '4px',
  } as React.CSSProperties,
};

/* ── SVG Icons ────────────────────────────────────────── */

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BFA08C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BFA08C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);

/* ── Helpers ──────────────────────────────────────────── */

function shortDate(raw: string): string {
  if (!raw) return '';
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) throw 0;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    const m = raw.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (m) return `${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}-${m[3]}`;
    return raw.split(' ')[0] || raw;
  }
}

function cleanDate(raw: string): string {
  if (!raw) return '';
  return raw.replace(/\s*GMT[^\)]*\([^)]*\)/g, '').replace(/:\d{2}\s*$/, '').trim();
}

function waLink(phone: string, name: string): string {
  const cleanPhone = phone?.replace(/\D/g, '') || WA_NUMBER;
  const p = cleanPhone.startsWith('351') ? cleanPhone : WA_NUMBER;
  const text = encodeURIComponent(`Olá ${name}! 😊`);
  return `https://wa.me/${p}?text=${text}`;
}

/* ── Component ────────────────────────────────────────── */

export default function StudioPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'tattoo' | 'piercing'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState('');
  const [sortNewest, setSortNewest] = useState(true);

  const [selected, setSelected] = useState<Booking | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const [sentMap, setSentMap] = useState<Record<string, string[]>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [archivedSet, setArchivedSet] = useState<Set<string>>(new Set());

  // Pull-to-refresh
  const contentRef = useRef<HTMLDivElement>(null);
  const [pullY, setPullY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const touchStartY = useRef(0);

  const showToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  // Load localStorage data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumi-sent');
      if (stored) setSentMap(JSON.parse(stored));
    } catch {}
    try {
      const stored = localStorage.getItem('lumi-notes');
      if (stored) setNotesMap(JSON.parse(stored));
    } catch {}
    try {
      const stored = localStorage.getItem('lumi-archived');
      if (stored) setArchivedSet(new Set(JSON.parse(stored)));
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

  const saveNote = (bookingId: string, note: string) => {
    setNotesMap(prev => {
      const next = { ...prev, [bookingId]: note };
      if (!note) delete next[bookingId];
      try { localStorage.setItem('lumi-notes', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleArchive = (bookingId: string) => {
    setArchivedSet(prev => {
      const next = new Set(prev);
      if (next.has(bookingId)) next.delete(bookingId); else next.add(bookingId);
      try { localStorage.setItem('lumi-archived', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  // Auth check
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

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (contentRef.current && contentRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
      setPulling(true);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0 && diff < 120) setPullY(diff);
  };
  const handleTouchEnd = () => {
    if (pullY > 60) fetchBookings();
    setPullY(0);
    setPulling(false);
  };

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

  // Filter, search, sort, archive
  const processed = bookings
    .filter(b => {
      if (!showArchived && archivedSet.has(b.id)) return false;
      if (showArchived && !archivedSet.has(b.id)) return false;
      if (filter !== 'all' && b.service !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || (b.phone || '').includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.date).getTime() || 0;
      const db = new Date(b.date).getTime() || 0;
      return sortNewest ? db - da : da - db;
    });

  // Stats
  const activeBookings = bookings.filter(b => !archivedSet.has(b.id));
  const pendingCount = activeBookings.filter(b => getSentTypes(b.id).length === 0).length;
  const inProgressCount = activeBookings.filter(b => {
    const s = getSentTypes(b.id);
    return s.length > 0 && !s.includes('Recusado');
  }).length;
  const archivedCount = bookings.filter(b => archivedSet.has(b.id)).length;

  // ── Login screen
  if (checking) {
    return <div style={{ ...styles.loginWrap }}><p style={{ color: '#BFA08C', fontSize: '12px' }}>...</p></div>;
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
          <button onClick={fetchBookings} style={styles.refreshBtn}>
            {loading ? '...' : 'Atualizar'}
          </button>
          <button onClick={handleLogout} style={styles.headerBtn}>Sair</button>
        </div>
      </header>

      {/* Content */}
      <main
        ref={contentRef}
        style={styles.content}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull-to-refresh indicator */}
        {pullY > 10 && (
          <div style={{ textAlign: 'center', padding: '8px 0', color: '#BFA08C', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {pullY > 60 ? 'Soltar para atualizar' : 'Puxar para atualizar'}
          </div>
        )}

        {/* Stats */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{pendingCount}</div>
            <div style={styles.statLabel}>Novos</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(191,160,140,0.2)' }} />
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{inProgressCount}</div>
            <div style={styles.statLabel}>Em curso</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(191,160,140,0.2)' }} />
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{archivedCount}</div>
            <div style={styles.statLabel}>Arquivo</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '14px', top: '11px' }}><SearchIcon /></div>
          <input
            type="text"
            placeholder="Procurar por nome, email ou telefone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          {(['all', 'tattoo', 'piercing'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={styles.filterPill(filter === f && !showArchived)}>
              {f === 'all' ? 'Todos' : f === 'tattoo' ? 'Tatuagem' : 'Piercing'}
              {f === 'all' ? ` (${activeBookings.length})` : ` (${activeBookings.filter(b => b.service === f).length})`}
            </button>
          ))}
          <button onClick={() => setShowArchived(!showArchived)} style={styles.filterPill(showArchived)}>
            Arquivo ({archivedCount})
          </button>
          <button onClick={() => setSortNewest(!sortNewest)} style={{ ...styles.filterPill(false), fontSize: '9px' }}>
            {sortNewest ? '↓ Recentes' : '↑ Antigos'}
          </button>
        </div>

        {/* Bookings */}
        {loading && bookings.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>A carregar...</p>
          </div>
        ) : processed.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>✦</div>
            <p style={styles.emptyText}>{search ? 'Sem resultados' : showArchived ? 'Arquivo vazio' : 'Sem marcações'}</p>
          </div>
        ) : (
          processed.map(b => {
            const sent = getSentTypes(b.id);
            const lastSent = sent.length > 0 ? FOLLOWUP_TYPES.find(t => t.key === sent[sent.length - 1]) : null;
            const isArchived = archivedSet.has(b.id);
            const note = notesMap[b.id];
            return (
              <div key={b.id} style={{ ...styles.card, ...(isArchived ? styles.cardArchived : {}) }} onClick={() => { setSelected(b); setFollowUp(null); setFormData({}); }}>
                <div style={styles.cardTop}>
                  <span style={styles.cardName}>{b.name}</span>
                  <span style={styles.cardBadge(b.service)}>
                    {b.service === 'tattoo' ? 'Tattoo' : 'Piercing'}
                  </span>
                </div>
                <div style={styles.cardMeta}>
                  {shortDate(b.date)} · {b.email}{b.phone && b.phone !== '—' ? ` · ${b.phone}` : ''}
                </div>
                {(lastSent || note || (b.healing_sent && b.healing_sent !== '—')) && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {lastSent && (
                      <span style={{
                        fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: '999px', background: 'rgba(74,130,87,0.1)', color: '#4A8257',
                      }}>✓ {lastSent.label}</span>
                    )}
                    {b.healing_sent && b.healing_sent !== '—' && (
                      <span style={{
                        fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: '999px', background: 'rgba(74,130,87,0.1)', color: '#4A8257',
                      }}>✓ Cicatrização</span>
                    )}
                    {note && (
                      <span style={{
                        fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: '999px', background: 'rgba(167,112,73,0.1)', color: '#A77049',
                      }}>📝 Nota</span>
                    )}
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
              <p style={{ ...styles.cardMeta, marginBottom: '16px' }}>
                {cleanDate(selected.date)} · {selected.service === 'tattoo' ? 'Tatuagem' : 'Piercing'}
              </p>

              {/* Quick actions: WhatsApp + Archive */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <a
                  href={waLink(selected.phone, selected.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.waBtn}
                  onClick={e => e.stopPropagation()}
                >
                  <WhatsAppIcon /> WhatsApp
                </a>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleArchive(selected.id); showToast(archivedSet.has(selected.id) ? 'Removido do arquivo' : 'Arquivado'); }}
                  style={styles.actionBtn}
                >
                  {archivedSet.has(selected.id) ? '↩ Restaurar' : '📦 Arquivar'}
                </button>
              </div>

              {/* Email & Phone with copy */}
              <div style={styles.panelGrid}>
                <div style={styles.panelSection}>
                  <p style={styles.panelLabel}>Email</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ ...styles.panelValue, margin: 0 }}>{selected.email}</p>
                    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(selected.email); showToast('Email copiado'); }} style={styles.copyBtn} title="Copiar">
                      <CopyIcon />
                    </button>
                  </div>
                </div>
                <div style={styles.panelSection}>
                  <p style={styles.panelLabel}>Telemóvel</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ ...styles.panelValue, margin: 0 }}>{selected.phone}</p>
                    {selected.phone && selected.phone !== '—' && (
                      <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(selected.phone); showToast('Telemóvel copiado'); }} style={styles.copyBtn} title="Copiar">
                        <CopyIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Other details */}
              <div style={styles.panelGrid}>
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
                            <a key={i} href={trimmed} target="_blank" rel="noopener noreferrer" download
                              style={{ ...styles.actionBtn, color: '#A77049' }}
                              onClick={e => e.stopPropagation()}
                            >📷 Imagem {i + 1}</a>
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
                  <p style={styles.panelLabel}>Notas do cliente</p>
                  <p style={styles.panelValue}>{selected.notes}</p>
                </div>
              )}

              {selected.health && selected.health !== '—' && (
                <div style={styles.panelSection}>
                  <p style={styles.panelLabel}>Saúde</p>
                  <p style={styles.panelValue}>{selected.health}</p>
                </div>
              )}

              {/* Internal notes */}
              <div style={styles.panelSection}>
                <p style={styles.panelLabel}>Notas internas</p>
                <textarea
                  value={notesMap[selected.id] || ''}
                  onChange={e => saveNote(selected.id, e.target.value)}
                  placeholder="Adicionar notas privadas..."
                  style={styles.notesTextarea}
                  onClick={e => e.stopPropagation()}
                />
              </div>

              {/* Session info */}
              {selected.session_date && selected.session_date !== '—' && (
                <div style={{ background: 'rgba(74,130,87,0.06)', border: '1px solid rgba(74,130,87,0.15)', padding: '16px', marginBottom: '24px', borderRadius: '8px' }}>
                  <p style={{ ...styles.panelLabel, color: '#4A8257', marginBottom: '10px' }}>Sessão agendada</p>
                  <p style={{ fontSize: '14px', color: '#1E1713', fontWeight: 400, marginBottom: '4px' }}>
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
                      <span style={{ fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'rgba(191,160,140,0.1)', color: '#BFA08C' }}>Lembrete agendado</span>
                    )}
                    {(!selected.aftercare_sent || selected.aftercare_sent === '—') && (
                      <span style={{ fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'rgba(191,160,140,0.1)', color: '#BFA08C' }}>Aftercare agendado</span>
                    )}
                    {selected.healing_sent && selected.healing_sent !== '—' && (
                      <span style={{ fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'rgba(74,130,87,0.1)', color: '#4A8257' }}>✓ Cicatrização</span>
                    )}
                    {selected.aftercare_sent && selected.aftercare_sent !== '—' && (!selected.healing_sent || selected.healing_sent === '—') && (
                      <span style={{ fontSize: '8px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: 'rgba(191,160,140,0.1)', color: '#BFA08C' }}>Cicatrização agendada</span>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: '1px', background: '#EFD9CC', margin: '8px 0 24px' }} />

              {/* Follow-up actions */}
              <p style={{ ...styles.panelLabel, marginBottom: '12px' }}>Enviar email</p>

              <div style={styles.followUpGrid}>
                {(() => {
                  const sent = selected ? getSentTypes(selected.id) : [];
                  const hasOrcamento = sent.includes('Orçamento');
                  const hasDepositoOk = sent.includes('deposito_confirmado');
                  const hasMaisDetalhes = sent.includes('Mais Detalhes');
                  const hasEstudo = sent.includes('estudo');

                  let visible = FOLLOWUP_TYPES;
                  if (hasEstudo) {
                    // After estudo, only reagendar makes sense
                    visible = FOLLOWUP_TYPES.filter(t => t.key === 'reagendar');
                  } else if (hasDepositoOk) {
                    visible = FOLLOWUP_TYPES.filter(t => t.key === 'estudo');
                  } else if (hasOrcamento) {
                    visible = FOLLOWUP_TYPES.filter(t => !['Mais Detalhes', 'Recusado'].includes(t.key));
                  }

                  return visible.map(t => {
                    const wasSent = sent.includes(t.key);
                    return (
                      <button
                        key={t.key}
                        onClick={() => { setFollowUp(followUp === t.key ? null : t.key); setFormData(hasMaisDetalhes && t.key === 'Orçamento' ? { _afterDetails: '1' } : {}); }}
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
                  });
                })()}
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
                        <label style={styles.fieldLabel}>Data prevista do estudo</label>
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
                        <label style={styles.fieldLabel}>URL do estudo</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={formData.sketch_url || ''}
                          onChange={e => setFormData({ ...formData, sketch_url: e.target.value })}
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
