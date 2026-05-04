"use client";

export default function MentorsPage() {
  return (
    <section className="min-h-screen text-white" style={{backgroundColor: '#0D1F35'}}>
      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Header */}
        <header className="mb-14 space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-amber-400">
            Become a Mentor
          </h1>
          <p className="max-w-2xl text-white/70 leading-relaxed">
            Support the next generation of campus voices by sharing your
            experience, insight, and professional guidance through Mic’d Up
            Initiative.
          </p>
        </header>

        {/* Info Blocks */}
        <div className="mb-14 grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-3">What Mentors Do</h2>
            <ul className="space-y-2 text-white/75 list-disc list-inside">
              <li>Guide students in media, leadership, research, or advocacy</li>
              <li>Participate in structured mentorship sessions</li>
              <li>
                Support campus initiatives through expertise and perspective
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-3">Who Should Apply</h2>
            <ul className="space-y-2 text-white/75 list-disc list-inside">
              <li>Professionals, alumni, creatives, or academics</li>
              <li>Minimum of 3 years relevant experience</li>
              <li>Aligned with Mic’d Up Initiative’s values and mission</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg">
          <h2 className="text-xl font-medium mb-6">
            Mentor Application Form
          </h2>

          <form
            action="https://formspree.io/f/xjgonldo"
            method="POST"
            className="space-y-6"
          >
            {/* Redirect */}
            <input type="hidden" name="_redirect" value="/thank-you" />

            {/* Honeypot */}
            <div className="hidden">
              <label htmlFor="company" className="sr-only">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">Full Name</label>
              <input
                name="name"
                required
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30" style={{backgroundColor: '#1A3A5C'}}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30" style={{backgroundColor: '#1A3A5C'}}
              />
            </div>

            {/* Profession */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">
                Profession / Industry
              </label>
              <input
                name="profession"
                required
                placeholder="e.g. Journalism, Tech, Education"
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30" style={{backgroundColor: '#1A3A5C'}}
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">
                Years of Experience
              </label>
              <input
                name="experience"
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30" style={{backgroundColor: '#1A3A5C'}}
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">
                LinkedIn / Portfolio URL
              </label>
              <input
                name="linkedin"
                placeholder="https://linkedin.com/in/yourname"
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30" style={{backgroundColor: '#1A3A5C'}}
              />
            </div>

            {/* Motivation */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">
                Motivation Statement
              </label>
              <textarea
                name="motivation"
                rows={5}
                placeholder="Why do you want to mentor with Mic’d Up Initiative?"
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30" style={{backgroundColor: '#1A3A5C'}}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            >
              Submit Application
            </button>

            <p className="text-xs text-white/50 leading-relaxed">
              Applications are reviewed on a rolling basis. Expect a response
              within 7–14 days.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
