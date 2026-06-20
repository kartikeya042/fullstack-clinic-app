const { generateClinicPDF } = require('../utils/pdfGenerator')
const { sendWhatsAppDocument } = require('../utils/whatsappService')
const { sendClinicEmail } = require('../utils/emailService')

let prismaPromise

async function getPrisma() {
  if (!prismaPromise) {
    prismaPromise = import('../lib/prisma.mjs').then((module) => module.prisma)
  }
  return prismaPromise
}

function formatAppointment(appointment) {
  const { report_pdf, ...rest } = appointment
  const records = appointment.records?.map(({ pdf_buffer, ...record }) => ({
    ...record,
    hasPdf: Boolean(pdf_buffer),
    amount: record.amount ? String(record.amount) : null,
  }))

  return {
    ...rest,
    hasReportPdf: Boolean(report_pdf),
    records,
  }
}

async function finalizeAppointment(req, res) {
  try {
    if (!['DOCTOR', 'RECEPTIONIST'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const { id } = req.params
    const { prescriptionText, invoiceDetails, invoiceAmount, sendMethod } = req.body

    if (!['EMAIL', 'WHATSAPP'].includes(sendMethod)) {
      return res.status(400).json({ error: 'sendMethod must be EMAIL or WHATSAPP' })
    }

    const prisma = await getPrisma()

    const staffUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true },
    })

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        records: true,
      },
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' })
    }

    if (appointment.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Cannot finalize a cancelled appointment' })
    }

    const pdfBuffer = await generateClinicPDF(
      appointment.patient,
      prescriptionText,
      invoiceDetails,
      invoiceAmount,
      staffUser?.email,
    )

    const fileName = `clinic-summary-${appointment.patient.alpha_number}.pdf`
    const message = `Dear ${appointment.patient.full_name}, please find attached your visit summary from Doctor Clinic. Thank you for choosing us.`

    await prisma.$transaction(async (tx) => {
      await tx.record.deleteMany({ where: { appointmentId: id } })

      await tx.appointment.update({
        where: { id },
        data: { status: 'COMPLETED' },
      })

      await tx.record.create({
        data: {
          appointmentId: id,
          type: 'PRESCRIPTION',
          text_content: prescriptionText || '',
          pdf_buffer: pdfBuffer,
        },
      })

      await tx.record.create({
        data: {
          appointmentId: id,
          type: 'INVOICE',
          text_content: invoiceDetails || '',
          amount: parseFloat(invoiceAmount) || 0,
        },
      })
    })

    if (sendMethod === 'WHATSAPP') {
      await sendWhatsAppDocument(
        appointment.patient.mobile_number,
        message,
        pdfBuffer,
        fileName,
      )
    } else {
      await sendClinicEmail(
        appointment.patient.user.email,
        'Your Doctor Clinic Visit Summary',
        message,
        pdfBuffer,
        fileName,
      )
    }

    const updated = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        records: true,
      },
    })

    return res.json({
      success: true,
      appointment: formatAppointment(updated),
    })
  } catch (error) {
    console.error('Finalize appointment error:', error)
    return res.status(500).json({
      error: error.response?.data?.message || error.message || 'Internal server error',
    })
  }
}

module.exports = { finalizeAppointment }
