// src/components/home/WhatWeDo.tsx
import Link from "next/link";

const pillars = [
  {
    title: "Discover Voices",
    description:
      "We identify emerging voices, talent, and stories across campuses—creating pathways for expression, confidence, and visibility.",
    outcomes: ["Campus talent", "Untold stories", "Emerging leaders"],
    href: "/programs/talent",
  },
  {
    title: "Shape Leaders",
    description:
      "Through mentorship, leadership formation, and ethical grounding, we equip young people to lead with clarity and responsible cultural influence across generations.",
    outcomes: ["Mentorship", "Leadership formation", "Values-based influence"],
    href: "/programs/leadership",
  },
  {
    title: "Host Dialogue",
    description:
      "We create powerful spaces—talks, debates, panels, and summits—where ideas are exchanged and culture is shaped.",
    outcomes: ["Campus talks", "Debates", "Summits & forums"],
    href: "/programs/events",
  },
  {
    title: "Produce Insight",
    description:
      "We turn conversations into impact through media, research, and policy-oriented insight that informs society.",
    outcomes: ["Podcasts", "Reports", "Youth insights"],
    href: "/research",
  },
];

export function WhatWeDo() {
  return (
    <section className="bg-neutral-950 border-b border-white/10">
  <div className="mx-auto max-w-7xl px-6 py-20">
    
    {/* Intro */}
    <div className="mb-14 max-w-3xl">
      <h2 className="text-3xl font-bold text-white">
        What We Do
      </h2>
      <p className="mt-4 text-lg text-white/70">
        Mic’d Up Initiative is a campus-centered movement that discovers
        voices, shapes leaders, hosts dialogue, and produces insight—turning
        youth expression into societal impact.
      </p>
    </div>

    {/* Framework Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {pillars.map((pillar) => (
        <Link
          key={pillar.title}
          href="/contact"
          className="
            group rounded-2xl
            border border-white/10
            bg-neutral-900
            p-8 transition
            hover:border-emerald-500 hover:bg-neutral-900/80
          "
        >
          <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition">
            {pillar.title}
          </h3>

          <p className="mt-3 text-white/70 leading-relaxed">
            {pillar.description}
          </p>

          <ul className="mt-6 space-y-1 text-sm text-white/60">
            {pillar.outcomes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          <span className="mt-6 inline-block text-sm font-medium text-amber-500 underline underline-offset-4">
            Learn more
          </span>
        </Link>
      ))}
    </div>

  </div>
</section>
  );
}
