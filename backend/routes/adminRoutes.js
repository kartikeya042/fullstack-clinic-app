const express = require('express')
const {
  getAppointments,
  confirmAppointment,
  cancelAppointment,
  downloadReport,
} = require('../controllers/adminController')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

router.get('/appointments', authenticateToken, getAppointments)
router.patch('/appointments/:id/confirm', authenticateToken, confirmAppointment)
router.patch('/appointments/:id/cancel', authenticateToken, cancelAppointment)
router.get('/appointments/:id/report', authenticateToken, downloadReport)

module.exports = router
