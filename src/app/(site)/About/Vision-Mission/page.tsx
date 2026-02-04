"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function VisionMissionPage() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 bg-slate-900 min-h-screen text-white overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-220px] left-[-180px] w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-[140px]" />
        <div className="absolute bottom-[-260px] right-[-200px] w-[600px] h-[600px] rounded-full bg-white/5 blur-[160px]" />
      </div>

      {/* Page Header */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mb-20"
      >
         <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
          Vision & Mission
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Vision & Mission
        </h1>
        <p className="mt-5 text-lg text-white/70 leading-relaxed">
          The philosophical foundation guiding the Mic’d Up Initiative —
          defining why we exist, what we pursue, and the future we are
          intentionally shaping across campuses.
        </p>
      </motion.header>

      {/* Vision & Mission Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10"
      >
        <Card
          title="Our Mission"
          subtitle="Why We Exist"
          body={[
            "To build a sustained movement that amplifies campus voices — spotlighting students, ideas, talents, policies, and conversations shaping campus life and youth culture — through transformative media, intentional mentorship, and purpose-driven experiences.",
            "We exist to raise a generation marked by excellence, integrity, and purposeful living — equipped to influence culture responsibly on campus and beyond.",
          ]}
        />

        <Card
          title="Our Vision"
          subtitle="Our North Star"
          body={[
            "Becoming a transformative movement that shapes the culture of campuses by amplifying voices, ideas, and issues that matter.",
            "We envision a renewed generation of young people formed into holistic excellence — intellectually grounded, creatively bold, morally anchored, and socially responsible — across campuses and into society.",
          ]}
        />
      </motion.div>

      {/* Core Values */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-28 relative z-10"
      >
         <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
          Core Values
        </span>
        <header className="max-w-3xl mb-14">
          <h2 className="text-3xl font-semibold text-amber-300">
            Core Values
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            These values shape our culture, inform our decisions,
            and define how we steward influence across campuses.
          </p>
        </header>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <Value title="Excellence" description="We pursue the highest standards academically, creatively, professionally, and personally — setting a benchmark for youth culture." />
          <Value title="Transformation" description="We commit to initiatives that produce measurable, lasting, and positive change in the lives of young people and their communities." />
          <Value title="Integrity" description="We uphold honesty, truthfulness, transparency, and responsibility in our content, relationships, and operations." />
          <Value title="Innovation" description="We embrace bold ideas, creative solutions, and new approaches to engage and empower youth effectively." />
          <Value title="Empowerment" description="We equip young people with the knowledge, skills, and mentorship they need to lead confidently and excel in life." />
        </motion.div>
      </motion.section>

      {/* Closing */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-24 max-w-4xl relative z-10"
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
   Card Component for Vision & Mission
------------------------------*/
function Card({ title, subtitle, body }: { title: string; subtitle: string; body: string[] }) {
  return (
    <motion.div
      className="p-8 rounded-2xl bg-white/5 border border-white/10 transition-transform hover:scale-105 hover:shadow-xl hover:shadow-amber-400/20"
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-xs tracking-widest uppercase text-amber-400">{title}</span>
      <h2 className="mt-4 text-2xl font-semibold">{subtitle}</h2>
      <div className="mt-4 space-y-3 text-white/80 leading-relaxed">
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </motion.div>
  );
}

/* -----------------------------
   Core Value Component
------------------------------*/
function Value({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      className="p-6 rounded-xl bg-white/5 border border-white/10 transition-colors hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-400/10 cursor-pointer"
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
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      <p className="mt-3 text-sm text-white/70 leading-relaxed">{description}</p>
    </motion.div>
  );
}
