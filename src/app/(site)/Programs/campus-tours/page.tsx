"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function CampusToursPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 bg-neutral-950 min-h-screen text-white">
      
      {/* Page Intro */}
      <motion.header
        className="max-w-4xl mb-24"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.8 }}
      >
        <span className="text-xs tracking-widest uppercase text-amber-400">
          Campus Engagement
        </span>

        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
          Campus Tours
        </h1>

        <p className="mt-6 text-lg text-white/70 leading-relaxed">
          Mic’d Up Initiative Campus Tours are immersive, multi-layered
          engagements designed to listen to students, amplify voices,
          identify leadership, and steward culture within higher education
          institutions.
        </p>
      </motion.header>

      {/* What Is a Campus Tour */}
      <motion.section
        className="max-w-4xl mb-28"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-semibold mb-6">
          What a Campus Tour Is
        </h2>

        <p className="text-white/80 leading-relaxed">
          A Campus Tour is not a single event. It is a carefully structured
          engagement that brings together conversation, creativity,
          research, and leadership formation. Each tour is adapted to the
          unique culture of the campus while maintaining MUI’s core mission
          of intentional voice amplification and youth formation.
        </p>
      </motion.section>

      {/* What Happens on Tour */}
      <motion.section
        className="max-w-5xl mb-32"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-semibold mb-10">
          What Happens on Tour
        </h2>

        <div className="grid gap-8 sm:grid-cols-2">
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
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-medium mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Campuses Visited */}
      <motion.section
        className="max-w-4xl mb-28"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-semibold mb-6">
          Campuses We’ve Visited
        </h2>

        <p className="text-white/80 leading-relaxed mb-6">
          Mic’d Up Initiative has engaged with diverse public and private
          universities and colleges, adapting each tour to local campus
          culture while maintaining excellence, integrity, and depth.
        </p>

        <p className="text-sm text-white/60">
          A detailed campus archive and tour documentation will be published
          progressively.
        </p>
      </motion.section>

      {/* Bring MUI to Your Campus */}
      <motion.section
        className="max-w-4xl mb-28"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-semibold mb-6">
          Bring MUI to Your Campus
        </h2>

        <p className="text-white/80 leading-relaxed mb-8">
          Campus Tours are initiated through collaboration with student
          leadership, faculty, and institutional partners. Each engagement
          is planned intentionally to ensure relevance, order, and lasting
          value.
        </p>

        <Link
          href="/contact"
          className="inline-flex items-center rounded-full
                     bg-amber-400 px-6 py-2 text-black font-medium
                     hover:bg-amber-300 transition"
        >
          Request a Campus Tour
        </Link>
      </motion.section>

      {/* Partner With a Tour */}
      <motion.section
        className="max-w-4xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-semibold mb-6">
          Partner With a Tour
        </h2>

        <p className="text-white/80 leading-relaxed mb-8">
          Institutions, organizations, and individuals may partner with
          Mic’d Up Initiative Campus Tours through sponsorship, logistics,
          research collaboration, or content production support.
        </p>

        <Link
          href="/get-involved/partnerships"
          className="text-sm font-medium text-amber-400 underline underline-offset-4 hover:text-amber-300 transition"
        >
          Explore Tour Partnerships
        </Link>

        <p className="mt-12 text-xs text-white/40">
          © 2026 Mic’d Up Initiative. All rights reserved.
        </p>
      </motion.section>

    </section>
  );
}
