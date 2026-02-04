"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MentorshipPage() {
  return (
    <section className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Header */}
        <motion.header
          className="max-w-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
            Mentorship & Leadership Formation
          </span>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            We Shape People Before Platforms
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed">
            Leadership is not positional. It is formed. Our mentorship framework
            exists to shape individuals who steward ideas, communities, and
            culture with integrity.
          </p>

          <p className="mt-3 text-white/70">
            This is not a motivational program.{" "}
            <span className="text-white font-medium">
              It is a formation journey.
            </span>
          </p>
        </motion.header>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Why We Mentor */}
        <motion.section
          className="max-w-4xl space-y-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold">
            Why We Mentor
          </h2>

          <p className="text-white/80 leading-relaxed">
            Institutions outlive moments. Content without character fades.
            Platforms without people collapse.
          </p>

          <p className="text-white/80 leading-relaxed">
            Mentorship ensures the mission is carried forward by individuals
            formed in responsibility, values, and purpose.
          </p>

          <p className="font-medium text-white">
            Impact is measured by people who can say: “I was formed here.”
          </p>
        </motion.section>

        {/* Who It's For */}
        <motion.section
          className="mt-12 max-w-4xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold">
            Who This Is For
          </h2>

          <p className="mt-3 text-white/75 leading-relaxed">
            This track is selective — designed for individuals ready for
            responsibility, not visibility.
          </p>

          <ul className="mt-5 space-y-2 list-disc list-inside text-white/70 text-sm md:text-base">
            <li>Campus Ambassadors and student representatives</li>
            <li>Emerging student leaders across disciplines</li>
            <li>Creatives, thinkers, and organizers aligned with MUI values</li>
            <li>Students prepared for stewardship and accountability</li>
          </ul>

          <p className="mt-4 text-xs text-white/45">
            Not an open crowd program — a formation track.
          </p>
        </motion.section>

        {/* Cohort + Rhythm Cards */}
        <motion.section
          className="mt-14"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold">
            The Cohort System & Rhythm
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Two cohorts per year",
              "One academic semester (3 months)",
              "Fully online and multi-campus",
              "Weekly personal formation tasks",
              "Monthly closed cohort sessions",
              "Progress tracking & accountability",
            ].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5
                           hover:border-amber-400/40 hover:bg-white/[0.07]
                           hover:shadow-lg hover:shadow-amber-400/10"
              >
                <p className="text-sm text-white/80 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pillars */}
        <motion.section
          className="mt-14"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold">
            What We Form
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Character & Values",
                desc: "Integrity, stewardship, discipline, responsibility.",
              },
              {
                title: "Clarity & Purpose",
                desc: "Identity, conviction, direction.",
              },
              {
                title: "Leadership Capacity",
                desc: "Communication, initiative, service.",
              },
              {
                title: "Institutional Thinking",
                desc: "Building beyond self and sustaining impact.",
              },
            ].map((pillar) => (
              <motion.div
                key={pillar.title}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6
                           hover:border-amber-400/40 hover:bg-white/[0.07]"
              >
                <h3 className="text-base font-semibold text-amber-200">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-white/60 text-sm">
            We do not rush growth. We form it.
          </p>
        </motion.section>

        {/* CTA Block */}
        <motion.section
          className="mt-16 max-w-4xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 hover:border-amber-400/30 transition">
            <h2 className="text-xl md:text-2xl font-semibold">
              Get Involved
            </h2>

            <p className="mt-3 text-white/75 leading-relaxed text-sm md:text-base">
              Mentorship at MUI is by invitation and alignment. Not everyone is
              called to the same lane — but everyone is called to steward what
              they carry.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/mentorship/apply"
                className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black
                           hover:bg-amber-300 hover:scale-[1.02]
                           transition active:scale-[0.97]"
              >
                Join a Mentorship Cohort
              </Link>

              <Link
                href="/Get-Involved/Ambassadors"
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white
                           hover:bg-white/5 hover:border-white/40 transition"
              >
                Become a Campus Ambassador
              </Link>

              <Link
                href="/Get-Involved/Partnerships"
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white
                           hover:bg-white/5 hover:border-white/40 transition"
              >
                Partner With Formation
              </Link>
            </div>
          </div>

          <p className="mt-10 text-xs text-white/35 border-t border-white/10 pt-5">
            © 2026 Mic’d Up Initiative. All rights reserved.
          </p>
        </motion.section>
      </div>
    </section>
  );
}
