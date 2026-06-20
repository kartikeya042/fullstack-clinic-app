const express = require('express')
const multer = require('multer')
const { bookAppointment } = require('../controllers/appointmentController')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
})

router.post('/book', upload.single('reportFile'), bookAppointment)

module.exports = router
