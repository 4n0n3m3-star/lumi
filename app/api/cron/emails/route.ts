import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const SHEET_URL = process.env.GOOGLE_SHEET_URL
  || 'https://script.google.com/macros/s/AKfycbz9psqxbGmws9RbwbKrwgYfexPJ_0fSIii8q4uohrbsv19cyG65up3qLlMBdW5e2ZLD/exec';

const ARTISTS: Record<string, { name: string; from: string; instagram: string }> = {
  'stephany-ribeiro': {
    name: 'Stephany Ribeiro',
    from: 'LUMI Atelier <studio@lumiatelier.pt>',
    instagram: 'https://www.instagram.com/stephany.tattoo/',
  },
};

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch pending emails from Google Sheet
    const res = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_pending_emails' }),
    });
    const data = await res.json();

    if (data.result !== 'ok' || !data.pending?.length) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    let sent = 0;
    const resend = getResend();

    for (const item of data.pending) {
      const a = ARTISTS[item.artist] || ARTISTS['stephany-ribeiro'];
      const isPt = item.lang !== 'en';

      let subject: string;
      let html: string;
      let markCol: number;

      if (item.type === 'lembrete') {
        const sessionDate = formatSessionDate(item.session_date, isPt);
        subject = isPt ? '✨ Lembrete: a tua sessão é amanhã!' : '✨ Reminder: your session is tomorrow!';
        html = buildReminderEmail({ isPt, name: item.name, session_date: sessionDate, duration: item.duration, a });
        markCol = item.lembrete_col;
      } else if (item.type === 'aftercare') {
        subject = isPt ? `✨ Cuidados pós-tatuagem — ${a.name}` : `✨ Aftercare guide — ${a.name}`;
        html = buildAftercareEmail({ isPt, name: item.name, a });
        markCol = item.aftercare_col;
      } else {
        continue;
      }

      try {
        await resend.emails.send({ from: a.from, to: item.email, subject, html });

        // Mark as sent in the sheet
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'mark_email_sent',
            sheet_name: item.sheet_name,
            row_num: item.row_num,
            col: markCol,
          }),
        });

        sent++;
        console.log(`Cron: sent ${item.type} to ${item.email}`);
      } catch (err) {
        console.error(`Cron: failed to send ${item.type} to ${item.email}:`, err);
      }
    }

    return NextResponse.json({ ok: true, sent });
  } catch (err) {
    console.error('Cron error:', err);
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}

/* ── Helpers ── */

interface ArtistInfo { name: string; from: string; instagram: string }

function formatSessionDate(raw: string, isPt: boolean): string {
  try {
    const d = new Date(raw);
    return d.toLocaleDateString(isPt ? 'pt-PT' : 'en-GB', {
      timeZone: 'Europe/Lisbon',
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return raw;
  }
}

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

function buildReminderEmail({ isPt, name, session_date, duration, a }: { isPt: boolean; name: string; session_date: string; duration: string; a: ArtistInfo }) {
  const para1 = isPt
    ? 'O grande dia está quase a chegar! Só te queria lembrar que a tua sessão é <strong>amanhã</strong>.'
    : "The big day is almost here! Just a friendly reminder that your session is <strong>tomorrow</strong>.";
  const para2 = isPt
    ? 'Estou ansiosa por te receber e criar algo lindo juntas!'
    : "I can't wait to welcome you and create something beautiful together!";
  const lumiLink = isPt
    ? 'Espero por ti no <a href="https://maps.app.goo.gl/zNsyDdv1vJyKyro19" style="color:#A77049;text-decoration:underline;">LUMI Atelier</a>! ✨'
    : 'I\'ll be waiting for you at <a href="https://maps.app.goo.gl/zNsyDdv1vJyKyro19" style="color:#A77049;text-decoration:underline;">LUMI Atelier</a>! ✨';

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
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para2}</p>
    `, a);
}

function buildAftercareEmail({ isPt, name, a }: { isPt: boolean; name: string; a: ArtistInfo }) {
  const para1 = isPt
    ? 'Espero que tenhas adorado a experiência tanto quanto eu! Foi um prazer enorme trabalhar contigo e ver esta peça ganhar vida na tua pele.'
    : "I hope you loved the experience as much as I did! It was an absolute pleasure working with you and seeing this piece come to life on your skin.";
  const tips = isPt ? [
    'Manter a película protetora durante 2–4 horas',
    'Lavar suavemente com água morna e sabão neutro (sem esfregar)',
    'Aplicar uma camada fina de creme cicatrizante (Bepanthene ou similar) 2–3× por dia',
    'Não coçar nem arrancar crostas — é normal a pele descamar',
    'Evitar exposição solar direta durante 2–3 semanas',
    'Evitar piscinas, mar e banhos prolongados durante 2 semanas',
    'Não usar roupa apertada sobre a zona nos primeiros dias',
  ] : [
    'Keep the protective film on for 2–4 hours',
    'Gently wash with lukewarm water and mild soap (don\'t scrub)',
    'Apply a thin layer of healing cream (Bepanthen or similar) 2–3× daily',
    'Don\'t scratch or pick at scabs — peeling is normal',
    'Avoid direct sun exposure for 2–3 weeks',
    'Avoid pools, sea water, and long baths for 2 weeks',
    'Don\'t wear tight clothing over the area for the first few days',
  ];
  const careTitle = isPt ? 'Para que a tua tatuagem cicatrize na perfeição, segue estes cuidados:' : 'To make sure your tattoo heals beautifully, follow these steps:';
  const para2 = isPt
    ? `Se tiveres qualquer dúvida durante a cicatrização, não hesites — envia-me mensagem no <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a> ou responde a este email. Estou sempre aqui para te ajudar!`
    : `If you have any concerns during healing, don't hesitate — message me on <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a> or reply to this email. I'm always here to help!`;
  const reviewText = isPt
    ? 'Se gostaste da experiência, ficava muito feliz se pudesses deixar uma palavrinha — significa imenso para mim e para o crescimento do atelier:'
    : 'If you enjoyed the experience, it would make my day if you could leave a few words — it means the world to me and helps the studio grow:';

  return buildEmail(isPt, name, `
        <p style="margin:0 0 24px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <p style="margin:0 0 8px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:400;">${careTitle}</p>
        <ul style="margin:0 0 32px;padding-left:20px;font-size:14px;color:#806A58;line-height:2.2;font-weight:300;">
          ${tips.map(t => `<li>${t}</li>`).join('\n          ')}
        </ul>
        <p style="margin:0 0 24px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para2}</p>
        <p style="margin:0 0 20px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${reviewText}</p>
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:48px;">
          <tr><td style="border:1px solid #A77049;border-radius:6px;">
            <a href="https://share.google/XwF5Gg3xCGjqV1AZ2" style="display:inline-block;padding:14px 36px;font-size:10px;font-weight:400;letter-spacing:0.22em;text-transform:uppercase;color:#A77049;text-decoration:none;">
              ${isPt ? 'Deixar Avaliação' : 'Leave a Review'}
            </a>
          </td></tr>
        </table>
    `, a);
}
