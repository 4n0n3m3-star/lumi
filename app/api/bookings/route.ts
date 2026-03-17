import { NextResponse } from 'next/server';

const SHEET_URL = process.env.GOOGLE_SHEET_URL;
if (!SHEET_URL) throw new Error('GOOGLE_SHEET_URL env var is required');

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cache: { data: unknown; timestamp: number } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(`${SHEET_URL}?limit=50`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    const json = await res.json();

    if (json.result === 'ok') {
      // Filter out empty/spam entries
      const valid = (json.bookings || []).filter((b: Record<string, string>) =>
        b.name && b.name !== '—' && b.name.trim() !== '' &&
        b.email && b.email !== '—' && b.email.trim() !== '' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)
      );
      cache = { data: valid, timestamp: Date.now() };
      return NextResponse.json(valid);
    }

    return NextResponse.json({ error: 'Sheet error', details: json }, { status: 502 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch bookings', details: String(err) }, { status: 500 });
  }
}
