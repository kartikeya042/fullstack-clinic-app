let prismaPromise

async function getPrisma() {
  if (!prismaPromise) {
    prismaPromise = import('../lib/prisma.mjs').then((module) => module.prisma)
  }
  return prismaPromise
}

function formatAppointment(appointment) {
  const { report_pdf, ...rest } = appointment
  return {
    ...rest,
    hasReportPdf: Boolean(report_pdf),
  }
}

async function getAppointments(req, res) {
  try {
    if (!['DOCTOR', 'RECEPTIONIST'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const { date } = req.query

    if (!date) {
      return res.status(400).json({ error: 'date query parameter is required (YYYY-MM-DD)' })
    }

    const startOfDay = new Date(`${date}T00:00:00.000Z`)
    const endOfDay = new Date(`${date}T23:59:59.999Z`)

    const prisma = await getPrisma()
    const appointments = await prisma.appointment.findMany({
      where: {
        appointment_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        patient: true,
        records: true,
      },
      orderBy: { appointment_date: 'asc' },
    })

    return res.json({
      appointments: appointments.map(formatAppointment),
    })
  } catch (error) {
    console.error('Get appointments error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function confirmAppointment(req, res) {
  try {
    if (req.user.role !== 'RECEPTIONIST') {
      return res.status(403).json({ error: 'Only receptionists can confirm appointments' })
    }

    const { id } = req.params
    const prisma = await getPrisma()

    const existing = await prisma.appointment.findUnique({ where: { id } })

    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' })
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'CONFIRMED' },
      include: {
        patient: true,
        records: true,
      },
    })

    return res.json({ appointment: formatAppointment(updated) })
  } catch (error) {
    console.error('Confirm appointment error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function cancelAppointment(req, res) {
  try {
    if (req.user.role !== 'RECEPTIONIST') {
      return res.status(403).json({ error: 'Only receptionists can cancel appointments' })
    }

    const { id } = req.params
    const prisma = await getPrisma()

    const existing = await prisma.appointment.findUnique({ where: { id } })

    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' })
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    return res.status(200).json({ success: true, status: 'CANCELLED' })
  } catch (error) {
    console.error('Cancel appointment error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function downloadReport(req, res) {
  try {
    if (!['DOCTOR', 'RECEPTIONIST'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const { id } = req.params
    const prisma = await getPrisma()

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: { report_pdf: true },
    })

    if (!appointment?.report_pdf) {
      return res.status(404).json({ error: 'No uploaded report found for this appointment' })
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="medical-report-${id}.pdf"`)
    return res.send(Buffer.from(appointment.report_pdf))
  } catch (error) {
    console.error('Download report error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getAppointments, confirmAppointment, cancelAppointment, downloadReport }
