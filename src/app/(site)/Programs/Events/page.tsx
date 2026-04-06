"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

/* -----------------------------
   CTA Button
------------------------------ */
function CTAButton({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant?: "ghost";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition";

  if (variant === "ghost") {
    return (
      <Link
        href={href}
        className={`${base} border border-white/15 text-white/80 hover:text-white hover:bg-white/10`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} bg-amber-400 text-black hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20`}
    >
      {label}
    </Link>
  );
}

/* -----------------------------
   Event Formats Data
------------------------------ */
const eventCards = [
  {
    title: "Campus Tours",
    points: [
      "Live podcast recordings",
      "Student dialogue and listening sessions",
      "Talent showcases and creative performances",
      "Mentorship meet-ups with student leaders",
    ],
    note: "Campus Tours allow us to listen, learn, and engage directly—without imposing parallel structures or competition.",
  },
  {
    title: "MUC Talks (Stage Conversations)",
    points: [
      "Students and young thinkers",
      "Academics and educators",
      "Creatives and cultural voices",
      "Policy and industry contributors",
    ],
    note: "These conversations are curated, recorded, and preserved—ensuring ideas outlive the event itself.",
  },
  {
    title: "Summits & Forums",
    points: [
      "Connect campuses across regions",
      "Encourage cross-cultural learning",
      "Address pressing youth and campus themes",
    ],
    note: "These forums shape collective direction and thought leadership.",
  },
  {
    title: "Community Dialogues",
    points: [
      "Address specific campus or youth issues",
      "Encourage honest reflection",
      "Build trust across institutions and systems",
    ],
    note: "Sometimes transformation begins in a room—not on a stage.",
  },
];

export default function CommunityEventsPage() {
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
                backgroundImage: `url('/images/events-${currentImage + 1}.jpg')`,
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
              Community & Events
            </h1>
            <p className="mx-auto text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
              Where campus meets the world.
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
          {/* Hero Content Below Background */}
          <motion.section
            className="max-w-4xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
              Community & Events
            </span>

            <div className="mt-6 space-y-3 text-white/75 leading-relaxed">
              <p>
                At Mic'd Up Initiative (MUI), events are intentionally designed
                to foster genuine connection, deep listening, and meaningful
                engagement between campuses and the broader cultural landscape.
              </p>
              <p>
                We design platforms where campus voices meet real-world
                conversations—where ideas are tested, talent is discovered, and
                students engage beyond their immediate environment.
              </p>
              <p className="font-medium text-white">
                Student life does not exist in isolation; it is a vital thread in the fabric of society. It's a life
                at the intersection of Education, Culture, Policy, Industry and Society. MUI exists to bridge these
                worlds—bringing campus into wider conversations while inviting external voices to engage
                meaningfully with student realities.
              </p>
              
              <p className="mt-3 text-base font-medium text-emerald-400">
                Our events are not just gatherings. They are catalysts for change, connection, and culture-shaping.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="/contact" label="Host a Campus Conversation" />
              <CTAButton href="/Get-Involved/Partnerships" label="Partner With MUI" />
              <CTAButton
                href="/contact"
                label="Participate as a Speaker"
                variant="ghost"
              />
            </div>
          </motion.section>

          {/* Event Formats */}
          <section className="mt-14 grid gap-5 sm:grid-cols-2">
            {eventCards.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:border-amber-400/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-amber-400/10 transition"
              >
                <h3 className="text-lg font-semibold text-amber-200 mb-3">
                  {event.title}
                </h3>

                <ul className="space-y-1 text-sm text-white/75 list-disc pl-5">
                  {event.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>

                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  {event.note}
                </p>
              </motion.div>
            ))}
          </section>

        {/* Footer */}
        <p className="mt-12 text-xs text-white/35 border-t border-white/10 pt-5">
          © 2026 Mic'd Up Initiative. All rights reserved.
        </p>
        </div>
      </div>
    </main>
  );
}
