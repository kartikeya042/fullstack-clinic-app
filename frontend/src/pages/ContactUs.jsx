import { useEffect, useState } from 'react'
import Toast from '../components/Toast'

function ContactUs() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (!toastMessage) return undefined
    const timer = setTimeout(() => setToastMessage(''), 5000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  function handleSubmit(event) {
    event.preventDefault()
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
    setToastMessage('Thank you! Our support desk will reach out to you within 2 business hours.')
  }

  return (
    <>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="min-h-screen bg-slate-50">
        <section className="bg-gradient-to-r from-teal-800 to-emerald-700 px-6 py-16 text-white">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-100">Contact</p>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">We&apos;re Here For You</h1>
            <p className="mt-4 max-w-2xl text-teal-50">
              Reach our team for appointments, billing questions, or general inquiries.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Info Hub</h2>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Official Address
                </p>
                <p className="mt-2 text-slate-700">
                  123 Wellness Avenue, Medical District
                  <br />
                  New Delhi, India 110001
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Working Hours
                </p>
                <p className="mt-2 text-slate-700">Mon–Sat: 8:00 AM – 8:00 PM</p>
                <p className="text-slate-700">Sun: Emergency Only</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Phone</p>
                <p className="mt-2 text-slate-700">+91 98765 43210</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Direct Email
                </p>
                <p className="mt-2 text-slate-700">care@doctorclinic.com</p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
                <div className="text-center text-slate-600">
                  <span className="text-4xl">📍</span>
                  <p className="mt-2 text-sm font-medium">Google Maps Embed Placeholder</p>
                  <p className="text-xs">123 Wellness Avenue, Medical District</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Send an Inquiry</h2>
            <p className="mt-2 text-sm text-slate-600">
              Fill out the form below and our support desk will respond promptly.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  )
}

export default ContactUs
