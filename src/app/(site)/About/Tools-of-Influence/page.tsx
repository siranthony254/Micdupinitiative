"use client";

import { motion } from "framer-motion";

/* -----------------------------
   Data
------------------------------ */
const tools = [
  {
    title: "Content & Storytelling",
    tagline: "We mic what matters.",
    points: [
      "Podcasts and long-form conversations",
      "Documentaries and campus features",
      "Short-form storytelling",
      "The MUC Talks (TED-Style Campus Talks)",
    ],
    body: [
      "MUI amplifies meaningful student voices, ideas, talents, and conversations through intentional storytelling.",
      " We shape culture—by preserving ideas, elevating substance, and giving voice to perspectives that deserve longevity.",
    ],
  },
  {
    title: "Mentorship & Formation",
    tagline: "We shape people.",
    points: ["Character and values", "Clarity of purpose", "Leadership and responsibility"],
    body: [
      "Platforms are only as strong as the people who carry them.",
      "Through selective ambassador cohorts and mentorship pipelines, MUI forms individuals capable of carrying vision, values, and responsibility across campuses and beyond.",
    ],
  },
  {
    title: "Research & Insights",
    tagline: "We speak with credibility.",
    points: [
      "Content and storytelling direction",
      "Programs and mentorship frameworks",
      "Public conversations and forums",
    ],
    body: [
      "Influence without understanding is fragile.",
      "By grounding our work in evidence and lived experience, we ensure that our influence is trusted, relevant, and responsibly applied.",
    ],
  },
  {
    title: "Community & Events",
    tagline: "We connect campus to the world.",
    points: [
      "Contributors, not just audiences",
      "Thinkers, not just speakers",
      "Participants in shaping the future",
    ],
    body: [
      "Campus is not separate from society. It is one of its most generative spaces.",
      "Community is how ideas travel. Events are how connection becomes influence.",
    ],
  },
];

export default function ToolsOfInfluencePage() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Ambient Premium Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-220px] left-[-180px] h-[520px] w-[520px] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute bottom-[-260px] right-[-200px] h-[620px] w-[620px] rounded-full bg-white/5 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-14">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl"
        >
          <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
            Framework
          </span>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            MUI’s Tools of Influence
          </h1>

          <div className="mt-5 space-y-3 text-lg leading-relaxed text-white/75">
            <p>Influence is not accidental. It is built.</p>
            <p>
              At Mic’d Up Initiative (MUI), we do not rely on trends, virality,
              or noise. We work through intentional tools that shape people,
              culture, and institutions over time.
            </p>
            <p className="font-medium text-white">
              These tools guide how we listen, speak, form, and connect.
            </p>
          </div>
        </motion.section>

        {/* Tools Grid */}
        <section className="mt-14 grid gap-6 md:grid-cols-2">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7
                         hover:border-amber-400/30 hover:bg-white/[0.07]
                         hover:shadow-xl hover:shadow-amber-400/10 transition"
            >
              <h2 className="text-xl font-semibold text-amber-200">
                {tool.title}
              </h2>

              <p className="mt-1 text-sm font-medium text-white/85">
                {tool.tagline}
              </p>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
                {tool.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              <ul className="mt-4 space-y-1 text-sm text-white/70 list-disc pl-5">
                {tool.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              {/* Micro Hover Accent */}
              <div className="mt-5 h-[1px] w-0 bg-amber-400/60 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </section>

        {/* Closing */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-7"
        >
          <h2 className="text-2xl font-semibold text-amber-200 mb-3">
            Influence With Intention
          </h2>

          <div className="space-y-3 text-white/75 leading-relaxed">
            <p>These tools do not operate in isolation. They reinforce one another.</p>
            <p>
              Content amplifies insight. Mentorship sustains culture. Research
              grounds credibility. Community extends reach.
            </p>
            <p className="font-medium text-white">
              This is how MUI builds influence that lasts.
            </p>
          </div>
        </motion.section>

        {/* Footer */}
        <p className="mt-10 text-xs text-white/35 border-t border-white/10 pt-5">
          © 2026 Mic’d Up Initiative. All rights reserved.
        </p>
      </div>
    </main>
  );
}
