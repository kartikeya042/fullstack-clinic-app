import { Link } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

const previewServices = [
  {
    title: 'General Practice',
    description: 'Preventive screenings, chronic care, and same-day consultations.',
    icon: '🩺',
  },
  {
    title: 'Advanced Diagnostics',
    description: 'On-site imaging and laboratory testing with rapid turnaround.',
    icon: '🔬',
  },
  {
    title: 'Emergency Outpatient',
    description: 'Urgent triage and stabilization with 24/7 clinical support.',
    icon: '🚑',
  },
]

const trustMetrics = [
  { value: '15+', label: 'Years Experience' },
  { value: '50K+', label: 'Patients' },
  { value: '20+', label: 'Specialists' },
  { value: '24/7', label: 'Support' },
]

function Home() {
  const { openBooking } = useBooking()

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
            Trusted Healthcare Since 2010
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your Health, Our Priority
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-teal-50">
            Compassionate care, modern diagnostics, and a patient-first approach — all in one
            welcoming clinic designed around your wellbeing.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-teal-800 shadow-lg transition hover:bg-teal-50"
            >
              Book Appointment
            </button>
            <Link
              to="/about"
              className="rounded-xl border border-white/40 px-8 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {trustMetrics.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-teal-700">{value}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              What We Offer
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Care built around your life</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {previewServices.map(({ title, description, icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                  {icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center rounded-xl border-2 border-teal-700 px-8 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-700 hover:text-white"
            >
              Explore All Services →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
