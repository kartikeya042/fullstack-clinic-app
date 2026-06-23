import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../config/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'

function Login() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    if (!toast.message) return undefined
    const timer = setTimeout(() => setToast({ message: '', type: 'success' }), 5000)
    return () => clearTimeout(timer)
  }, [toast.message])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password })
      const { token, user } = response.data

      if (user.role !== 'PATIENT') {
        logout()
        setToast({
          message:
            'Security Guard: Staff accounts cannot use the Patient doorway. Please sign in via the Staff Portal (/admin/login).',
          type: 'error',
        })
        setTimeout(() => navigate('/admin/login'), 2000)
        return
      }

      login(token, user)

      if (user.must_change_password) {
        navigate('/change-password')
      } else {
        navigate('/portal/patient')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your clinic portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="you@clinic.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Staff member?{' '}
          <Link to="/admin/login" className="font-medium text-teal-700 hover:underline">
            Admin login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
