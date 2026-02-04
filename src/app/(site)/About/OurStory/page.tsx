"use client";

import { motion } from "framer-motion";

export default function OurStoryPage() {
  return (
    <section className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Header */}
        <motion.header
          className="mb-14 space-y-4"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
            OUR STORY AND ORIGIN
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-amber-300">
            Our Story
          </h1>

          <p className="text-white/80 leading-relaxed text-lg">
            Mic’d Up Initiative (MUI) is a mission-driven youth institution
            committed to transforming campus culture by amplifying authentic
            student voices, talents, and ideas through storytelling, mentorship,
            research, productions, and public conversations.
          </p>

          <p className="text-white/70 leading-relaxed">
            MUI was born from a simple but urgent realization: campus voices
            exist, but many are unheard, misrepresented, or poorly stewarded.
          </p>
        </motion.header>

        {/* Story Flow */}
        <div className="space-y-16">
          {/* Origin */}
          <motion.section
            className="space-y-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-amber-200">
              The Origin
            </h2>

            <p className="text-white/80 leading-relaxed">
              The journey began as a campus-based podcast—Mic’d Up Campus
              Podcast—hosted by Sir Anthony. The initial vision was
              clear: to create space for students, lecturers, and education
              stakeholders to speak honestly about campus life and the forces
              shaping it.
            </p>

            <p className="text-white/80 leading-relaxed">
              While engaging students at Murang’a University of Technology, Sir
              Anthony encountered something deeper than content opportunities.
              He identified purpose-led voices, quiet leaders, thoughtful
              thinkers, and students carrying a burden for meaning, integrity,
              and direction.
            </p>

            <p className="text-white/80 leading-relaxed">
              Through conversations, shared reflections, and vision-casting
              moments, it became evident that what was emerging was not merely
              a podcast—but a calling toward intentional cultural formation.
            </p>
          </motion.section>

          {/* Formation */}
          <motion.section
            className="space-y-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-white/80 leading-relaxed">
              As the vision matured, it attracted alignment. A core team of
              directors—David Testimony, Daisy Mutheu, Hopewin Adams, John
              Mwandown, Sandra Mutanu, and Peter Bahati—came together around a
              shared burden, values, and aspiration.
            </p>

            <p className="text-white/80 leading-relaxed">
              Each director now oversees a strategic department, ensuring that
              MUI operates with clarity, excellence, and long-term impact across
              higher education institutions.
            </p>

            <p className="font-medium text-amber-300">
              What we do is not just about amplifying voices—it's about forming
              them with purpose, integrity, and clarity.
            </p>
          </motion.section>

          {/* What We Do */}
          <motion.section
            className="space-y-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-amber-200">
            Our Operations
            </h2>

            <p className="text-white/80 leading-relaxed">
              MUI operates at the intersection of content, conversation, and
              character formation. We use media not merely for entertainment,
              but for stewardship, dignity, and direction.
            </p>

            <p className="text-white/80 leading-relaxed">
              Through podcasts, documentaries, campus research, creative
              storytelling, mentorship programs, and purpose-driven events, we
              amplify voices that shape culture responsibly and truthfully.
            </p>

            <p className="font-medium text-amber-300">
              We are intentional about what we amplify and why we amplify it.
            </p>
          </motion.section>

          {/* Foundation */}
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-amber-200">
              Our Foundation
            </h2>

            <p className="text-white/80 leading-relaxed">
              MUI is rooted in timeless principles, including the wisdom of Romans 12, which calls us into renewing
              our minds, our belief that what we consume shapes our thoughts and inspired by the wisdom of Titus
              2, which emphasizes teaching soundness. We are committed to
              iniatives that builds clarity, not confusion.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-amber-200 font-medium mb-4">
                We amplify the voices that matter:
              </p>

              <ul className="space-y-2 text-white/80 list-disc list-inside">
                <li>Voices of integrity</li>
                <li>Voices of purpose</li>
                <li>Voices of leadership</li>
                <li>Voices of transformation</li>
              </ul>
            </div>
          </motion.section>

          {/* Role */}
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-amber-200">
              Our Role
            </h2>

            <p className="text-white/80 leading-relaxed">
              Mic’d Up Initiative exists to restore dignity to youth expression
              and direction to youth culture.
            </p>

            <p className="text-white/80 leading-relaxed">
              As a social enterprise, MUI builds sustainable impact through
              strategic partnerships, research-driven programs, and scalable
              youth-focused solutions—designed to outlive individuals and serve
              generations.
            </p>

            <p className="text-white/80 leading-relaxed">
              From campus conversations to continental dialogues, we are
              equipping young people to think critically, lead responsibly,
              influence meaningfully, and transform the world around them.
            </p>

            <p className="font-semibold text-amber-300">
              Our commitment is not just to be heard—but to ensure a generation
              is formed, grounded, and Mic’d Up. Voicing a Generation Transforming Culture.
            </p>
              <p className="mt-1 text-base font-medium text-emerald-400">
              Join us in this mission.
      </p>
            <p className="pt-10 text-xs text-white/40 border-t border-white/10">
              © 2026 Mic’d Up Initiative. All rights reserved.
            </p>
          </motion.section>
        </div>
      </div>
    </section>
  );
}
