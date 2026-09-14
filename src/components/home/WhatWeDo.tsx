// src/components/home/WhatWeDo.tsx
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "We Listen",
    description:
      "We go where students and communities are and pay attention to what people are experiencing, asking, and building.",
    outcomes: ["Campus visits", "Listening sessions", "Emerging voices"],
    href: "/Programs/Events",
    future: false,
  },
  {
    number: "02",
    title: "We Convene",
    description:
      "We bring different perspectives into the same room — students, educators, professionals, leaders, and society — through talks, campus podcasts, debates, panels, and summits.",
    outcomes: ["Campus talks", "Debates", "Summits & forums"],
    href: "/Programs/Events",
    future: false,
  },
  {
    number: "03",
    title: "We Document",
    description:
      "We preserve conversations through video, audio, writing, and visual storytelling, turning what we hear into a growing public record.",
    outcomes: ["Podcasts", "Video", "Written record"],
    href: "/conversations",
    future: false,
  },
  {
    number: "04",
    title: "We Produce Insight",
    description:
      "We identify patterns, questions, and perspectives worth carrying further — turning conversations into reports and insight that can inform public discourse.",
    outcomes: ["Reports", "Questions", "Public discourse"],
    href: "/blog",
    future: false,
  },
  {
    number: "05",
    title: "We Build From What We Learn",
    description:
      "Over time, conversations inform research, mentorship, programmes, and other forms of intervention. This is where the work is headed, not where it already is at scale.",
    outcomes: ["Formation", "Mentorship", "Future programmes"],
    href: "/About/Vision-Mission",
    future: true,
  },
];

export function WhatWeDo() {
  return (
    <section className="border-b border-white/10 text-white py-20" style={{backgroundColor: '#0D1F35'}}>
      <div className="relative mx-auto max-w-5xl px-6">

        {/* Section Header - Centered */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            From Conversation To Impact
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            How a Conversation Becomes Impact
          </h2>
          <p className="mt-6 text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            Every conversation MUI convenes moves through the same stages — from a
            raw listening visit to a body of insight the work can grow from.
          </p>
        </div>

        {/* Sequence */}
        <div className="space-y-4">
          {steps.map((step) => (
            <Link
              key={step.number}
              href={step.href}
              className={`
                group flex flex-col sm:flex-row gap-4 sm:gap-8
                rounded-2xl border p-6 sm:p-8 transition-all duration-300
                ${step.future
                  ? "border-dashed border-white/20 bg-white/[0.02] hover:border-amber-400/50"
                  : "border-white/10 bg-white/5 hover:border-emerald-500 hover:bg-white/10 shadow-lg hover:shadow-xl hover:shadow-emerald-400/10"
                }
              `}
            >
              <div className="flex-none">
                <span className={`text-3xl font-bold ${step.future ? "text-white/30" : "text-amber-400"}`}>
                  {step.number}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className={`text-xl font-semibold transition ${step.future ? "text-white/80" : "text-white group-hover:text-emerald-400"}`}>
                    {step.title}
                  </h3>
                  {step.future && (
                    <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                      Where this leads
                    </span>
                  )}
                </div>

                <p className="mt-2 text-white/70 leading-relaxed">
                  {step.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                  {step.outcomes.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <span className={`mt-4 inline-block text-sm font-medium underline underline-offset-4 ${step.future ? "text-white/50" : "text-amber-500"}`}>
                  {step.future ? "See where this is heading" : "Learn more"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
