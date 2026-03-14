import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const ARTISTS: Record<string, { name: string; email: string; from: string; instagram: string; cal: string }> = {
  'stephany-ribeiro': {
    name: 'Stephany Ribeiro',
    email: 'studio@lumiatelier.pt',
    from: 'LUMI Atelier <studio@lumiatelier.pt>',
    instagram: 'https://www.instagram.com/stephany.tattoo/',
    cal: 'https://cal.com/lumiatelier',
  },
};

export async function POST(req: Request) {
  const body = await req.json();
  const { type, name, email, lang, artist, budget, reason, eta, sketch_url, duration, session_url, session_date, _afterDetails } = body;

  if (!email || !name || !type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const isPt = lang !== 'en';
  const a = ARTISTS[artist] || ARTISTS['stephany-ribeiro'];
  let subject: string;
  let html: string;

  if (type === 'Orçamento') {
    subject = isPt ? `✨ O teu orçamento — ${a.name}` : `✨ Your quote — ${a.name}`;
    html = buildBudgetEmail({ isPt, name, budget, a, afterDetails: !!_afterDetails });
  } else if (type === 'Mais Detalhes') {
    subject = isPt ? `✨ Preciso de mais detalhes — ${a.name}` : `✨ A few more details needed — ${a.name}`;
    html = buildDetailsEmail({ isPt, name, a });
  } else if (type === 'Recusado') {
    subject = isPt ? `✨ O teu pedido — ${a.name}` : `✨ Your request — ${a.name}`;
    html = buildRejectionEmail({ isPt, name, reason, a });
  } else if (type === 'deposito') {
    subject = isPt ? `✨ Ainda estou por aqui — ${a.name}` : `✨ Just checking in — ${a.name}`;
    html = buildFollowUpEmail({ isPt, name, a });
  } else if (type === 'deposito_confirmado') {
    subject = isPt ? `✨ Depósito confirmado — ${a.name}` : `✨ Deposit confirmed — ${a.name}`;
    html = buildDepositConfirmedEmail({ isPt, name, eta, a });
  } else if (type === 'estudo') {
    subject = isPt ? '✨ O teu estudo está pronto!' : '✨ Your study is ready!';
    html = buildSketchEmail({ isPt, name, sketch_url, duration, session_url: session_url || a.cal, a });
  } else if (type === 'sessao') {
    subject = isPt ? `✨ Sessão confirmada — ${a.name}` : `✨ Session confirmed — ${a.name}`;
    html = buildSessionEmail({ isPt, name, session_date, duration, a });
  } else if (type === 'lembrete') {
    subject = isPt ? '✨ Lembrete: a tua sessão é amanhã!' : '✨ Reminder: your session is tomorrow!';
    html = buildReminderEmail({ isPt, name, session_date, duration, a });
  } else if (type === 'aftercare') {
    subject = isPt ? `✨ Cuidados pós-tatuagem — ${a.name}` : `✨ Aftercare guide — ${a.name}`;
    html = buildAftercareEmail({ isPt, name, a });
  } else if (type === 'reagendar') {
    subject = isPt ? `✨ Reagendamento da sessão — ${a.name}` : `✨ Session rescheduling — ${a.name}`;
    html = buildRescheduleEmail({ isPt, name, a });
  } else if (type === 'healing') {
    subject = isPt ? `✨ Como está a cicatrizar? — ${a.name}` : `✨ How is it healing? — ${a.name}`;
    html = buildHealingCheckEmail({ isPt, name, a });
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  try {
    await getResend().emails.send({ from: a.from, to: email, subject, html });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

/* ── types ── */

interface ArtistConfig { name: string; email: string; from: string; instagram: string; cal: string }

/* ── shared email wrapper ── */

function buildEmail(isPt: boolean, name: string, bodyHtml: string, a: ArtistConfig) {
  return `<!DOCTYPE html>
<html lang="${isPt ? 'pt' : 'en'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#EFD9CC;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#EFD9CC;padding:48px 24px;">
  <tr>
    <td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#FAF7F1;border-radius:16px;overflow:hidden;">

        <tr>
          <td style="background:#1E1713;padding:40px 48px;text-align:center;">
            <p style="margin:0;font-size:14px;font-weight:400;letter-spacing:0.28em;text-transform:uppercase;color:#EFD9CC;">LUMI Atelier</p>
            <p style="margin:10px 0 0;font-size:8px;letter-spacing:0.22em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Creative Studio · Venda do Pinheiro' : 'Creative Studio · Venda do Pinheiro'}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:52px 48px 8px;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Olá' : 'Hello'}</p>
            <p style="margin:0 0 28px;font-size:30px;font-weight:300;color:#1E1713;line-height:1.2;">${name}</p>
            <div style="width:32px;height:1px;background:#BFA08C;margin:0 0 32px;"></div>
            ${bodyHtml}
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px;"><div style="height:1px;background:#EFD9CC;"></div></td>
        </tr>

        <tr>
          <td style="padding:32px 48px 40px;">
            <p style="margin:0 0 2px;font-size:13px;color:#1E1713;font-weight:400;">${a.name}</p>
            <p style="margin:0 0 12px;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#BFA08C;">LUMI Atelier · Venda do Pinheiro, Portugal</p>
            <a href="mailto:studio@lumiatelier.pt" style="font-size:11px;color:#A77049;text-decoration:none;letter-spacing:0.05em;">studio@lumiatelier.pt</a>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px 32px;">
            <p style="margin:0;font-size:10px;color:#BFA08C;line-height:1.6;">
              ${isPt ? 'Recebeste este email porque preencheste o formulário de marcação em lumiatelier.pt.' : 'You received this email because you submitted the booking form at lumiatelier.pt.'}
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/* ── shared components ── */

function btn(href: string, label: string) {
  return `<table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:48px;">
            <tr>
              <td style="border:1px solid #A77049;border-radius:6px;">
                <a href="${href}" style="display:inline-block;padding:14px 36px;font-size:10px;font-weight:400;letter-spacing:0.22em;text-transform:uppercase;color:#A77049;text-decoration:none;">
                  ${label}
                </a>
              </td>
            </tr>
          </table>`;
}

function formatEta(raw: string | undefined, isPt: boolean) {
  if (!raw) return '';
  const str = String(raw);
  if (str.match(/^\d{4}-\d{2}-\d{2}/)) {
    const d = new Date(str);
    return d.toLocaleDateString(isPt ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return str;
}

function directContact(isPt: boolean, a: ArtistConfig) {
  return isPt
    ? `Se precisares de alguma coisa, podes sempre responder a este email, enviar-me mensagem no <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a> ou no <a href="https://wa.me/351932558951" style="color:#A77049;text-decoration:underline;">WhatsApp</a>. Estou aqui para ti!`
    : `If you need anything, you can always reply to this email, message me on <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a> or <a href="https://wa.me/351932558951" style="color:#A77049;text-decoration:underline;">WhatsApp</a>. I'm here for you!`;
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
  return `
        <p style="margin:0 0 8px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:400;">${title}</p>
        <ul style="margin:0 0 32px;padding-left:20px;font-size:14px;color:#806A58;line-height:2.2;font-weight:300;">
          ${tips.map(t => `<li>${t}</li>`).join('\n          ')}
        </ul>`;
}

function lumiLink(isPt: boolean) {
  return isPt
    ? 'Espero por ti no <a href="https://maps.app.goo.gl/zNsyDdv1vJyKyro19" style="color:#A77049;text-decoration:underline;">LUMI Atelier</a>! ✨'
    : 'I\'ll be waiting for you at <a href="https://maps.app.goo.gl/zNsyDdv1vJyKyro19" style="color:#A77049;text-decoration:underline;">LUMI Atelier</a>! ✨';
}

/* ── Step 4a: Budget quote ── */

function buildBudgetEmail({ isPt, name, budget, a, afterDetails = false }: { isPt: boolean; name: string; budget: string; a: ArtistConfig; afterDetails?: boolean }) {
  const para1 = afterDetails
    ? (isPt
      ? 'Agora que tenho mais detalhes sobre a tua ideia, posso seguramente dar-te o orçamento. Preparei tudo com muito carinho!'
      : "Now that I have more details about your idea, I can confidently give you a quote. I've prepared everything with care!")
    : (isPt
      ? 'Adorei a tua ideia! Dediquei toda a atenção a analisá-la e preparei o teu orçamento com muito carinho.'
      : "I loved your idea! I've given it my full attention and prepared your quote with care.");

  const depositText = isPt
    ? 'Se concordares com o orçamento e quiseres que eu comece a trabalhar na tua peça, basta enviares um depósito de <strong>20€</strong> via MB Way para o número <strong>932 558 951</strong>. O depósito é não reembolsável e serve para reservar o teu lugar na minha agenda.'
    : 'If you agree with the quote and would like me to start working on your piece, just send a non-refundable deposit of <strong>€20</strong> via MB Way to <strong>932 558 951</strong>. The deposit reserves your spot in my schedule.';

  const para2 = isPt
    ? `Assim que receber o depósito, confirmo a receção e envio-te uma data estimada para o estudo. Se tiveres alguma dúvida, responde a este email ou envia-me mensagem no <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a>. Vou adorar criar esta peça para ti!`
    : `Once I receive the deposit, I'll confirm it and send you an estimated date for the study. If you have any questions, reply to this email or message me on <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a>. I would love to create this piece for you!`;

  return buildEmail(isPt, name, `
        <p style="margin:0 0 24px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;">
          <tr>
            <td style="border-left:2px solid #A77049;padding:12px 20px;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Orçamento' : 'Quote'}</p>
              <p style="margin:0;font-size:28px;font-weight:300;color:#1E1713;">${budget}€</p>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 20px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${depositText}</p>
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para2}</p>
    `, a);
}

/* ── Step 4b: Request more details ── */

function buildDetailsEmail({ isPt, name, a }: { isPt: boolean; name: string; a: ArtistConfig }) {
  const para1 = isPt
    ? 'Muito obrigada pelo teu pedido! Já estive a analisar a tua ideia e estou entusiasmada, mas precisaria de mais alguns detalhes para conseguir criar algo realmente especial para ti.'
    : "Thank you so much for your request! I've been looking at your idea and I'm excited, but I'd need a few more details to create something truly special for you.";

  const bullet1 = isPt
    ? 'Uma descrição mais detalhada da ideia e do estilo de tatuagem que imaginas'
    : 'A more detailed description of the idea and the tattoo style you have in mind';

  const bullet2 = isPt
    ? 'Mais imagens de inspiração (fotos de tatuagens, ilustrações, referências visuais)'
    : 'More inspiration images (tattoo photos, illustrations, visual references)';

  const para3 = isPt
    ? `Responde diretamente a este email ou, se preferires, envia-me mensagem no <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a> — o que for mais fácil para ti. Mal posso esperar para ver mais!`
    : `Just reply to this email or, if you prefer, send me a message on <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a> — whatever is easier for you. Can't wait to see more!`;

  return buildEmail(isPt, name, `
        <p style="margin:0 0 20px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <p style="margin:0 0 8px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${isPt ? 'Precisaria que me enviasses:' : "I'd need you to send me:"}</p>
        <ul style="margin:0 0 32px;padding-left:20px;font-size:14px;color:#806A58;line-height:2;font-weight:300;">
          <li>${bullet1}</li>
          <li>${bullet2}</li>
        </ul>
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para3}</p>
    `, a);
}

/* ── Step 4c: Rejection ── */

function buildRejectionEmail({ isPt, name, reason, a }: { isPt: boolean; name: string; reason: string; a: ArtistConfig }) {
  const intro = isPt
    ? 'Antes de mais, muito obrigada por teres pensado em mim para esta peça. Significa muito que tenhas confiado no meu trabalho.'
    : "First of all, thank you so much for thinking of me for this piece. It truly means a lot that you trusted my work.";

  const closing = isPt
    ? 'Desejo-te toda a sorte do mundo na procura pelo artista certo. Se no futuro tiveres outra ideia que se enquadre no meu estilo, a minha porta está sempre aberta!'
    : 'I wish you all the best in finding the right artist. If in the future you have another idea that fits my style, my door is always open!';

  let reasonText: string;
  if (reason === 'Fora do meu estilo') {
    reasonText = isPt
      ? 'Após analisar tudo com carinho, sinto que este projeto não se enquadra no meu estilo artístico atual. Quero ser honesta contigo porque mereces o melhor resultado possível, e sei que outro artista poderá dar vida a esta ideia de uma forma incrível.'
      : "After careful consideration, I feel this project isn't the best fit for my current artistic style. I want to be honest with you because you deserve the best possible result, and I know another artist could bring this idea to life beautifully.";
  } else if (reason === 'Não consigo fazer cover') {
    reasonText = isPt
      ? 'Após analisar a tatuagem existente com toda a atenção, não me sinto confortável em garantir um resultado que esteja à altura do que mereces. Prefiro ser transparente contigo do que arriscar algo que não te deixe 100% feliz.'
      : "After carefully examining the existing tattoo, I don't feel confident I can deliver a result that lives up to what you deserve. I'd rather be transparent with you than risk something that wouldn't make you 100% happy.";
  } else {
    reasonText = isPt
      ? `Neste momento a minha agenda está bastante preenchida e infelizmente não tenho disponibilidade. Mas podes sempre acompanhar-me no <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a> para saberes quando abrir novas vagas — adorava poder trabalhar contigo no futuro!`
      : `My schedule is quite full right now and unfortunately I don't have availability. But you can always follow me on <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a> to know when I open new spots — I'd love to work with you in the future!`;
  }

  return buildEmail(isPt, name, `
        <p style="margin:0 0 20px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${intro}</p>
        <p style="margin:0 0 20px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${reasonText}</p>
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${closing}</p>
    `, a);
}

/* ── Step 5: Gentle follow-up after budget sent ── */

function buildFollowUpEmail({ isPt, name, a }: { isPt: boolean; name: string; a: ArtistConfig }) {
  const para1 = isPt
    ? 'Espero que estejas bem! Estou só a passar por aqui para saber se tiveste oportunidade de ver o orçamento que te enviei.'
    : "Hope you're doing well! Just checking in to see if you had a chance to look at the quote I sent.";

  const para2 = isPt
    ? 'Sem pressa nenhuma — fico por aqui para qualquer dúvida que possas ter. Se quiseres ajustar alguma coisa ou conversar sobre a ideia, estou sempre disponível!'
    : "No rush at all — I'm here for any questions you might have. If you'd like to adjust anything or talk about the idea, I'm always available!";

  const para3 = isPt
    ? `Podes responder a este email ou enviar-me mensagem no <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a>. Adorava poder criar esta peça para ti!`
    : `You can reply to this email or message me on <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a>. I'd love to create this piece for you!`;

  return buildEmail(isPt, name, `
        <p style="margin:0 0 20px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <p style="margin:0 0 20px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para2}</p>
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para3}</p>
    `, a);
}

/* ── Step 5b: Deposit confirmed + estudo ETA ── */

function buildDepositConfirmedEmail({ isPt, name, eta, a }: { isPt: boolean; name: string; eta: string; a: ArtistConfig }) {
  const formattedEta = formatEta(eta, isPt);

  const para1 = isPt
    ? 'O teu depósito foi recebido com sucesso! Muito obrigada — está tudo confirmado do teu lado.'
    : "Your deposit has been received! Thank you so much — everything is confirmed on your end.";

  const etaText = isPt
    ? `Vou começar a trabalhar no teu estudo e tê-lo pronto até <strong>${formattedEta}</strong>. Mal posso esperar para te mostrar!`
    : `I'll start working on your study and have it ready by <strong>${formattedEta}</strong>. Can't wait to show you!`;

  return buildEmail(isPt, name, `
        <p style="margin:0 0 20px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <p style="margin:0 0 20px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${etaText}</p>
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${directContact(isPt, a)}</p>
    `, a);
}

/* ── Step 6: Arte final ready + booking ── */

function buildSketchEmail({ isPt, name, sketch_url, duration, session_url, a }: { isPt: boolean; name: string; sketch_url: string; duration: string; session_url: string; a: ArtistConfig }) {
  const para1 = isPt
    ? 'O teu estudo está pronto e estou muito orgulhosa do resultado! Espero que gostes tanto quanto eu — criei-o a pensar em ti.'
    : "Your study is ready and I'm so proud of how it turned out! I hope you love it as much as I do — I created it with you in mind.";

  const durationText = isPt
    ? `A sessão tem duração estimada de <strong>${duration}</strong>. Escolhe o dia que te der mais jeito no link abaixo:`
    : `The session has an estimated duration of <strong>${duration}</strong>. Pick the day that works best for you:`;

  const para3 = isPt
    ? `Se tiveres alguma dúvida sobre o estudo ou quiseres ajustar algum detalhe, não hesites em falar comigo — responde a este email ou envia mensagem no <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a>.`
    : `If you have any questions about the study or want to adjust any detail, don't hesitate to reach out — reply to this email or message me on <a href="${a.instagram}" style="color:#A77049;text-decoration:underline;">Instagram</a>.`;

  return buildEmail(isPt, name, `
        <p style="margin:0 0 24px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <img src="${sketch_url}" alt="Estudo" style="width:100%;max-width:464px;border-radius:16px;margin:0 0 28px;display:block;" />
        <p style="margin:0 0 24px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${durationText}</p>
        ${btn(session_url, isPt ? 'Marcar Sessão' : 'Book Session')}
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para3}</p>
    `, a);
}

/* ── Step 7: Session confirmed + pre-session tips ── */

function buildSessionEmail({ isPt, name, session_date, duration, a }: { isPt: boolean; name: string; session_date: string; duration: string; a: ArtistConfig }) {
  const para1 = isPt
    ? 'A tua sessão está oficialmente confirmada! Estou muito entusiasmada para te conhecer e dar vida a esta peça.'
    : "Your session is officially confirmed! I'm so excited to meet you and bring this piece to life.";

  return buildEmail(isPt, name, `
        <p style="margin:0 0 24px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 32px;">
          <tr>
            <td style="border-left:2px solid #A77049;padding:12px 20px;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Data' : 'Date'}</p>
              <p style="margin:0 0 12px;font-size:20px;font-weight:300;color:#1E1713;">${session_date}</p>
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Duração estimada' : 'Estimated duration'}</p>
              <p style="margin:0;font-size:20px;font-weight:300;color:#1E1713;">${duration}</p>
            </td>
          </tr>
        </table>
        ${preSessionTips(isPt)}
        <p style="margin:0 0 20px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${lumiLink(isPt)}</p>
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${directContact(isPt, a)}</p>
    `, a);
}

/* ── Step 8: Day-before reminder ── */

function buildReminderEmail({ isPt, name, session_date, duration, a }: { isPt: boolean; name: string; session_date: string; duration: string; a: ArtistConfig }) {
  const para1 = isPt
    ? 'O grande dia está quase a chegar! Só te queria lembrar que a tua sessão é <strong>amanhã</strong>.'
    : "The big day is almost here! Just a friendly reminder that your session is <strong>tomorrow</strong>.";

  const para2 = isPt
    ? 'Estou ansiosa por te receber e criar algo lindo juntas!'
    : "I can't wait to welcome you and create something beautiful together!";

  return buildEmail(isPt, name, `
        <p style="margin:0 0 24px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 32px;">
          <tr>
            <td style="border-left:2px solid #A77049;padding:12px 20px;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Data' : 'Date'}</p>
              <p style="margin:0 0 12px;font-size:20px;font-weight:300;color:#1E1713;">${session_date}</p>
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#BFA08C;">${isPt ? 'Duração estimada' : 'Estimated duration'}</p>
              <p style="margin:0;font-size:20px;font-weight:300;color:#1E1713;">${duration}</p>
            </td>
          </tr>
        </table>
        ${preSessionTips(isPt)}
        <p style="margin:0 0 20px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${lumiLink(isPt)}</p>
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para2}</p>
    `, a);
}

/* ── Step 9: Aftercare + Google review ── */

function buildAftercareEmail({ isPt, name, a }: { isPt: boolean; name: string; a: ArtistConfig }) {
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
        ${btn('https://share.google/XwF5Gg3xCGjqV1AZ2', isPt ? 'Deixar Avaliação' : 'Leave a Review')}
    `, a);
}

/* ── Step 10: Reschedule / cancel ── */

function buildRescheduleEmail({ isPt, name, a }: { isPt: boolean; name: string; a: ArtistConfig }) {
  const para1 = isPt
    ? 'Estou a contactar-te porque preciso de reagendar a tua sessão. Peço desculpa por qualquer inconveniente — quero garantir que temos o tempo e as condições perfeitas para a tua peça.'
    : "I'm reaching out because I need to reschedule your session. I apologize for any inconvenience — I want to make sure we have the perfect time and conditions for your piece.";

  const para2 = isPt
    ? 'Escolhe uma nova data que te dê jeito no link abaixo:'
    : 'Pick a new date that works for you using the link below:';

  return buildEmail(isPt, name, `
        <p style="margin:0 0 24px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <p style="margin:0 0 24px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para2}</p>
        ${btn(a.cal, isPt ? 'Escolher Nova Data' : 'Pick a New Date')}
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${directContact(isPt, a)}</p>
    `, a);
}

/* ── Step 11: Healing check-in (7 days after session) ── */

function buildHealingCheckEmail({ isPt, name, a }: { isPt: boolean; name: string; a: ArtistConfig }) {
  const para1 = isPt
    ? 'Já passou uma semana desde a tua sessão e queria saber como está a correr a cicatrização! Espero que esteja tudo bem.'
    : "It's been a week since your session and I wanted to check in on how the healing is going! I hope everything is looking great.";

  const para2 = isPt
    ? 'Se puderes, adorava ver como está a ficar! Envia-me uma fotinha por aqui, pelo Instagram ou pelo WhatsApp — fico sempre curiosa para ver o resultado final.'
    : "If you can, I'd love to see how it's looking! Send me a photo here, on Instagram, or on WhatsApp — I'm always curious to see the final result.";

  const para3 = isPt
    ? 'Lembra-te: se notares algo fora do normal durante a cicatrização, não hesites em contactar-me. Estou sempre aqui para ajudar!'
    : "Remember: if you notice anything unusual during the healing process, don't hesitate to reach out. I'm always here to help!";

  return buildEmail(isPt, name, `
        <p style="margin:0 0 24px;font-size:14px;color:#1E1713;line-height:1.8;font-weight:300;">${para1}</p>
        <p style="margin:0 0 24px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para2}</p>
        <p style="margin:0 0 48px;font-size:14px;color:#806A58;line-height:1.8;font-weight:300;">${para3}</p>
    `, a);
}
