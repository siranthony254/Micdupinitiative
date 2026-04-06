"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function ClosingLine() {
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-amber-400 mb-6">
            Voices shape Society!
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-4xl mx-auto">
            We exist to ensure that the voices shaping tomorrow's Africa are formed with purpose, grounded in integrity, and heard while they are still young enough to act on what they believe.
          </p>

          {/* Decorative Element */}
          <div className="mt-12 flex justify-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
