const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: decoded.id,
      role: decoded.role,
      must_change_password: decoded.must_change_password,
    }
    next()
  } catch {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { authenticateToken }
