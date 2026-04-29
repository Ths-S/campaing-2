export async function onRequestPost(context) {
  try {
    const body = await context.request.json()

    const nome = body.nome
    const telefone = body.telefone

    await salvarNoSheets(nome, telefone, context)
    await enviarWhatsapp(nome, telefone, context)

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}

async function salvarNoSheets(nome, telefone, context) {
  await fetch(context.env.SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome,
      telefone
    })
  })
}

async function enviarWhatsapp(nome, telefone, context) {
  await fetch("https://api.z-api.io/instances/SEU_ID/token/SEU_TOKEN/send-text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone: "5531999999999",
      message: `Novo lead:\nNome: ${nome}\nTelefone: ${telefone}`
    })
  })
}