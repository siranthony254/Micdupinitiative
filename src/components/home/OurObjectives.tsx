"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const bounce = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    y: -8,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  }
};

const objectives = [
  {
    number: "1",
    title: "Transform Mindsets Through Purposeful Media",
    description: "Produce value-driven films, podcasts, and educational content that renew minds and inspire excellence in academics and life.",
    icon: "🎬"
  },
  {
    number: "2",
    title: "Build a Generation Rooted in Values & Wisdom",
    description: "Produce content that instills sound doctrine, moral clarity, and practical wisdom, equipping youth to navigate school and life.",
    icon: "🌱"
  },
  {
    number: "3",
    title: "Inspire Academic & Life Excellence",
    description: "Promote a balanced approach to success through consistent, relatable, and impactful multimedia content.",
    icon: "🎓"
  },
  {
    number: "4",
    title: "Raise Talented, Confident, and Responsible Youth",
    description: "Identify, mentor, and uplift students with creative, leadership, and storytelling potential through programs and events.",
    icon: "⭐"
  },
  {
    number: "5",
    title: "Create High-Impact Events That Connects Campus to The World",
    description: "Host summits, mentorship programs, and campus engagements that expose campus potential to the world.",
    icon: "🌍"
  },
  {
    number: "6",
    title: "Global Ethical Content Leadership",
    description: "Position Mic'd Up Initiative as a thought leader in ethical and transformative youth content, establishing standards for creativity, integrity, and impact.",
    icon: "🏆"
  }
];

export default function OurObjectives() {
  return (
    <section className="relative bg-slate-950 text-white py-20 overflow-hidden">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-200px] left-[-120px] h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-[-220px] right-[-180px] h-[520px] w-[520px] rounded-full bg-white/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-amber-300">
            Our Objectives
          </span>
          
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Key Objectives
          </h2>
        </motion.div>

        {/* Objectives Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {objectives.map((objective, index) => (
            <motion.div
              key={objective.number}
              variants={bounce}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
                {/* Number and Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20">
                    <span className="text-amber-400 font-bold text-lg">{objective.number}</span>
                  </div>
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {objective.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-amber-400 mb-3 group-hover:text-amber-300 transition-colors">
                  {objective.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/70 leading-relaxed">
                  {objective.description}
                </p>

                {/* Decorative Bottom Line */}
                <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-6 py-3">
            <span className="text-amber-300 text-sm font-medium">
              Purpose-Driven • Value-Centered • Impact-Focused
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
