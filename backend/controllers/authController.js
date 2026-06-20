const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let prismaPromise

async function getPrisma() {
  if (!prismaPromise) {
    prismaPromise = import('../lib/prisma.mjs').then((module) => module.prisma)
  }
  return prismaPromise
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      must_change_password: user.must_change_password,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' },
  )
}

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    must_change_password: user.must_change_password,
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const prisma = await getPrisma()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user)

    return res.json({
      token,
      user: formatUser(user),
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

async function changePassword(req, res) {
  try {
    const { newPassword } = req.body

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const prisma = await getPrisma()
    const passwordHash = await bcrypt.hash(newPassword, 10)

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password_hash: passwordHash,
        must_change_password: false,
      },
    })

    const token = signToken(updatedUser)

    return res.json({
      token,
      user: formatUser(updatedUser),
    })
  } catch (error) {
    console.error('Change password error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { login, changePassword }
