"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function CampusToursPage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-neutral-950 text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/images/campus-${currentImage + 1}.jpg')`
              }}
            >
              <div className="absolute inset-0 bg-neutral-950/70"></div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-amber-400">
              Campus Tours
            </h1>
            <p className="mx-auto text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
              Mic'd Up Initiative Campus Tours are immersive engagements designed to listen deeply, amplify voices, identify leadership, and steward campus culture.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Divider */}
        <div className="mb-8 h-px bg-white/10" />

        {/* What is Tour */}
        <motion.section
          variants={bounce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-4">
            What a Campus Tour Is
          </h2>

          <p className="text-white/80 leading-relaxed text-sm md:text-base mb-6">
            A Campus Tour is not a single event. It is a structured engagement
            combining conversation, creativity, research, and leadership
            formation — adapted to each campus while preserving MUI's mission.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs tracking-widest uppercase text-amber-300">
              Structured
            </span>
            <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs tracking-widest uppercase text-amber-300">
              Intentional
            </span>
            <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs tracking-widest uppercase text-amber-300">
              Campus-specific
            </span>
          </div>
        </motion.section>

        {/* Cards */}
        <motion.section
          className="mt-10"
          variants={bounce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-amber-400">
              What Happens on Tour
            </h2>
            <p className="mt-2 text-white/65 text-sm md:text-base max-w-3xl mx-auto">
              Each engagement is designed to surface authentic student realities,
              strengthen leadership, and document culture responsibly.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Campus Podcast Recordings",
                desc: "Live or recorded conversations capturing authentic student experiences and campus realities.",
                icon: "🎙️"
              },
              {
                title: "MUI Talks & Panel Conversations",
                desc: "Curated discussions around purpose, leadership, culture, and responsibility.",
                icon: "💬"
              },
              {
                title: "Creative & Talent Showcases",
                desc: "Performances, spoken word, drama, and artistic expression revealing campus creativity.",
                icon: "🎭"
              },
              {
                title: "Campus Listening Sessions",
                desc: "Research-driven dialogues surfacing student needs, challenges, and opportunities.",
                icon: "👂"
              },
              {
                title: "Leadership & Club Engagements",
                desc: "Strategic meetings with student leaders and societies for alignment and long-term impact.",
                icon: "🤝"
              },
              {
                title: "Ambassador Identification",
                desc: "Recognizing and onboarding purpose-driven students to steward MUI's mission.",
                icon: "⭐"
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={bounce}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5
                           hover:border-amber-400/40 hover:bg-white/[0.07]
                           hover:shadow-lg hover:shadow-amber-400/10
                           cursor-default transition-all duration-300">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-amber-300 transition">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/70 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="mt-4 h-px w-full bg-white/10" />

                  <p className="mt-3 text-[11px] text-white/45 tracking-wide">
                    Structured • Intentional • Campus-specific
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Visited */}
        <motion.section
          variants={bounce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-12 max-w-4xl"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-4">
              Campuses We've Visited
            </h2>

            <p className="text-white/75 leading-relaxed text-sm md:text-base mb-3">
              Mic'd Up Initiative has engaged with diverse public and private
              universities, adapting each tour to local campus culture while
              maintaining excellence and depth.
            </p>

            <p className="text-xs text-white/50 italic">
              A detailed archive and documentation will be published progressively.
            </p>
          </div>
        </motion.section>

        {/* CTA Box */}
        <motion.section
          variants={bounce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-12 max-w-4xl"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 hover:border-amber-400/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-amber-400/10 transition-all duration-300">
            <h2 className="text-xl md:text-2xl font-semibold text-amber-400 mb-4">
              Bring MUI to Your Campus
            </h2>

            <p className="text-white/75 leading-relaxed text-sm md:text-base mb-6">
              Campus Tours are initiated through collaboration with student
              leadership, faculty, and institutional partners — planned
              intentionally for relevance and lasting value.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black
                           hover:bg-amber-300 hover:scale-[1.02]
                           transition active:scale-[0.97]"
              >
                Request a Campus Tour
              </Link>

              <Link
                href="/Get-Involved/Partnerships"
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white
                           hover:bg-white/5 hover:border-white/40 hover:scale-[1.02]
                           transition active:scale-[0.97]"
              >
                Explore Partnerships
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <p className="mt-10 text-xs text-white/35 border-t border-white/10 pt-5 max-w-4xl">
          © 2026 Mic’d Up Initiative. All rights reserved.
        </p>
      </div>
    </section>
  );
}
