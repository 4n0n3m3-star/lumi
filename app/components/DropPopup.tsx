'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'lumi_drop_dismissed';
const RESHOW_DAYS = 30;
const DELAY_MS = 7000;

export default function DropPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const ts = parseInt(raw, 10);
      if (Date.now() - ts < RESHOW_DAYS * 86400 * 1000) return;
    }
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    if (visible) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch { /* silent */ }
    setSent(true);
    setLoading(false);
    setTimeout(dismiss, 2800);
  }

  if (!visible) return null;

  return (
    <div className="drop-overlay" onClick={dismiss} role="dialog" aria-modal="true" aria-label="Lista de acesso antecipado">
      <div className="drop-modal" onClick={e => e.stopPropagation()}>
        <button className="drop-close" onClick={dismiss} aria-label="Fechar">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="drop-grain" aria-hidden="true" />

        <p className="drop-eyebrow">— acesso antecipado</p>

        <h2 className="drop-title">
          Algo está<br />a ser feito.
        </h2>

        <p className="drop-sub">
          Não vamos revelar o quê.<br />Mas quem estiver na lista saberá primeiro.
        </p>

        {!sent ? (
          <form className="drop-form" onSubmit={submit}>
            <input type="text" name="website" tabIndex={-1} aria-hidden="true" style={{display:'none'}} />
            <div className="drop-input-wrap">
              <input
                type="email"
                className="drop-input"
                placeholder="o teu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
              <button type="submit" className="drop-btn" disabled={loading}>
                {loading ? '...' : 'Entrar'}
              </button>
            </div>
          </form>
        ) : (
          <p className="drop-confirm">Estás dentro. Aguarda.</p>
        )}

        <p className="drop-note">Sem spam. Nunca.</p>
      </div>
    </div>
  );
}
