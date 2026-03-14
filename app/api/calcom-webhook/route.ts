import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';

const SHEET_URL = process.env.GOOGLE_SHEET_URL
  || 'https://script.google.com/macros/s/AKfycbz9psqxbGmws9RbwbKrwgYfexPJ_0fSIii8q4uohrbsv19cyG65up3qLlMBdW5e2ZLD/exec';

const ARTISTS: Record<string, { name: string; from: string; instagram: string; cal: string }> = {
  'stephany-ribeiro': {
    name: 'Stephany Ribeiro',
    from: 'LUMI Atelier <studio@lumiatelier.pt>',
    instagram: 'https://www.instagram.com/stephany.tattoo/',
    cal: 'https://cal.com/lumiatelier',
  },
  'joana': {
    name: 'Joana',
    from: 'LUMI Atelier <studio@lumiatelier.pt>',
    instagram: 'https://www.instagram.com/lumi.atelier_/',
    cal: 'https://cal.com/lumiatelier',
  },
};

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: Request) {
  const body = await req.text();

  // Verify Cal.com webhook signature
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (secret) {
    const sig = req.headers.get('x-cal-signature-256') || '';
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (sig !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  const data = JSON.parse(body);
  const event = data.triggerEvent;

  // Only process new bookings
  if (event !== 'BOOKING_CREATED') {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const payload = data.payload;
  const attendee = payload?.attendees?.[0];
  if (!attendee?.email) {
    return NextResponse.json({ error: 'No attendee email' }, { status: 400 });
  }

  const startTime = payload.startTime;
  const endTime = payload.endTime;
  const durationMin = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000);
  const durationStr = durationMin >= 60
    ? `${Math.floor(durationMin / 60)}h${durationMin % 60 > 0 ? durationMin % 60 + 'min' : ''}`
    : `${durationMin}min`;

  // Format session date for display
  const sessionDate = new Date(startTime).toLocaleDateString('pt-PT', {
    timeZone: 'Europe/Lisbon',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  try {
    // Update Google Sheet with session info
    const sheetRes = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_session',
        email: attendee.email,
        session_date: startTime,
        session_duration: durationStr,
        booking_uid: payload.uid || '',
      }),
    });
    const sheetData = await sheetRes.json();

    if (!sheetData.matched) {
      console.log('Cal.com booking: no matching row for', attendee.email);
      return NextResponse.json({ ok: true, matched: false });
    }

    // Send "sessao" (session confirmed) email
    const name = sheetData.name || attendee.name || 'Cliente';
    const lang = sheetData.lang || 'pt';
    const artistKey = sheetData.artist || 'stephany-ribeiro';
    const a = ARTISTS[artistKey] || ARTISTS['stephany-ribeiro'];
    const isPt = lang !== 'en';

    const subject = isPt
      ? `✨ Sessão confirmada — ${a.name}`
      : `✨ Session confirmed — ${a.name}`;

    const html = buildSessionEmail({ isPt, name, session_date: sessionDate, duration: durationStr, a });

    await getResend().emails.send({
      from: a.from,
      to: attendee.email,
      subject,
      html,
    });

    console.log('Cal.com webhook: sessao email sent to', attendee.email);
    return NextResponse.json({ ok: true, matched: true, email_sent: true });
  } catch (err) {
    console.error('Cal.com webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

/* ── Email builders (same as followup route) ── */

interface ArtistInfo { name: string; from: string; instagram: string; cal: string }

function buildEmail(isPt: boolean, name: string, bodyHtml: string, a: ArtistInfo) {
  return `<!DOCTYPE html>
<html lang="${isPt ? 'pt' : 'en'}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EFD9CC;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#EFD9CC;padding:48px 24px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#FAF7F1;border-radius:16px;overflow:hidden;">
      <tr><td style="background:#1E1713;padding:40px 48px;text-align:center;">
        <p style="margin:0;font-size:14px;font-weight:400;letter-spacing:0.28em;text-transform:uppercase;color:#EFD9CC;">LUMI Atelier</p>
        <p style="margin:10px 0 0;font-size:8px;letter-spacing:0.22em;text-transform:uppercase;color:#BFA08C;">Creative Studio · Venda do Pinheiro</p>
      </td></tr>
      <tr><td style="padding:52px 48px 8px;">
        <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Olá' : 'Hello'}</p>
        <p style="margin:0 0 28px;font-size:30px;font-weight:300;color:#1E1713;line-height:1.2;">${name}</p>
        <div style="width:32px;height:1px;background:#BFA08C;margin:0 0 32px;"></div>
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:0 48px;"><div style="height:1px;background:#EFD9CC;"></div></td></tr>
      <tr><td style="padding:32px 48px 40px;">
        <p style="margin:0 0 2px;font-size:13px;color:#1E1713;font-weight:400;">${a.name}</p>
        <p style="margin:0 0 12px;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#BFA08C;">LUMI Atelier · Venda do Pinheiro, Portugal</p>
        <a href="mailto:studio@lumiatelier.pt" style="font-size:11px;color:#A77049;text-decoration:none;letter-spacing:0.05em;">studio@lumiatelier.pt</a>
      </td></tr>
      <tr><td style="padding:0 48px 32px;">
        <p style="margin:0;font-size:10px;color:#BFA08C;line-height:1.6;">
          ${isPt ? 'Recebeste este email porque preencheste o formulário de marcação em lumiatelier.pt.' : 'You received this email because you submitted the booking form at lumiatelier.pt.'}
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function preSessionTips(isPt: boolean) {
  const tips = isPt ? [
    'Dormir bem na noite anterior',
    'Comer uma refeição completa antes da sessão',
    'Manter a pele hidratada nos dias anteriores',
    'Não consumir álcool nas 24h anteriores',
    'Usar roupa confortável com fácil acesso à zona a tatuar',
    'Trazer um lanche e água (especialmente para sessões longas)',
  ] : [
    'Get a good night\'s sleep the night before',
    'Eat a full meal before your session',
    'Keep the skin moisturized in the days before',
    'Avoid alcohol 24h before',
    'Wear comfortable clothing with easy access to the tattoo area',
    'Bring a snack and water (especially for longer sessions)',
  ];
  const title = isPt ? 'Preparei algumas recomendações para ti:' : 'Here are a few tips to prepare:';
  return `<p style="margin:0 0 8px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:400;">${title}</p>
        <ul style="margin:0 0 32px;padding-left:20px;font-size:14px;color:#806A58;line-height:2.2;font-weight:300;">
          ${tips.map(t => `<li>${t}</li>`).join('\n          ')}
        </ul>`;
}

function buildSessionEmail({ isPt, name, session_date, duration, a }: { isPt: boolean; name: string; session_date: string; duration: string; a: ArtistInfo }) {
  const para1 = isPt
    ? 'A tua sessão está oficialmente confirmada! Estou muito entusiasmada para te conhecer e dar vida a esta peça.'
    : "Your session is officially confirmed! I'm so excited to meet you and bring this piece to life.";
  const lumiLink = isPt
    ? 'Espero por ti no <a href="https://maps.app.goo.gl/zNsyDdv1vJyKyro19" style="color:#A77049;text-decoration:underline;">LUMI Atelier</a>! ✨'
    : 'I\'ll be waiting for you at <a href="https://maps.app.goo.gl/zNsyDdv1vJyKyro19" style="color:#A77049;text-decoration:underline;">LUMI Atelier</a>! ✨';
  const contact = isPt
    ? `Se precisares de alguma coisa, podes sempre responder a este email ou enviar-me mensagem diretamente no <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a>. Estou aqui para ti!`
    : `If you need anything, you can always reply to this email or message me directly on <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a>. I'm here for you!`;

  return buildEmail(isPt, name, `
        <p style="margin:0 0 24px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 32px;">
          <tr><td style="border-left:2px solid #A77049;padding:12px 20px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Data' : 'Date'}</p>
            <p style="margin:0 0 12px;font-size:20px;font-weight:300;color:#1E1713;">${session_date}</p>
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Duração estimada' : 'Estimated duration'}</p>
            <p style="margin:0;font-size:20px;font-weight:300;color:#1E1713;">${duration}</p>
          </td></tr>
        </table>
        ${preSessionTips(isPt)}
        <p style="margin:0 0 20px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${lumiLink}</p>
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${contact}</p>
    `, a);
}
