import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Artist config — add more artists here in the future
const ARTISTS: Record<string, { name: string; email: string; from: string; instagram: string; tagline: { pt: string; en: string } }> = {
  'stephany-ribeiro': {
    name: 'Stephany Ribeiro',
    email: 'studio@lumiatelier.pt',
    from: 'LUMI Atelier <studio@lumiatelier.pt>',
    instagram: 'https://www.instagram.com/stephany.tattoo/',
    tagline: {
      pt: 'Arte que vive na tua pele',
      en: 'Art that lives on your skin',
    },
  },
};

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, service, lang, artist } = body;

  if (!email || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const isPt = lang !== 'en';
  const artistConfig = ARTISTS[artist] || ARTISTS['stephany-ribeiro'];

  const subject = isPt
    ? `✨ Recebi o teu pedido — ${artistConfig.name}`
    : `✨ I received your request — ${artistConfig.name}`;

  const serviceLabel = service === 'piercing'
    ? (isPt ? 'piercing' : 'piercing')
    : (isPt ? 'tatuagem' : 'tattoo');

  const html = `<!DOCTYPE html>
<html lang="${isPt ? 'pt' : 'en'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#ECD9D0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#ECD9D0;padding:48px 24px;">
  <tr>
    <td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#FDFAF7;">

        <tr>
          <td style="background:#2C1A0E;padding:40px 48px;text-align:center;">
            <p style="margin:0;font-size:14px;font-weight:400;letter-spacing:0.28em;text-transform:uppercase;color:#ECD9D0;">LUMI Atelier</p>
            <p style="margin:10px 0 0;font-size:8px;letter-spacing:0.22em;text-transform:uppercase;color:#B09080;">${isPt ? 'Creative Studio · Venda do Pinheiro' : 'Creative Studio · Venda do Pinheiro'}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:52px 48px 8px;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#B09080;">${isPt ? 'Olá' : 'Hello'}</p>
            <p style="margin:0 0 28px;font-size:30px;font-weight:300;color:#2C1A0E;line-height:1.2;">${name}</p>
            <div style="width:32px;height:1px;background:#D0B8AC;margin:0 0 32px;"></div>
            <p style="margin:0 0 20px;font-size:14px;color:#2C1A0E;line-height:1.8;font-weight:300;">
              ${isPt
                ? `Que bom receber o teu pedido de ${serviceLabel}! Fico muito feliz por confiares no LUMI Atelier. A tua artista será <strong>${artistConfig.name}</strong>.`
                : `I'm so happy to receive your ${serviceLabel} request! It truly means a lot that you trust LUMI Atelier. Your artist will be <strong>${artistConfig.name}</strong>.`}
            </p>
            <p style="margin:0 0 20px;font-size:14px;color:#7A5C48;line-height:1.8;font-weight:300;">
              ${isPt
                ? 'Vou dedicar toda a atenção à tua ideia e entro em contacto em breve com os próximos passos. Normalmente respondo dentro de 2–3 dias úteis.'
                : "I'll dedicate my full attention to your idea and get back to you with next steps soon. I usually respond within 2–3 business days."}
            </p>
            <p style="margin:0 0 40px;font-size:14px;color:#7A5C48;line-height:1.8;font-weight:300;">
              ${isPt
                ? 'Enquanto isso, espreita mais do nosso trabalho no Instagram. Se tiveres alguma dúvida urgente, podes sempre enviar-nos mensagem diretamente por lá ou responder a este email.'
                : "In the meantime, feel free to check out more of our work on Instagram. If you have any urgent questions, you can always message us directly there or reply to this email."}
            </p>
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:48px;">
              <tr>
                <td style="border:1px solid #A77049;">
                  <a href="${artistConfig.instagram}" style="display:inline-block;padding:14px 36px;font-size:10px;font-weight:400;letter-spacing:0.22em;text-transform:uppercase;color:#A77049;text-decoration:none;">
                    @lumi.atelier_
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px;"><div style="height:1px;background:#ECD9D0;"></div></td>
        </tr>

        <tr>
          <td style="padding:32px 48px 40px;">
            <p style="margin:0 0 2px;font-size:13px;color:#2C1A0E;font-weight:400;">${artistConfig.name}</p>
            <p style="margin:0 0 12px;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#B09080;">LUMI Atelier · Venda do Pinheiro, Portugal</p>
            <a href="mailto:studio@lumiatelier.pt" style="font-size:11px;color:#A77049;text-decoration:none;letter-spacing:0.05em;">studio@lumiatelier.pt</a>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px 32px;">
            <p style="margin:0;font-size:10px;color:#B09080;line-height:1.6;">
              ${isPt
                ? 'Recebeste este email porque preencheste o formulário de marcação em lumiatelier.com.'
                : 'You received this email because you submitted the booking form at lumiatelier.com.'}
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  try {
    await getResend().emails.send({
      from: artistConfig.from,
      to: email,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
