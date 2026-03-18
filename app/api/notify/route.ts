import { NextResponse } from 'next/server';

const SHEET_URL = process.env.GOOGLE_SHEET_URL;
if (!SHEET_URL) throw new Error('GOOGLE_SHEET_URL env var is required');
const SHEET_URL_STR: string = SHEET_URL;

const rateMap = new Map<string, number[]>();
const RATE_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateMap.get(ip) || []).filter(t => now - t < RATE_WINDOW);
  if (hits.length >= RATE_LIMIT) return true;
  hits.push(now);
  rateMap.set(ip, hits);
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const body = await req.json();
  const { email, honeypot } = body || {};

  if (honeypot) return NextResponse.json({ ok: true }); // bot trap

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    await fetch(SHEET_URL_STR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'notify_signup', email, timestamp: new Date().toISOString() }),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
