const bcrypt = require('bcrypt')

let prismaPromise

async function getPrisma() {
  if (!prismaPromise) {
    prismaPromise = import('../lib/prisma.mjs').then((module) => module.prisma)
  }
  return prismaPromise
}

function normalizeMobile(value = '') {
  return value.replace(/\D/g, '')
}

function generatePassword() {
  return `Care@${Math.floor(1000 + Math.random() * 9000)}`
}

function generateAlphaNumber() {
  return `DC-${Math.floor(10000 + Math.random() * 90000)}`
}

async function generateUniqueAlphaNumber(tx) {
  let alphaNumber = generateAlphaNumber()
  let exists = await tx.patient.findUnique({ where: { alpha_number: alphaNumber } })

  while (exists) {
    alphaNumber = generateAlphaNumber()
    exists = await tx.patient.findUnique({ where: { alpha_number: alphaNumber } })
  }

  return alphaNumber
}

function logCredentials({ email, alphaNumber, generatedPassword }) {
  console.log(`
╔══════════════════════════════════════════════╗
║         NEW PATIENT CREDENTIALS              ║
╠══════════════════════════════════════════════╣
║  Email:     ${email.padEnd(32)}║
║  Alpha ID:  ${alphaNumber.padEnd(32)}║
║  Password:  ${generatedPassword.padEnd(32)}║
╚══════════════════════════════════════════════╝
`)
}

async function bookAppointment(req, res) {
  try {
    const prisma = await getPrisma()
    const isFirst = req.body.isFirstVisit === 'true'
    const { fullName, email, appointmentDate, alphaNumber } = req.body
    const mobileNumber = normalizeMobile(req.body.mobileNumber)

    if (!appointmentDate) {
      return res.status(400).json({ error: 'Appointment date is required.' })
    }

    const parsedDate = new Date(appointmentDate)
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid appointment date.' })
    }

    if (isFirst) {
      if (!fullName?.trim() || !email?.trim() || !mobileNumber) {
        return res.status(400).json({ error: 'Full name, email, and mobile number are required.' })
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      })

      const existingPatient = await prisma.patient.findFirst({
        where: { mobile_number: mobileNumber },
      })

      if (existingUser || existingPatient) {
        return res.status(400).json({ error: 'User with this email or mobile already exists' })
      }

      const generatedPassword = generatePassword()
      const passwordHash = await bcrypt.hash(generatedPassword, 10)
      const uniqueAlphaNumber = await generateUniqueAlphaNumber(prisma)

      await prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            email: email.trim().toLowerCase(),
            password_hash: passwordHash,
            role: 'PATIENT',
            must_change_password: true,
            patient: {
              create: {
                full_name: fullName.trim(),
                mobile_number: mobileNumber,
                alpha_number: uniqueAlphaNumber,
                appointments: {
                  create: {
                    appointment_date: parsedDate,
                    status: 'PENDING',
                    is_first_visit: true,
                    report_pdf: req.file ? req.file.buffer : null,
                  },
                },
              },
            },
          },
        })
      })

      logCredentials({
        email: email.trim().toLowerCase(),
        alphaNumber: uniqueAlphaNumber,
        generatedPassword,
      })

      return res.status(201).json({
        success: true,
        isFirstVisit: true,
        alphaNumber: uniqueAlphaNumber,
        generatedPassword,
        email: email.trim().toLowerCase(),
      })
    }

    const normalizedAlpha = alphaNumber?.trim().toUpperCase()

    if (!mobileNumber && !normalizedAlpha) {
      return res.status(400).json({
        error: 'Mobile number or alpha number is required for returning patients.',
      })
    }

    const orConditions = []
    if (mobileNumber) orConditions.push({ mobile_number: mobileNumber })
    if (normalizedAlpha) orConditions.push({ alpha_number: normalizedAlpha })

    const foundPatient = await prisma.patient.findFirst({
      where: { OR: orConditions },
    })

    if (!foundPatient) {
      return res.status(404).json({
        error: 'Patient record not found. Please verify your Mobile or Alpha Number.',
      })
    }

    await prisma.appointment.create({
      data: {
        patientId: foundPatient.id,
        appointment_date: parsedDate,
        status: 'PENDING',
        is_first_visit: false,
      },
    })

    return res.status(201).json({
      success: true,
      isFirstVisit: false,
      patientName: foundPatient.full_name,
    })
  } catch (error) {
    console.error('Book appointment error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { bookAppointment }
