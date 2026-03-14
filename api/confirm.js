import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, service, lang } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const isPt = lang !== 'en';
    const isTattoo = service !== 'piercing';

    const subject = isPt
        ? 'Recebi o teu pedido — LUMI Atelier'
        : 'I received your request — LUMI Atelier';

    const serviceWord = isPt
        ? (isTattoo ? 'tatuagem' : 'piercing')
        : (isTattoo ? 'tattoo' : 'piercing');

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

        <!-- Header -->
        <tr>
          <td style="background:#1A0E06;padding:40px 48px;text-align:center;">
            <p style="margin:0;font-size:14px;font-weight:400;letter-spacing:0.32em;text-transform:uppercase;color:#ECD9D0;">LUMI Atelier</p>
            <p style="margin:10px 0 0;font-size:8px;letter-spacing:0.22em;text-transform:uppercase;color:#B09080;">Where light meets skin.</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:52px 48px 8px;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#B09080;">${isPt ? 'Olá' : 'Hello'}</p>
            <p style="margin:0 0 28px;font-size:30px;font-weight:300;color:#2C1A0E;line-height:1.2;">${name}</p>
            <div style="width:32px;height:1px;background:#D0B8AC;margin:0 0 32px;"></div>
            <p style="margin:0 0 20px;font-size:14px;color:#2C1A0E;line-height:1.8;font-weight:300;">
              ${isPt
                ? `Obrigada por confiares em nós com esta ${serviceWord}. Recebemos o teu pedido e iremos analisá-lo com toda a atenção que merece.`
                : `Thank you for trusting us with this ${serviceWord}. We've received your request and will review it with all the care it deserves.`}
            </p>
            <p style="margin:0 0 20px;font-size:14px;color:#7A5C48;line-height:1.8;font-weight:300;">
              ${isPt
                ? 'Entraremos em contacto em breve para conversarmos sobre os próximos passos.'
                : "We'll be in touch soon to talk through next steps together."}
            </p>
            <p style="margin:0 0 40px;font-size:14px;color:#7A5C48;line-height:1.8;font-weight:300;">
              ${isPt
                ? 'Enquanto isso, podes seguir o nosso trabalho no Instagram. Estamos à tua disposição para qualquer dúvida.'
                : 'In the meantime, you can follow our work on Instagram. We\'re here if you have any questions.'}
            </p>
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:48px;">
              <tr>
                <td style="border:1px solid #A77049;">
                  <a href="https://www.instagram.com/lumi.atelier_/" style="display:inline-block;padding:14px 36px;font-size:10px;font-weight:400;letter-spacing:0.22em;text-transform:uppercase;color:#A77049;text-decoration:none;">
                    @lumi.atelier_
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 48px;"><div style="height:1px;background:#ECD9D0;"></div></td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:32px 48px 40px;">
            <p style="margin:0 0 2px;font-size:13px;color:#2C1A0E;font-weight:400;">LUMI Atelier</p>
            <p style="margin:0 0 12px;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#B09080;">Tattoo &amp; Piercing Studio · Venda do Pinheiro, Portugal</p>
            <a href="mailto:studio@lumiatelier.com" style="font-size:11px;color:#A77049;text-decoration:none;letter-spacing:0.05em;">studio@lumiatelier.com</a>
          </td>
        </tr>

        <!-- Fine print -->
        <tr>
          <td style="padding:0 48px 32px;">
            <p style="margin:0;font-size:10px;color:#B09080;line-height:1.6;">
              ${isPt
                ? 'Recebeste este email porque preencheste o formulário de marcação em lumiatelier.pt.'
                : 'You received this email because you submitted the booking form at lumiatelier.pt.'}
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
        await resend.emails.send({
            from: 'LUMI Atelier <studio@lumiatelier.com>',
            to: email,
            subject,
            html,
        });
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Resend error:', err);
        return res.status(500).json({ error: 'Failed to send email' });
    }
}
