import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../config/api'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

function AdminLogin() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    if (!toast.message) return undefined
    const timer = setTimeout(() => setToast({ message: '', type: 'success' }), 4000)
    return () => clearTimeout(timer)
  }, [toast.message])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password })
      const { token, user } = response.data

      if (user.role === 'PATIENT') {
        logout()
        setToast({
          message: 'Access Denied: Customer accounts cannot access the staff portal.',
          type: 'error',
        })
        return
      }

      login(token, user)

      if (user.must_change_password) {
        navigate('/change-password')
        return
      }

      if (user.role === 'DOCTOR') {
        navigate('/portal/doctor')
      } else if (user.role === 'RECEPTIONIST') {
        navigate('/portal/receptionist')
      } else {
        logout()
        setToast({ message: 'Access Denied: Unauthorized staff role.', type: 'error' })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/20 text-2xl text-teal-300">
            ✚
          </div>
          <h1 className="text-2xl font-bold text-white">Doctor Clinic Staff Portal</h1>
          <p className="mt-2 text-sm text-slate-400">
            Authorized doctors and receptionists only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="staff-email" className="mb-1.5 block text-sm font-medium text-slate-300">
              Staff Email
            </label>
            <input
              id="staff-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30"
              placeholder="staff@doctorclinic.com"
            />
          </div>

          <div>
            <label
              htmlFor="staff-password"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <input
              id="staff-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In to Staff Portal'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Patient?{' '}
          <Link to="/login" className="font-medium text-teal-300 hover:text-teal-200 hover:underline">
            Go to patient login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
