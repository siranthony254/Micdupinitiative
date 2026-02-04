"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CampusToursPage() {
  return (
    <section className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Page Intro */}
        <motion.header
          className="max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-amber-300">
            Campus Engagement
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
            Campus Tours
          </h1>

          <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
            Mic’d Up Initiative Campus Tours are immersive, multi-layered
            engagements designed to listen to students, amplify voices, identify
            leadership, and steward culture within higher education
            institutions.
          </p>
        </motion.header>

        {/* Divider */}
        <div className="mt-12 mb-12 h-px w-full bg-white/10" />

        {/* What Is a Campus Tour */}
        <motion.section
          className="max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold">
            What a Campus Tour Is
          </h2>

          <p className="mt-4 text-white/80 leading-relaxed">
            A Campus Tour is not a single event. It is a carefully structured
            engagement that brings together conversation, creativity, research,
            and leadership formation. Each tour is adapted to the unique culture
            of the campus while maintaining MUI’s core mission of intentional
            voice amplification and youth formation.
          </p>
        </motion.section>

        {/* What Happens on Tour */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-semibold">
                What Happens on Tour
              </h2>
              <p className="mt-3 text-white/70 leading-relaxed">
                Each tour is designed to surface authentic student realities,
                strengthen leadership, and document culture responsibly.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Campus Podcast Recordings",
                desc: "Live or recorded conversations capturing authentic student experiences, leadership insights, and campus realities.",
              },
              {
                title: "MUI Talks & Panel Conversations",
                desc: "Curated discussions with students, lecturers, and invited guests around purpose, leadership, culture, and responsibility.",
              },
              {
                title: "Creative & Talent Showcases",
                desc: "Short performances, spoken word, drama, and artistic expression that reveal the creative pulse of the campus.",
              },
              {
                title: "Campus Listening Sessions",
                desc: "Research-oriented dialogues designed to surface student needs, challenges, and opportunities for institutional insight.",
              },
              {
                title: "Leadership & Club Engagements",
                desc: "Strategic meetings with student leaders, societies, and campus organizations to build alignment and long-term impact.",
              },
              {
                title: "Ambassador Identification",
                desc: "Recognizing and onboarding purpose-driven students to steward MUI’s mission on their campus.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6
                           shadow-sm transition-all duration-300
                           hover:border-amber-400/40 hover:bg-white/[0.06]"
              >
                <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-5 h-px w-full bg-white/10" />
                <p className="mt-3 text-xs text-white/50">
                  Structured • Intentional • Campus-specific
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Campuses Visited */}
        <motion.section
          className="mt-14 max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold">
            Campuses We’ve Visited
          </h2>

          <p className="mt-4 text-white/80 leading-relaxed">
            Mic’d Up Initiative has engaged with diverse public and private
            universities and colleges, adapting each tour to local campus
            culture while maintaining excellence, integrity, and depth.
          </p>

          <p className="mt-4 text-sm text-white/60">
            A detailed campus archive and tour documentation will be published
            progressively.
          </p>
        </motion.section>

        {/* Bring MUI to Your Campus */}
        <motion.section
          className="mt-14 max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-7 md:p-9">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Bring MUI to Your Campus
            </h2>

            <p className="mt-4 text-white/80 leading-relaxed">
              Campus Tours are initiated through collaboration with student
              leadership, faculty, and institutional partners. Each engagement is
              planned intentionally to ensure relevance, order, and lasting
              value.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full
                           bg-amber-400 px-7 py-3 text-sm font-semibold text-black
                           hover:bg-amber-300 active:scale-[0.98]
                           transition shadow-lg shadow-amber-400/20"
              >
                Request a Campus Tour
              </Link>

              <Link
                href="/get-involved/partnerships"
                className="inline-flex items-center justify-center rounded-full
                           border border-white/20 px-7 py-3 text-sm font-semibold text-white
                           hover:bg-white/5 hover:border-white/40 active:scale-[0.98]
                           transition"
              >
                Explore Tour Partnerships
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Partner With a Tour */}
        <motion.section
          className="mt-14 max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold">
            Partner With a Tour
          </h2>

          <p className="mt-4 text-white/80 leading-relaxed">
            Institutions, organizations, and individuals may partner with Mic’d
            Up Initiative Campus Tours through sponsorship, logistics, research
            collaboration, or content production support.
          </p>

          <div className="mt-6">
            <Link
              href="/get-involved/partnerships"
              className="text-sm font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 transition"
            >
              Explore Tour Partnerships
            </Link>
          </div>

          <p className="mt-12 text-xs text-white/40 border-t border-white/10 pt-6">
            © 2026 Mic’d Up Initiative. All rights reserved.
          </p>
        </motion.section>
      </div>
    </section>
  );
}
