const express = require('express')
const { login, changePassword } = require('../controllers/authController')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

router.post('/login', login)
router.post('/change-password', authenticateToken, changePassword)

module.exports = router
