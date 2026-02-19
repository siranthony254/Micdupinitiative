"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const BACKGROUNDS = [
  "/images/background-1.jpg",
  "/images/background-2.jpg",
  "/images/background-3.jpg",
  "/images/background-4.jpg",
  "/images/background-5.jpg",
];

export function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 7000); // slow, premium cadence

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Top-right brand label */}
      <div className="absolute top-6 left-6 text-emerald-500 font-semibold tracking-wide">
        Mic'd Up Initiative
      </div>

      {/* Background slideshow */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={BACKGROUNDS[index]}
              alt="Campus dialogue and collaboration"
              fill
              priority
              className="object-cover object-center brightness-[0.6] contrast-[1.05]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-950/90" />
      </div>

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative max-w-4xl px-6 md:px-10 text-center"
      >
        {/* Headline */}
        <h1 className="mb-2 tracking-tight leading-tight">
          <span
            className="
              block text-4xl md:text-6xl lg:text-7xl
              font-extrabold text-white
              whitespace-nowrap
            "
          >
            VOICING A GENERATION
          </span>

          <span
            className="
              mt-3 inline-block
              text-3xl md:text-5xl lg:text-6xl
              font-extrabold
              bg-white text-slate-800
              px-5 py-2
            "
          >
            SHAPING CULTURE
          </span>
        </h1>

        {/* Subtext */}
        <div className="mt-6 space-y-3">
          <p className="text-base md:text-lg text-white/90 leading-relaxed">
            Mic’d Up Initiative (MUI) is a mission-driven platform committed to transforming campus culture by
            amplifying authentic student voices, talents, and ideas through storytelling, mentorship, productions, and public conversations, raising a renewed
            generation of young people formed into holistic excellence across Kenyan universities and beyond.
          </p>

          <p className="text-base md:text-lg text-white/75 leading-relaxed">
            Society is shaped by voices. We exist to amplify responsible ones
            across campus—and cultivate cultural influence that endures. Through dialogue, storytelling, and research, we preserve ideas
            worthy of longevity across higher education institutions.
          </p>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-10 flex justify-center"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/About/OurStory"
            className="
              inline-flex items-center gap-2
              rounded-full
              border border-white/60
              px-8 py-3
              text-sm md:text-base font-medium
              text-white
              hover:bg-white hover:text-slate-900
              transition-all duration-300
            "
          >
            Learn More
            <span className="text-lg leading-none">↓</span>
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}
