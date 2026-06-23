import { useBooking } from '../context/BookingContext'

const departments = [
  {
    title: 'General Practice',
    description: 'Primary care, preventive screenings, and chronic disease management.',
    icon: '🩺',
  },
  {
    title: 'Cardiology',
    description: 'ECG, echocardiography, and comprehensive heart health programs.',
    icon: '❤️',
  },
  {
    title: 'Pediatrics',
    description: 'Well-child visits, vaccinations, and adolescent health services.',
    icon: '👶',
  },
  {
    title: 'Advanced Diagnostics Lab',
    description: 'Full-spectrum blood work, pathology, and molecular testing.',
    icon: '🔬',
  },
  {
    title: 'Dental Surgery',
    description: 'Restorative dentistry, oral surgery, and cosmetic procedures.',
    icon: '🦷',
  },
  {
    title: 'Emergency Outpatient',
    description: 'Urgent care, minor trauma, and same-day stabilization.',
    icon: '🚑',
  },
]

function Services() {
  const { openBooking } = useBooking()

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-teal-800 to-emerald-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-100">Services</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Comprehensive Medical Departments</h1>
          <p className="mt-4 max-w-2xl text-teal-50">
            Integrated specialties under one roof — book the care you need in minutes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map(({ title, description, icon }) => (
            <article
              key={title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-3xl">
                {icon}
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
              <button
                type="button"
                onClick={openBooking}
                className="mt-6 w-full rounded-lg border border-teal-600 px-4 py-2.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-600 hover:text-white"
              >
                Book This Service
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Services
