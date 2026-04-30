export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const nome = body.nome;
    const email = body.email;
    const telefone = body.telefone;

    // Roda as duas funções em paralelo para ser mais rápido
    await Promise.all([
      salvarNoSheets(nome, email, telefone, context),
      enviarTelegram(nome, email, telefone, context)
    ]);

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

async function salvarNoSheets(nome, email, telefone, context) {
  await fetch(context.env.SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, telefone })
  });
}

// Substituímos o WhatsApp pelo Telegram (100% Grátis)
async function enviarTelegram(nome, email, telefone, context) {
  const botToken = context.env.TELEGRAM_BOT_TOKEN;
  const chatId = context.env.TELEGRAM_CHAT_ID;
  
  const mensagem = `🚨 *Novo Lead Recebido!*\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n*Telefone:* ${telefone}`;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: mensagem,
      parse_mode: "Markdown"
    })
  });
}