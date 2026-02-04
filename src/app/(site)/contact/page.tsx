import Link from "next/link";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          
          {/* LEFT: Context */}
          <div className="max-w-xl space-y-6">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-amber-300">
                Contact Mic’d Up Initiative
              </h1>

              <p className="text-white/75 leading-relaxed">
                Whether you’re a student, mentor, partner, media house, or
                institution, we’d like to hear from you. Reach out for
                collaboration, inquiries, or general engagement.
              </p>
            </header>

            <div className="space-y-5 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">General Inquiries</p>
                <p className="text-white/70">info@micdupinitiative.org</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Partnerships</p>
                <p className="text-white/70">partners@micdupinitiative.org</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Media & Press</p>
                <p className="text-white/70">media@micdupinitiative.org</p>
              </div>
            </div>

            <p className="text-xs text-white/50">
              We typically respond within 48 hours on working days.
            </p>
          </div>

          {/* RIGHT: Form */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-amber-200">
              Send a Message
            </h2>

           <form
  action="https://formspree.io/f/mdadqbbl"
  method="POST"
  className="space-y-6"
>
  <input type="hidden" name="_redirect" value="/thank-you" />

  {/* Honeypot */}
  <div className="hidden">
    <label htmlFor="company" className="sr-only">
      Company
    </label>
    <input
      type="text"
      name="_gotcha"
      id="company"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
    />
  </div>
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm text-white/70">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm text-white/70">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="What is this about?"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm text-white/70">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Write your message..."
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                Send Message
              </button>

              <p className="text-xs text-white/50 leading-relaxed">
                By submitting this form, you consent to being contacted by Mic’d
                Up Initiative.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
