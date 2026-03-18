import { NextResponse } from 'next/server';
import crypto from 'crypto';

const PASSWORD = process.env.STUDIO_PASSWORD || '';
const SECRET = process.env.STUDIO_SECRET;
if (!SECRET) throw new Error('STUDIO_SECRET env var is required');
const SECRET_KEY: string = SECRET;

function sign(value: string) {
  return crypto.createHmac('sha256', SECRET_KEY).update(value).digest('hex');
}

export async function POST(req: Request) {
  const { password } = await req.json();

  if (!PASSWORD || password !== PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = sign('studio-auth');
  const res = NextResponse.json({ ok: true });
  res.cookies.set('studio-session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('studio-session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return res;
}
