const nodemailer = require('nodemailer')

async function sendClinicEmail(toEmail, subject, text, pdfBuffer, fileName) {
  if (!process.env.SMTP_USER) {
    console.log(`
╔══════════════════════════════════════════════╗
║         SIMULATED EMAIL DELIVERY             ║
╠══════════════════════════════════════════════╣
║  To:       ${toEmail.padEnd(32)}║
║  Subject:  ${subject.slice(0, 32).padEnd(32)}║
║  Attachment: ${fileName.slice(0, 30).padEnd(30)}║
╚══════════════════════════════════════════════╝
`)
    console.log(`[SIMULATED EMAIL] Body: ${text}`)
    return { simulated: true, success: true }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject,
    text,
    attachments: [
      {
        filename: fileName,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })

  return { simulated: false, messageId: info.messageId }
}

module.exports = { sendClinicEmail }
