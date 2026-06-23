function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className="h-4 w-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      Verified
    </span>
  )
}

const reviews = [
  {
    name: 'Priya Sharma',
    date: 'January 2026',
    quote:
      'Booking online was effortless and the staff made me feel genuinely cared for from the moment I walked in.',
  },
  {
    name: 'Rajesh Kumar',
    date: 'December 2025',
    quote:
      'Minimal wait times, spotless facilities, and doctors who take time to explain every diagnosis clearly.',
  },
  {
    name: 'Anita Desai',
    date: 'November 2025',
    quote:
      'Our entire family trusts Doctor Clinic. Follow-up reminders and billing transparency are exceptional.',
  },
  {
    name: 'Michael Chen',
    date: 'October 2025',
    quote:
      'The cardiology team detected an issue early during a routine screening. I cannot recommend them enough.',
  },
  {
    name: 'Fatima Khan',
    date: 'September 2025',
    quote:
      'Pediatric care for my twins has been outstanding. Warm, professional, and always available when we need them.',
  },
  {
    name: 'David Okafor',
    date: 'August 2025',
    quote:
      'Emergency outpatient saved us a hospital trip. Fast triage, clear communication, and compassionate care.',
  },
]

function Testimonials() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-teal-800 to-emerald-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-100">
            Testimonials
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Patient Stories &amp; Verified Reviews</h1>
          <p className="mt-4 max-w-2xl text-teal-50">
            Real experiences from patients who chose Doctor Clinic for their healthcare journey.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
          {reviews.map(({ name, date, quote }) => (
            <article
              key={name}
              className="break-inside-avoid rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <StarRating />
              <p className="mt-4 text-sm leading-relaxed text-slate-700">&ldquo;{quote}&rdquo;</p>
              <footer className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                <div>
                  <p className="font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500">{date}</p>
                </div>
                <VerifiedBadge />
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-teal-200 bg-teal-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Submit Your Feedback</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Had a great experience at Doctor Clinic? We&apos;d love to hear from you. Share your story
            and help others find the care they deserve.
          </p>
          <a
            href="mailto:feedback@doctorclinic.com?subject=Patient%20Feedback"
            className="mt-6 inline-flex rounded-xl bg-teal-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Share Your Experience
          </a>
        </div>
      </section>
    </div>
  )
}

export default Testimonials
