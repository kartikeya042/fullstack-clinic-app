import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'

function getRecordByType(records, type) {
  return records?.find((record) => record.type === type) ?? null
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function statusBadge(status) {
  const styles = {
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-emerald-100 text-emerald-800',
    COMPLETED: 'bg-slate-200 text-slate-700',
    CANCELLED: 'bg-slate-100 text-slate-500 line-through',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${styles[status] || styles.PENDING}`}
    >
      {status}
    </span>
  )
}

function PatientPortal() {
  const { user, token } = useAuth()
  const { openBooking } = useBooking()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get(`${API_URL}/api/appointments/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAppointments(response.data.appointments)
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load your appointments.')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  useEffect(() => {
    if (!toast.message) return undefined
    const timer = setTimeout(() => setToast({ message: '', type: 'success' }), 4000)
    return () => clearTimeout(timer)
  }, [toast.message])

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-100 py-8">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patient Portal</h1>
            <p className="mt-1 text-sm text-slate-600">{user?.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + Book Appointment
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
            <LoadingSpinner className="h-8 w-8" />
            <span className="ml-3 text-sm font-medium text-slate-600">Loading your appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
            <p className="text-4xl">📅</p>
            <p className="mt-4 text-lg font-semibold text-slate-800">
              You have no booking history with Doctor Clinic yet.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Book your first appointment to get started.
            </p>
            <button
              type="button"
              onClick={openBooking}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {appointments.map((appointment) => {
              const prescription = getRecordByType(appointment.records, 'PRESCRIPTION')
              const invoice = getRecordByType(appointment.records, 'INVOICE')

              return (
                <article
                  key={appointment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-teal-700">
                        {formatDate(appointment.appointment_date)}
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-slate-900">
                        {appointment.patient.full_name}
                      </h2>
                      <p className="mt-1 text-xs font-semibold tracking-wide text-slate-500">
                        {appointment.patient.alpha_number}
                      </p>
                    </div>
                    {statusBadge(appointment.status)}
                  </div>

                  {prescription?.text_content && (
                    <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
                        Rx / Doctor&apos;s Notes
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        {prescription.text_content}
                      </p>
                    </div>
                  )}

                  {invoice && (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-sm font-bold text-slate-800">
                        Total Billed:{' '}
                        <span className="text-emerald-700">
                          ${parseFloat(invoice.amount || 0).toFixed(2)}
                        </span>
                      </p>
                      {invoice.text_content && (
                        <p className="mt-1 text-xs text-slate-500">{invoice.text_content}</p>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientPortal
