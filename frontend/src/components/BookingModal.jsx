import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const INITIAL_FORM = {
  fullName: '',
  email: '',
  mobileNumber: '',
  alphaNumber: '',
  appointmentDate: '',
  reportFile: null,
}

function normalizeMobile(value) {
  return value.replace(/\D/g, '')
}

function isValidMobile(value) {
  const digits = normalizeMobile(value)
  return digits.length >= 10 && digits.length <= 15
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPdfFile(file) {
  if (!file) return true
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

function isFutureOrTodayDate(value) {
  if (!value) return false
  const selected = new Date(`${value}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selected >= today
}

function BookingModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [isFirstVisit, setIsFirstVisit] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [newCredentials, setNewCredentials] = useState(null)

  useEffect(() => {
    if (!isOpen) return undefined

    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && user?.role === 'PATIENT') {
      setIsFirstVisit(false)
    }
  }, [isOpen, user])

  function resetModal() {
    setStep(1)
    setIsFirstVisit(null)
    setForm(INITIAL_FORM)
    setErrors({})
    setSubmitting(false)
  }

  function handleClose() {
    resetModal()
    onClose()
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validateStepOne() {
    if (user?.role === 'PATIENT') {
      setErrors({})
      return true
    }

    if (isFirstVisit === null) {
      setErrors({ visitType: 'Please select whether this is your first visit.' })
      return false
    }
    setErrors({})
    return true
  }

  function validateStepTwo() {
    const nextErrors = {}

    if (!form.appointmentDate) {
      nextErrors.appointmentDate = 'Preferred appointment date is required.'
    } else if (!isFutureOrTodayDate(form.appointmentDate)) {
      nextErrors.appointmentDate = 'Appointment date cannot be in the past.'
    }

    if (isFirstVisit) {
      if (!form.fullName.trim()) {
        nextErrors.fullName = 'Full name is required.'
      }

      if (!form.email.trim()) {
        nextErrors.email = 'Email address is required.'
      } else if (!isValidEmail(form.email)) {
        nextErrors.email = 'Enter a valid email address.'
      }

      if (!form.mobileNumber.trim()) {
        nextErrors.mobileNumber = 'Mobile number is required.'
      } else if (!isValidMobile(form.mobileNumber)) {
        nextErrors.mobileNumber = 'Enter a valid mobile number (10–15 digits).'
      }

      if (form.reportFile && !isValidPdfFile(form.reportFile)) {
        nextErrors.reportFile = 'Only PDF files are allowed.'
      }
    } else {
      const hasMobile = form.mobileNumber.trim().length > 0
      const hasAlpha = form.alphaNumber.trim().length > 0

      if (!hasMobile && !hasAlpha) {
        nextErrors.identifier = 'Provide your mobile number or alpha number.'
      }

      if (hasMobile && !isValidMobile(form.mobileNumber)) {
        nextErrors.mobileNumber = 'Enter a valid mobile number (10–15 digits).'
      }

      if (hasAlpha && form.alphaNumber.trim().length < 3) {
        nextErrors.alphaNumber = 'Enter a valid alpha number.'
      }

      if (form.reportFile && !isValidPdfFile(form.reportFile)) {
        nextErrors.reportFile = 'Only PDF files are allowed.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleContinue() {
    if (!validateStepOne()) return
    setStep(2)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validateStepTwo()) return

    setSubmitting(true)
    setErrors({})

    const formData = new FormData()
    formData.append('isFirstVisit', String(isFirstVisit))

    if (isFirstVisit) {
      formData.append('fullName', form.fullName.trim())
      formData.append('email', form.email.trim())
      formData.append('mobileNumber', normalizeMobile(form.mobileNumber))
      if (form.reportFile) {
        formData.append('reportFile', form.reportFile)
      }
    } else {
      if (form.mobileNumber.trim()) {
        formData.append('mobileNumber', normalizeMobile(form.mobileNumber))
      }
      if (form.alphaNumber.trim()) {
        formData.append('alphaNumber', form.alphaNumber.trim().toUpperCase())
      }
      if (form.reportFile) {
        formData.append('reportFile', form.reportFile)
      }
    }

    formData.append('appointmentDate', form.appointmentDate)

    try {
      const response = await axios.post(`${API_URL}/api/appointments/book`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      resetModal()
      onClose()

      if (response.data.isFirstVisit) {
        setNewCredentials({
          email: response.data.email,
          alphaNumber: response.data.alphaNumber,
          generatedPassword: response.data.generatedPassword,
        })
        onSuccess('Appointment booked! Save your login credentials below.')
      } else {
        onSuccess(
          `Welcome back, ${response.data.patientName}! Your appointment request has been submitted.`,
        )
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Unable to book appointment. Please try again.'
      setErrors({ submit: message })
    } finally {
      setSubmitting(false)
    }
  }

  async function copyToClipboard(value, label) {
    try {
      await navigator.clipboard.writeText(value)
      onSuccess(`${label} copied to clipboard.`)
    } catch {
      onSuccess(`Could not copy ${label.toLowerCase()}. Please copy it manually.`)
    }
  }

  if (!isOpen && !newCredentials) return null

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      {isOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="animate-modal-backdrop-in absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={handleClose}
        aria-label="Close booking modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="animate-modal-panel-in relative z-10 w-full max-w-lg scale-100 rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out"
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Step {step} of 2
              </p>
              <h2 id="booking-modal-title" className="mt-1 text-xl font-bold text-slate-900">
                Book an Appointment
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {step === 1
                  ? user?.role === 'PATIENT'
                    ? 'Confirm your identity to schedule your next visit.'
                    : 'Tell us if you are visiting for the first time.'
                  : 'Fill in your details to schedule a visit.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            {[1, 2].map((value) => (
              <div
                key={value}
                className={`h-1.5 flex-1 rounded-full transition ${
                  step >= value ? 'bg-teal-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 ? (
          <div className="px-6 py-6">
            {user?.role === 'PATIENT' ? (
              <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                    Verified Patient Identity
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">{user.email}</p>
                </div>
                <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                  Registered
                </span>
              </div>
            ) : (
              <fieldset>
                <legend className="mb-4 text-sm font-medium text-slate-800">
                  Is this your first visit to our clinic?
                </legend>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: true, label: 'Yes, first visit', description: 'New patient registration' },
                    { value: false, label: 'No, returning patient', description: 'Use mobile or alpha ID' },
                  ].map(({ value, label, description }) => (
                    <label
                      key={label}
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        isFirstVisit === value
                          ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-100'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visitType"
                        className="sr-only"
                        checked={isFirstVisit === value}
                        onChange={() => {
                          setIsFirstVisit(value)
                          setErrors({})
                        }}
                      />
                      <span className="block text-sm font-semibold text-slate-900">{label}</span>
                      <span className="mt-1 block text-xs text-slate-500">{description}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {errors.visitType && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {errors.visitType}
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {errors.submit && (
              <div
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {errors.submit}
              </div>
            )}

            <div className="space-y-4">
              {isFirstVisit ? (
                <>
                  <div>
                    <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(event) => updateField('fullName', event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => updateField('email', event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="you@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="mobileNumber" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Mobile Number
                    </label>
                    <input
                      id="mobileNumber"
                      type="tel"
                      autoComplete="tel"
                      value={form.mobileNumber}
                      onChange={(event) => updateField('mobileNumber', event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="+91 98765 43210"
                    />
                    {errors.mobileNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reportFile" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Upload Previous Medical Reports / Prescriptions (Optional)
                    </label>
                    <input
                      id="reportFile"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(event) =>
                        updateField('reportFile', event.target.files?.[0] ?? null)
                      }
                      className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
                    />
                    {form.reportFile && (
                      <p className="mt-2 text-xs text-slate-500">Selected: {form.reportFile.name}</p>
                    )}
                    {errors.reportFile && (
                      <p className="mt-1 text-sm text-red-600">{errors.reportFile}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Provide at least one identifier so we can locate your patient record.
                  </p>

                  {errors.identifier && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.identifier}
                    </p>
                  )}

                  <div>
                    <label htmlFor="returnMobile" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Mobile Number
                    </label>
                    <input
                      id="returnMobile"
                      type="tel"
                      autoComplete="tel"
                      value={form.mobileNumber}
                      onChange={(event) => updateField('mobileNumber', event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="+91 98765 43210"
                    />
                    {errors.mobileNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-medium uppercase text-slate-400">or</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div>
                    <label htmlFor="alphaNumber" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Alpha Number (Patient ID)
                    </label>
                    <input
                      id="alphaNumber"
                      type="text"
                      value={form.alphaNumber}
                      onChange={(event) => updateField('alphaNumber', event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 uppercase outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="e.g. CLN-1024"
                    />
                    {errors.alphaNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.alphaNumber}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="returnReportFile" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Upload Medical Reports / Prescriptions (Optional)
                    </label>
                    <input
                      id="returnReportFile"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(event) =>
                        updateField('reportFile', event.target.files?.[0] ?? null)
                      }
                      className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
                    />
                    {form.reportFile && (
                      <p className="mt-2 text-xs text-slate-500">Selected: {form.reportFile.name}</p>
                    )}
                    {errors.reportFile && (
                      <p className="mt-1 text-sm text-red-600">{errors.reportFile}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label htmlFor="appointmentDate" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Preferred Appointment Date
                </label>
                <input
                  id="appointmentDate"
                  type="date"
                  min={today}
                  value={form.appointmentDate}
                  onChange={(event) => updateField('appointmentDate', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
                {errors.appointmentDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setErrors({})
                }}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner />
                    Submitting...
                  </>
                ) : (
                  'Submit Appointment Request'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
      )}

      {newCredentials && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setNewCredentials(null)}
            aria-label="Close credentials modal"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="credentials-modal-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-teal-200 bg-white p-8 shadow-2xl"
          >
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
                ✓
              </div>
              <h2 id="credentials-modal-title" className="mt-4 text-2xl font-bold text-slate-900">
                Account Created
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Save these credentials now. You will need them to log in and manage your
                appointments.
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4">
              {[
                { label: 'Email', value: newCredentials.email },
                { label: 'Alpha Number', value: newCredentials.alphaNumber },
                { label: 'Temporary Password', value: newCredentials.generatedPassword },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {label}
                    </p>
                    <p className="truncate font-mono text-sm font-medium text-slate-900">{value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(value, label)}
                    className="shrink-0 rounded-md border border-teal-200 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-xs text-amber-700">
              You will be prompted to change your password on first login.
            </p>

            <button
              type="button"
              onClick={() => setNewCredentials(null)}
              className="mt-6 w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              I&apos;ve Saved My Credentials
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default BookingModal
