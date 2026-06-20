import { useEffect, useState } from 'react'
import BookingModal from '../components/BookingModal'
import Toast from '../components/Toast'

const services = [
  {
    title: 'General Consultation',
    description: 'Comprehensive check-ups and preventive care from experienced physicians.',
    icon: '🩺',
  },
  {
    title: 'Diagnostic Services',
    description: 'Accurate lab testing and imaging with fast, reliable results.',
    icon: '🔬',
  },
  {
    title: 'Specialist Care',
    description: 'Access to cardiologists, dermatologists, and other specialists under one roof.',
    icon: '👨‍⚕️',
  },
  {
    title: 'Emergency Support',
    description: 'Prompt triage and urgent care coordination when you need it most.',
    icon: '🚑',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Patient since 2022',
    quote:
      'The staff is incredibly caring and professional. Booking appointments online saved me so much time.',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Returning patient',
    quote:
      'Clean facility, minimal wait times, and doctors who actually listen. Highly recommended.',
  },
  {
    name: 'Anita Desai',
    role: 'Family patient',
    quote:
      'We trust Doctor Clinic for our entire family. The follow-up care and reminders are excellent.',
  },
]

function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (!toastMessage) return undefined

    const timer = setTimeout(() => setToastMessage(''), 5000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  return (
    <>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={setToastMessage}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
              Trusted Healthcare Since 2010
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your Health, Our Priority
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-teal-50">
              Compassionate care, modern diagnostics, and a patient-first approach — all in one
              welcoming clinic designed around your wellbeing.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-teal-800 shadow-lg transition hover:bg-teal-50"
              >
                Book Appointment
              </button>
              <a
                href="#about"
                className="rounded-xl border border-white/40 px-8 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '15+', label: 'Years of Service' },
              { value: '50K+', label: 'Patients Treated' },
              { value: '20+', label: 'Specialist Doctors' },
              { value: '24/7', label: 'Emergency Support' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-sm text-teal-100">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">About Us</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Healthcare that puts people first
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Doctor Clinic is a full-service medical center committed to delivering accessible,
                high-quality care for individuals and families. Our team combines clinical expertise
                with a warm, supportive environment so every visit feels personal.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                From routine check-ups to specialist referrals, we use modern technology and
                evidence-based practices to help you stay healthy at every stage of life.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Board-certified physicians',
                'State-of-the-art diagnostics',
                'Patient-centered care plans',
                'Transparent pricing & billing',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700"
                >
                  <span className="mr-2 text-teal-600">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-24 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Services</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Comprehensive care under one roof
            </h2>
            <p className="mt-4 text-slate-600">
              Explore the medical services we offer to keep you and your loved ones healthy.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ title, description, icon }) => (
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
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              What our patients say
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map(({ name, role, quote }) => (
              <blockquote
                key={name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <p className="text-sm leading-relaxed text-slate-700">&ldquo;{quote}&rdquo;</p>
                <footer className="mt-5 border-t border-slate-200 pt-4">
                  <p className="font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500">{role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="scroll-mt-24 bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-300">
                Contact Us
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Get in touch with our clinic</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Have questions or need to schedule a visit? Reach out — our friendly team is ready
                to help you every step of the way.
              </p>
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="mt-8 rounded-xl bg-teal-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-400"
              >
                Book Appointment
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Address', value: '123 Wellness Avenue, Medical District' },
                { label: 'Phone', value: '+91 98765 43210' },
                { label: 'Email', value: 'care@doctorclinic.com' },
                { label: 'Hours', value: 'Mon–Sat: 8 AM – 8 PM' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                    {label}
                  </p>
                  <p className="mt-2 text-sm text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
