"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function WhyThisMatters() {
  return (
    <section className="relative bg-slate-950 text-white py-20 overflow-hidden">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-200px] left-[-120px] h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-[-220px] right-[-180px] h-[520px] w-[520px] rounded-full bg-white/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Section Header */}
          <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-amber-300">
            Why This Matters Now
          </span>
          
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-12">
            Why This Matters Now
          </h2>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                Africa has the youngest population on earth — more than 400 million people between 15 and 35. By 2050, that number will exceed 830 million. This is either the greatest resource in human history, or the greatest unmanaged risk — depending entirely on what happens to those young people during their formation years.
              </p>
              
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                Campuses are formation ground. And right now, formation is broken. We are not waiting for governments to fix it. We are building the fix from inside.
              </p>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="mt-12 flex justify-center">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
