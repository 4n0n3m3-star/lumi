import { NextResponse } from 'next/server';

const SHEET_URL = process.env.GOOGLE_SHEET_URL
  || 'https://script.google.com/macros/s/AKfycbz9psqxbGmws9RbwbKrwgYfexPJ_0fSIii8q4uohrbsv19cyG65up3qLlMBdW5e2ZLD/exec';

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
      cache = { data: json.bookings, timestamp: Date.now() };
      return NextResponse.json(json.bookings);
    }

    return NextResponse.json({ error: 'Sheet error', details: json }, { status: 502 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch bookings', details: String(err) }, { status: 500 });
  }
}
