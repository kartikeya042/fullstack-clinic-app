import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import Toast from './Toast'

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function getRecordByType(records, type) {
  return records?.find((record) => record.type === type) ?? null
}

function StaffDashboardLayout({ role, title }) {
  const { token, user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(getTodayDate)
  const [appointments, setAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmingId, setConfirmingId] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [sendEmail, setSendEmail] = useState(true)
  const [sendWhatsApp, setSendWhatsApp] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const [prescription, setPrescription] = useState('')
  const [invoiceDetails, setInvoiceDetails] = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState('')

  const isReceptionist = role === 'RECEPTIONIST'
  const prescriptionReadOnly = isReceptionist

  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get(`${API_URL}/api/admin/appointments`, {
        params: { date: selectedDate },
        headers: authHeaders,
      })

      setAppointments(response.data.appointments)
      setSelectedAppointment((current) => {
        if (!current) return null
        return response.data.appointments.find((item) => item.id === current.id) ?? null
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load appointments.')
      setAppointments([])
      setSelectedAppointment(null)
    } finally {
      setLoading(false)
    }
  }, [selectedDate, token])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  useEffect(() => {
    if (!selectedAppointment) {
      setPrescription('')
      setInvoiceDetails('')
      setInvoiceAmount('')
      return
    }

    const prescriptionRecord = getRecordByType(selectedAppointment.records, 'PRESCRIPTION')
    const invoiceRecord = getRecordByType(selectedAppointment.records, 'INVOICE')

    setPrescription(prescriptionRecord?.text_content ?? '')
    setInvoiceDetails(invoiceRecord?.text_content ?? '')
    setInvoiceAmount(invoiceRecord?.amount ? String(invoiceRecord.amount) : '')
  }, [selectedAppointment])

  useEffect(() => {
    if (!toast.message) return undefined
    const timer = setTimeout(() => setToast({ message: '', type: 'success' }), 4000)
    return () => clearTimeout(timer)
  }, [toast.message])

  async function handleConfirmBooking(appointmentId) {
    setConfirmingId(appointmentId)

    try {
      const response = await axios.patch(
        `${API_URL}/api/admin/appointments/${appointmentId}/confirm`,
        {},
        { headers: authHeaders },
      )

      const updated = response.data.appointment
      setAppointments((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setSelectedAppointment((current) => (current?.id === updated.id ? updated : current))
      setToast({ message: 'Booking confirmed successfully.', type: 'success' })
    } catch (err) {
      setToast({
        message: err.response?.data?.error || 'Unable to confirm booking.',
        type: 'error',
      })
    } finally {
      setConfirmingId(null)
    }
  }

  async function handleCancelBooking(appointmentId) {
    const confirmed = window.confirm('Are you sure you want to cancel this appointment?')
    if (!confirmed) return

    setCancellingId(appointmentId)

    try {
      await axios.patch(
        `${API_URL}/api/admin/appointments/${appointmentId}/cancel`,
        {},
        { headers: authHeaders },
      )

      setAppointments((current) =>
        current.map((item) =>
          item.id === appointmentId ? { ...item, status: 'CANCELLED' } : item,
        ),
      )
      setSelectedAppointment((current) =>
        current?.id === appointmentId ? { ...current, status: 'CANCELLED' } : current,
      )
      setToast({ message: 'Appointment canceled', type: 'error' })
    } catch (err) {
      setToast({
        message: err.response?.data?.error || 'Unable to cancel appointment.',
        type: 'error',
      })
    } finally {
      setCancellingId(null)
    }
  }

  async function handleDownloadReport() {
    if (!selectedAppointment?.hasReportPdf) return

    try {
      const response = await axios.get(
        `${API_URL}/api/admin/appointments/${selectedAppointment.id}/report`,
        {
          headers: authHeaders,
          responseType: 'blob',
        },
      )

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `medical-report-${selectedAppointment.id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      setToast({ message: 'Unable to download report.', type: 'error' })
    }
  }

  async function handleSaveAction() {
    if (!selectedAppointment || isSaving) return

    setIsSaving(true)

    try {
      const response = await axios.post(
        `${API_URL}/api/staff/appointments/${selectedAppointment.id}/finalize`,
        {
          prescriptionText: prescription,
          invoiceDetails,
          invoiceAmount,
          sendEmail,
          sendWhatsApp,
        },
        { headers: authHeaders },
      )

      const updated = response.data.appointment

      setAppointments((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setSelectedAppointment(updated)
      setToast({ message: 'Document generated & dispatched successfully!', type: 'success' })
    } catch (err) {
      setToast({
        message: err.response?.data?.error || 'Unable to generate and send document.',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  function statusBadge(status) {
    if (status === 'CANCELLED') {
      return (
        <span className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold tracking-wide text-slate-500">
          [ CANCELLED ]
        </span>
      )
    }

    const styles = {
      PENDING: 'bg-amber-100 text-amber-800',
      CONFIRMED: 'bg-emerald-100 text-emerald-800',
      COMPLETED: 'bg-slate-200 text-slate-700',
    }

    const pulseDot =
      status === 'PENDING' ? (
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
      ) : status === 'CONFIRMED' ? (
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      ) : null

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.PENDING}`}
      >
        {pulseDot}
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-100 py-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">Signed in as {user?.email}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              Appointment Date
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value)
                  setSelectedAppointment(null)
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Patients for {selectedDate}</h2>

            {loading ? (
              <p className="text-sm text-slate-500">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="text-sm text-slate-500">No appointments scheduled for this date.</p>
            ) : (
              <ul className="space-y-3">
                {appointments.map((appointment) => {
                  const isCancelled = appointment.status === 'CANCELLED'

                  return (
                  <li key={appointment.id}>
                    <div
                      className={`rounded-xl border p-4 ${
                        isCancelled
                          ? 'border-slate-200 bg-slate-50 opacity-60'
                          : selectedAppointment?.id === appointment.id
                            ? 'cursor-pointer border-teal-600 bg-teal-50 ring-2 ring-teal-100 transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:shadow-md active:translate-y-0'
                            : 'cursor-pointer border-slate-200 transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-slate-50 hover:shadow-md active:translate-y-0'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(appointment)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`font-semibold ${isCancelled ? 'text-slate-500' : 'text-slate-900'}`}>
                              {appointment.patient.full_name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {appointment.patient.alpha_number}
                            </p>
                          </div>
                          {statusBadge(appointment.status)}
                        </div>
                      </button>

                      {isReceptionist && appointment.status === 'PENDING' && (
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmBooking(appointment.id)}
                            disabled={confirmingId === appointment.id || cancellingId === appointment.id}
                            className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {confirmingId === appointment.id ? (
                              <>
                                <LoadingSpinner />
                                Confirming...
                              </>
                            ) : (
                              'Confirm Booking'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(appointment.id)}
                            disabled={confirmingId === appointment.id || cancellingId === appointment.id}
                            className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition-all duration-150 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {cancellingId === appointment.id ? (
                              <>
                                <LoadingSpinner />
                                Canceling...
                              </>
                            ) : (
                              'Cancel'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {!selectedAppointment ? (
              <div className="flex h-full min-h-[420px] items-center justify-center text-center">
                <div>
                  <p className="text-lg font-medium text-slate-700">Select a patient</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Choose an appointment from the list to view details and manage records.
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={selectedAppointment.id}
                className="animate-panel-slide-in space-y-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedAppointment.patient.full_name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Mobile: {selectedAppointment.patient.mobile_number}
                    </p>
                    <p className="text-sm text-slate-600">
                      Alpha Number: {selectedAppointment.patient.alpha_number}
                    </p>
                  </div>
                  {statusBadge(selectedAppointment.status)}
                </div>

                {selectedAppointment.hasReportPdf ? (
                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
                  >
                    Download Uploaded Report
                  </button>
                ) : (
                  <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    No uploaded medical report for this appointment.
                  </p>
                )}

                <div>
                  <label
                    htmlFor="prescription"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Doctor&apos;s Prescription
                  </label>
                  <textarea
                    id="prescription"
                    rows={5}
                    value={prescription}
                    readOnly={prescriptionReadOnly}
                    onChange={(event) => setPrescription(event.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                      prescriptionReadOnly
                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-600'
                        : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                    }`}
                    placeholder={
                      prescriptionReadOnly
                        ? 'Prescription will appear here after the doctor saves it.'
                        : 'Enter prescription notes...'
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="invoiceDetails"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Billing Invoice Details
                    </label>
                    <input
                      id="invoiceDetails"
                      type="text"
                      value={invoiceDetails}
                      onChange={(event) => setInvoiceDetails(event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="Consultation, lab tests, medications..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="invoiceAmount"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Billing Amount (INR)
                    </label>
                    <input
                      id="invoiceAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={invoiceAmount}
                      onChange={(event) => setInvoiceAmount(event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-200 pt-5">
                  <div className="flex flex-wrap items-center gap-6 px-1">
                    <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={(event) => setSendEmail(event.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Send PDF via Email
                    </label>

                    <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={sendWhatsApp}
                        onChange={(event) => setSendWhatsApp(event.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Send PDF via WhatsApp
                    </label>
                  </div>

                  <button
                    type="button"
                    disabled={isSaving || (!prescription && !invoiceDetails)}
                    onClick={handleSaveAction}
                    className="w-full self-start rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-700 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSaving ? 'Saving & Dispatching...' : 'Save & Dispatch Document'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboardLayout
