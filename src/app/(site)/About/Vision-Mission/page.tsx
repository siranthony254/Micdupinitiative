"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function VisionMissionPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 bg-slate-900 min-h-screen">

      {/* Page Header */}
      <motion.header
        className="max-w-3xl mb-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Vision & Mission
        </h1>
        <p className="mt-5 text-lg text-white/70 leading-relaxed">
          The philosophical foundation guiding the Mic’d Up Initiative —
          defining why we exist, what we pursue, and the future we are
          intentionally shaping across campuses.
        </p>
      </motion.header>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">

        {/* Mission */}
        <motion.div
          className="p-8 rounded-2xl bg-white/5 border border-white/10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-xs tracking-widest uppercase text-amber-400">
            Our Mission
          </span>

          <h2 className="mt-4 text-2xl font-semibold">
            Why We Exist
          </h2>

          <p className="mt-6 text-white/80 leading-relaxed">
            To build a sustained movement that amplifies campus voices —
            spotlighting students, ideas, talents, policies, and conversations
            shaping campus life and youth culture — through transformative
            media, intentional mentorship, and purpose-driven experiences.
          </p>

          <p className="mt-4 text-white/80 leading-relaxed">
            We exist to raise a generation marked by excellence, integrity,
            and purposeful living — equipped to influence culture responsibly
            on campus and beyond.
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div
          className="p-8 rounded-2xl bg-white/5 border border-white/10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-xs tracking-widest uppercase text-amber-400">
            Our Vision
          </span>

          <h2 className="mt-4 text-2xl font-semibold">
            Our North Star
          </h2>

          <p className="mt-6 text-white/80 leading-relaxed">
            Becoming a transformative movement that shapes the culture of
            campuses by amplifying voices, ideas, and issues that matter.
          </p>

          <p className="mt-4 text-white/80 leading-relaxed">
            We envision a renewed generation of young people formed into
            holistic excellence — intellectually grounded, creatively bold,
            morally anchored, and socially responsible — across campuses and
            into society.
          </p>
        </motion.div>
      </div>

      {/* Core Values */}
      <motion.section
        className="mt-28"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <header className="max-w-3xl mb-14">
          <h2 className="text-3xl font-semibold text-amber-300">
            Core Values
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            These values shape our culture, inform our decisions,
            and define how we steward influence across campuses.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Value
            title="Excellence"
            description="We pursue the highest standards academically, creatively, professionally, and personally — setting a benchmark for youth culture."
          />

          <Value
            title="Transformation"
            description="We commit to initiatives that produce measurable, lasting, and positive change in the lives of young people and their communities."
          />

          <Value
            title="Integrity"
            description="We uphold honesty, truthfulness, transparency, and responsibility in our content, relationships, and operations."
          />

          <Value
            title="Innovation"
            description="We embrace bold ideas, creative solutions, and new approaches to engage and empower youth effectively."
          />

          <Value
            title="Empowerment"
            description="We equip young people with the knowledge, skills, and mentorship they need to lead confidently and excel in life."
          />
        </div>
      </motion.section>

      {/* Closing */}
      <motion.div
        className="mt-24 max-w-4xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lg text-white/70 leading-relaxed">
          Mic’d Up Initiative is a living movement —
          cultivating voices, shaping culture, and forming leaders who
          understand that influence carries responsibility.
        </p>

        <p className="mt-6 text-xs text-white/40">
          © 2026 Mic’d Up Initiative. All rights reserved.
        </p>
      </motion.div>

    </section>
  );
}

/* -----------------------------
   Core Value Card
------------------------------*/
function Value({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="p-6 rounded-xl bg-white/5 border border-white/10 transition-colors"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.03,
        borderColor: "rgb(34 197 94)", // green-500
        boxShadow: "0 0 0 1px rgba(34,197,94,0.35)",
      }}
    >
      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm text-white/75 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
