export async function onRequestPost(context) {
  const body = await context.request.json()

  const nome = body.nome
  const telefone = body.telefone

  // 1 salvar no sheets
  await salvarNoSheets(nome, telefone)

  // 2 enviar whatsapp
  await enviarWhatsapp(nome, telefone)

  return new Response("ok")
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads")

  const data = JSON.parse(e.postData.contents)

  sheet.appendRow([
    new Date(),
    data.nome,
    data.telefone
  ])

  return ContentService.createTextOutput("OK")
}