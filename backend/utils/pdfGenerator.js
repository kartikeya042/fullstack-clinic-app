const PDFDocument = require('pdfkit')

function generateClinicPDF(patient, prescriptionText, invoiceDetails, invoiceAmount, doctorEmail) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const buffers = []

    doc.on('data', (chunk) => buffers.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const amount = parseFloat(invoiceAmount) || 0

    doc.font('Helvetica-Bold').fontSize(24).fillColor('#0f766e').text('DOCTOR CLINIC', {
      align: 'center',
    })
    doc.moveDown(0.3)
    doc
      .font('Helvetica-Oblique')
      .fontSize(10)
      .fillColor('#475569')
      .text('Compassionate Care • Modern Diagnostics • Patient First', { align: 'center' })
    doc.moveDown(1.5)

    doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text('Patient Information')
    doc.moveDown(0.4)
    doc.font('Helvetica').fontSize(11).fillColor('#334155')
    doc.text(`Full Name: ${patient.full_name}`)
    doc.text(`Alpha Number: ${patient.alpha_number}`)
    doc.text(`Date of Visit: ${formattedDate}`)
    if (doctorEmail) {
      doc.text(`Attending Physician: ${doctorEmail}`)
    }

    doc.moveDown(0.8)
    const lineY = doc.y
    doc
      .strokeColor('#94a3b8')
      .lineWidth(1)
      .moveTo(50, lineY)
      .lineTo(doc.page.width - 50, lineY)
      .stroke()
    doc.moveDown(1)

    doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a').text('Prescription Notes')
    doc.moveDown(0.4)
    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor('#334155')
      .text(prescriptionText?.trim() || 'No prescription notes provided.', {
        align: 'left',
        lineGap: 4,
      })

    doc.moveDown(1.5)
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a').text('Billing Invoice')
    doc.moveDown(0.4)
    doc.font('Helvetica').fontSize(11).fillColor('#334155')
    doc.text(`Service Details: ${invoiceDetails?.trim() || 'General consultation'}`)
    doc.moveDown(0.3)
    doc.font('Helvetica-Bold').fontSize(12).text(`Total Amount Due: $${amount.toFixed(2)}`)

    doc.moveDown(2)
    doc
      .font('Helvetica-Oblique')
      .fontSize(9)
      .fillColor('#64748b')
      .text('This document is generated electronically by Doctor Clinic. Please retain for your records.', {
        align: 'center',
      })

    doc.end()
  })
}

module.exports = { generateClinicPDF }
