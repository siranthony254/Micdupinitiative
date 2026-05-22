// src/components/home/WhatWeDo.tsx
import Link from "next/link";

const pillars = [
  {
    title: "Discover and Shape Voices",
    description:
      "We identify emerging voices, talent, and stories across campuses—creating pathways for expression, confidence, and visibility. We equip young people to lead with clarity and responsible cultural influence across generations.",
    outcomes: ["Mentorship", "Leadership formation", "Values-based influence"],
    href: "/programs/leadership",
  },
  {
    title: "Curate Narratives",
    description:
      "We create purpose-driven creative narratives—documentaries, online dramas, and compelling stories that help shape the narratives youth consume for entertainment, information, learning, and inspiration.",
    outcomes: ["Documentaries", "Online dramas", "Purposeful storytelling"],
    href: "/programs/narratives",
  },
  {
    title: "Host Dialogue",
    description:
      "We create powerful spaces—talks, campus podcasts, debates, panels, and summits—where ideas are exchanged and culture is shaped; from Africa to the world.",
    outcomes: ["Campus talks", "Debates", "Summits & forums"],
    href: "/programs/events",
  },
  {
    title: "Produce Insight",
    description:
      "We turn conversations into impact through media, research, and policy-oriented insight that informs society. We produce podcasts, reports, and youth insights that shape public discourse and influence decision-making.",
    outcomes: ["Podcasts", "Reports", "Youth insights"],
    href: "/research",
  },
];

export function WhatWeDo() {
  return (
    <section className="border-b border-white/10 text-white py-20" style={{backgroundColor: '#0D1F35'}}>
      <div className="relative mx-auto max-w-6xl px-6">
        
        {/* Section Header - Centered */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            What We Do As MUI
          </h2>
          <p className="mt-6 text-lg text-white/70 max-w-4xl mx-auto leading-relaxed">
            Mic'd Up Initiative is a campus-centered movement that discovers voices, shapes leaders, hosts dialogue, and produces insight—turning youth expression into societal impact across Africa and beyond.
          </p>
        </div>

        {/* Framework Grid - Centered Layout */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar) => (
              <Link
                key={pillar.title}
                href="/contact"
                className="
                  group rounded-2xl
                  border border-white/10
                  p-8 transition
                  hover:border-emerald-500 text-center
                  bg-white/5 hover:bg-white/10
                  shadow-lg hover:shadow-xl
                  hover:shadow-emerald-400/10
                  transition-all duration-300
                "
              >
                <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-left text-white/70 leading-relaxed">
                  {pillar.description}
                </p>

                <ul className="mt-6 space-y-1 text-sm text-white/60 text-left">
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

      </div>
    </section>
  );
}
