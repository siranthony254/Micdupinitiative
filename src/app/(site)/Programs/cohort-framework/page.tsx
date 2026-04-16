"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function CohortFrameworkPage() {
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const togglePillar = (index: number) => {
    setActivePillar(activePillar === index ? null : index);
  };

  const pillars = [
    {
      title: "Weeks 1-2: Self & Foundations",
      content: "Understanding identity, belief systems, and personal formation. Participants examine their own story, values, and the forces that shaped them."
    },
    {
      title: "Weeks 3-4: Critical Thinking",
      content: "Learning to distinguish information from wisdom. Participants develop frameworks for analyzing ideas, identifying assumptions, and evaluating arguments."
    },
    {
      title: "Weeks 5-6: Problem Identification",
      content: "Moving from symptoms to root causes. Participants learn to identify real-world problems with precision and clarity."
    },
    {
      title: "Weeks 7-8: Expression & Voice",
      content: "Developing the ability to express ideas confidently. Participants practice articulation, presentation, and standing behind their convictions."
    },
    {
      title: "Weeks 9-10: Content Creation",
      content: "Producing documented, shareable content. Participants learn to create public content that communicates their ideas effectively."
    },
    {
      title: "Weeks 11-12: Integration & Impact",
      content: "Bringing it all together. Participants develop their final projects and prepare for continued growth beyond the cohort."
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Hero Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-amber-300">
            Formation Framework
          </span>
          
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            MUI Cohort Framework
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
            A 12-week formation journey designed to develop clear thinkers with responsible voices who can shape culture and solve real problems.
          </p>
        </motion.div>

        {/* Core Objective */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="border-l-4 border-amber-400 pl-6 py-4 bg-amber-400/5 rounded-r-2xl">
            <p className="text-sm font-medium text-amber-300 mb-2">CORE OBJECTIVE</p>
            <p className="text-xl font-semibold text-white">
              Develop clear thinkers with responsible voices who can identify real problems and express solutions with clarity and conviction.
            </p>
          </div>
        </motion.div>

        {/* Pillar Timeline */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative pl-8 mb-16"
        >
          {/* Timeline Line */}
          <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-400 to-amber-400/20"></div>

          <h2 className="text-2xl font-semibold text-amber-400 mb-8">12-Week Journey</h2>

          <div className="space-y-4">
            {pillars.map((pillar, index) => (
              <div key={index} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-8 top-6 w-4 h-4 bg-amber-400 rounded-full border-4 border-neutral-950"></div>

                {/* Pillar Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => togglePillar(index)}
                  className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                    activePillar === index
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-white/10 bg-white/5 hover:border-amber-400/30 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-amber-200">{pillar.title}</h3>
                    <div className={`transform transition-transform duration-300 ${
                      activePillar === index ? "rotate-180" : ""
                    }`}>
                      <span className="text-amber-400">+</span>
                    </div>
                  </div>

                  {activePillar === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <p className="text-white/70 leading-relaxed">{pillar.content}</p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Goals Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-amber-400 mb-8">Cohort Goals</h2>

          <div className="grid gap-6">
            <div className="border-2 border-amber-400 rounded-2xl p-6 bg-amber-400/5">
              <p className="text-sm font-medium text-amber-300 mb-2">PRIMARY GOAL</p>
              <p className="text-xl font-semibold text-white">Develop clear thinkers with responsible voices.</p>
            </div>

            <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
              <p className="text-sm font-medium text-amber-300 mb-4">By end of 12 weeks, each participant will:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-amber-400 mt-1">+</span>
                  <p className="text-white/70">Understand themselves and the belief systems that shaped them</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-amber-400 mt-1">+</span>
                  <p className="text-white/70">Think critically about ideas - distinguishing information from wisdom</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-amber-400 mt-1">+</span>
                  <p className="text-white/70">Identify a real-world problem with precision</p>
                </div>
              </div>
            </div>

            <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
              <p className="text-sm font-medium text-amber-300 mb-4">And they will be able to:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-amber-400 mt-1">+</span>
                  <p className="text-white/70">Break down an issue clearly - root cause, not just symptom</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-amber-400 mt-1">+</span>
                  <p className="text-white/70">Express an idea confidently and stand behind it</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-amber-400 mt-1">+</span>
                  <p className="text-white/70">Produce public content that is documented and shareable</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Design Note */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="border border-white/10 rounded-2xl p-6 bg-white/5"
        >
          <h3 className="text-lg font-semibold text-amber-400 mb-3">Why Online & Intercampus</h3>
          <p className="text-white/70 leading-relaxed mb-6">
            The cohort is fully online and spans multiple campuses simultaneously - by design, not default. Campus clubs create institutional friction: approval processes, physical logistics, single-campus access. A student at a TVET in Kisumu and a student at a university in Nairobi walk the same formation journey, at the same time. The result is also richer: cohort members are formed alongside peers from different institutions, disciplines, and realities. That diversity is part of the formation.
          </p>
          
          <div className="flex flex-wrap gap-3">
            {[
              "2 cohorts / year",
              "1 semester (3 months)",
              "15-25 participants per cohort",
              "Fully online",
              "Intercampus"
            ].map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-white/35 border-t border-white/10 pt-5">
            © 2026 Mic'd Up Initiative. All rights reserved.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
