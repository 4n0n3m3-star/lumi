import { NextResponse } from 'next/server';

const SHEET_URL = process.env.GOOGLE_SHEET_URL
  || 'https://script.google.com/macros/s/AKfycbwaMIQjRQnFTdiKFx9TJvup5vdI-q9sz5TWZHl3b5kyPCeoUfOfh19XtWyPpXDaynBYXw/exec';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email } = body || {};

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields: name, email' }, { status: 400 });
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
