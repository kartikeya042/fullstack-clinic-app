const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const adminRoutes = require('./routes/adminRoutes')
const staffRoutes = require('./routes/staffRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Doctor Clinic API is running' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/health/db', async (req, res) => {
  try {
    const { prisma } = await import('./lib/prisma.mjs')
    await prisma.$queryRaw`SELECT 1`
    return res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    console.error('Database health check failed:', error)
    return res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/staff', staffRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
