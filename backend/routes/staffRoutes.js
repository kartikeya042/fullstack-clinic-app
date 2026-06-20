const express = require('express')
const { finalizeAppointment } = require('../controllers/staffController')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

router.post('/appointments/:id/finalize', authenticateToken, finalizeAppointment)

module.exports = router
