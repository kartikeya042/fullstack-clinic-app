const express = require('express')
const multer = require('multer')
const { bookAppointment, getPatientAppointments } = require('../controllers/appointmentController')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
})

router.get('/me', authenticateToken, getPatientAppointments)
router.post('/book', upload.single('reportFile'), bookAppointment)

module.exports = router
