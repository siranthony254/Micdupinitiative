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

export default function MentorshipPage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen bg-neutral-950 text-white overflow-hidden">
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
                backgroundImage: `url('/images/background-${currentImage + 1}.jpg')`
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
              We Shape People Before Platforms
            </h1>
            <p className="mx-auto text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
              Our mentorship framework exists to shape individuals who steward ideas, communities, and culture with integrity.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-24">
        {/* Premium Ambient Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-200px] left-[-120px] h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute bottom-[-220px] right-[-180px] h-[520px] w-[520px] rounded-full bg-white/5 blur-[140px]" />
        </div>

        <div className="relative">

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Why We Mentor */}
        <motion.section
          variants={bounce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-6">
              Why We Mentor
            </h2>

            <div className="space-y-4">
              <p className="text-lg text-white/80 leading-relaxed">
                Institutions outlive moments. Content without character fades.
                Platforms without people collapse.
              </p>

              <p className="text-lg text-white/80 leading-relaxed">
                Mentorship ensures the mission is carried forward by individuals
                formed in responsibility, values, and purpose.
              </p>

              <p className="text-xl font-medium text-white mt-6">
                Impact is measured by people who can say: "I was formed here."
              </p>
            </div>
          </div>
        </motion.section>

        {/* Who It's For */}
        <motion.section
          variants={bounce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl mt-12"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-6">
              Who This Is For
            </h2>

            <p className="text-lg text-white/80 leading-relaxed mb-6">
              This track is selective - designed for individuals ready for
              responsibility, not visibility.
            </p>

            <div className="space-y-3">
              {[
                "Campus Ambassadors and student representatives",
                "Emerging student leaders across disciplines", 
                "Creatives, thinkers, and organizers aligned with MUI values",
                "Students prepared for stewardship and accountability"
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                  <p className="text-white/70 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2">
              <span className="text-amber-300 text-sm font-medium">
                Not an open crowd program - a formation track
              </span>
            </div>
          </div>
        </motion.section>

        {/* Cohort + Rhythm Cards */}
        <motion.section
          variants={bounce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="mt-14"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-6">
            The Cohort System & Rhythm
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Two cohorts per year",
              "One academic semester (3 months)",
              "Fully online and multi-campus",
              "Weekly personal formation tasks",
              "Monthly closed cohort sessions",
              "Progress tracking & accountability",
            ].map((item, index) => (
              <motion.div
                key={item}
                variants={bounce}
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                      <span className="text-amber-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-white/80 leading-relaxed">{item}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pillars */}
        <motion.section
          variants={bounce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-14"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-6">
            What We Form
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Character & Values",
                desc: "Integrity, stewardship, discipline, responsibility.",
                icon: " Integrity"
              },
              {
                title: "Clarity & Purpose", 
                desc: "Identity, conviction, direction.",
                icon: " Purpose"
              },
              {
                title: "Leadership Capacity",
                desc: "Communication, initiative, service.",
                icon: " Leadership"
              },
              {
                title: "Institutional Thinking",
                desc: "Building beyond self and sustaining impact.",
                icon: " Impact"
              },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                variants={bounce}
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-amber-400 font-bold text-lg">{pillar.icon[0]}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-amber-200 mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/Programs/cohort-framework"
              className="inline-flex items-center rounded-full border border-amber-400 bg-amber-400 px-8 py-3 text-sm font-semibold text-black
                         hover:bg-amber-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-400/20
                         transition active:scale-[0.97]"
            >
              Our Cohort Framework
              <span className="ml-2 text-lg">+</span>
            </Link>
          </div>
        </motion.section>

        {/* CTA Block */}
        <motion.section
          variants={bounce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-16 max-w-4xl"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-6">
              Get Involved
            </h2>

            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Mentorship at MUI is by invitation and alignment. Not everyone is
              called to the same lane - but everyone is called to steward what
              they carry.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/mentorship/apply"
                className="rounded-full bg-amber-400 px-8 py-3 text-sm font-semibold text-black
                           hover:bg-amber-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-400/20
                           transition active:scale-[0.97]"
              >
                Join a Mentorship Cohort
              </Link>

              <Link
                href="/Get-Involved/Ambassadors"
                className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white
                           hover:bg-white/5 hover:border-white/40 hover:scale-[1.02]
                           transition active:scale-[0.97]"
              >
                Become a Campus Ambassador
              </Link>

              <Link
                href="/Get-Involved/Partnerships"
                className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white
                           hover:bg-white/5 hover:border-white/40 hover:scale-[1.02]
                           transition active:scale-[0.97]"
              >
                Partner With Formation
              </Link>
            </div>
          </div>

          <p className="mt-12 text-xs text-white/35 border-t border-white/10 pt-5 text-center">
            © 2026 Mic'd Up Initiative. All rights reserved.
          </p>
        </motion.section>
        </div>
      </div>
    </main>
  );
}
