const axios = require('axios')
const FormData = require('form-data')

const WHATSAPP_URL = 'https://whatsapp-service-497h.onrender.com/send-document'

async function sendWhatsAppDocument(mobile, message, pdfBuffer, fileName) {
  const form = new FormData()
  form.append('mobile', mobile)
  form.append('message', message)
  form.append('fileName', fileName)
  form.append('file', pdfBuffer, {
    filename: fileName,
    contentType: 'application/pdf',
  })

  const response = await axios.post(WHATSAPP_URL, form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  })

  return response.data
}

module.exports = { sendWhatsAppDocument }
