const specialists = [
  {
    name: 'Dr. Ananya Mehta',
    department: 'Internal Medicine',
    credentials: 'MD, DM (Cardiology) · 18 yrs',
    bio: 'Leads our chronic care programs with a focus on preventive cardiology and holistic wellness.',
  },
  {
    name: 'Dr. Rohan Kapoor',
    department: 'Pediatrics',
    credentials: 'MBBS, MD (Pediatrics) · 14 yrs',
    bio: 'Specializes in developmental pediatrics and family-centered treatment plans for children.',
  },
  {
    name: 'Dr. Sarah Fernandes',
    department: 'Diagnostic Imaging',
    credentials: 'MBBS, DMRD · 12 yrs',
    bio: 'Oversees advanced radiology workflows ensuring precise, timely diagnostic reporting.',
  },
]

function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-teal-800 to-emerald-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-100">About Us</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Our Story &amp; Clinical Philosophy</h1>
          <p className="mt-4 max-w-2xl text-teal-50">
            For over fifteen years, Doctor Clinic has blended compassionate care with uncompromising
            clinical standards.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-200 via-teal-100 to-emerald-100">
            <div className="text-center">
              <span className="text-6xl">🏥</span>
              <p className="mt-4 text-sm font-medium text-slate-600">Modern Medical Facility</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900">Patient-first, always</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            A legacy of patient-first healthcare delivered with uncompromising diagnostics.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            We believe every patient deserves clarity, dignity, and access to evidence-based
            medicine. Our multidisciplinary teams collaborate across departments to deliver
            seamless care — from your first consultation through follow-up and recovery.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-700">
            {[
              'Board-certified physicians across 6 departments',
              'ISO-aligned laboratory and imaging protocols',
              'Transparent billing with zero surprise charges',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-teal-600">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Meet Our Lead Specialists</h2>
            <p className="mt-3 text-slate-600">
              Experienced clinicians dedicated to your wellbeing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {specialists.map(({ name, department, credentials, bio }) => (
              <article
                key={name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 text-3xl">
                  👨‍⚕️
                </div>
                <span className="mt-4 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                  {department}
                </span>
                <h3 className="mt-3 text-xl font-bold text-slate-900">{name}</h3>
                <p className="mt-1 text-sm font-medium text-teal-700">{credentials}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
