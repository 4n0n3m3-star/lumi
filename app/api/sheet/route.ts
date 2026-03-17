import { NextResponse } from 'next/server';

const SHEET_URL = process.env.GOOGLE_SHEET_URL;
if (!SHEET_URL) throw new Error('GOOGLE_SHEET_URL env var is required');

// Simple rate limit: max 5 submissions per IP per 10 minutes
const rateMap = new Map<string, number[]>();
const RATE_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT = 5;

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
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await req.json();
  const { name, email, website } = body || {};

  // Honeypot check
  if (website) {
    return NextResponse.json({ ok: true }); // fake success for bots
  }

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields: name, email' }, { status: 400 });
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    console.log('Sheet status:', response.status, 'body:', text.slice(0, 300));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Sheet error:', err);
    return NextResponse.json({ error: 'Failed to log to sheet' }, { status: 500 });
  }
}
