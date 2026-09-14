"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Mic, MessagesSquare, Sparkles, Ear, Handshake, BadgeCheck } from "lucide-react";

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
   Campus Tours — the smallest scale

   A tour is a single-campus visit; everything else on this page is a
   larger-scale extension of the same listening approach. None of it,
   tours included, has actually run yet.
------------------------------ */
const tourActivities = [
  {
    title: "Campus Podcast Recordings",
    desc: "Live or recorded conversations capturing authentic student experiences and campus realities.",
    icon: Mic
  },
  {
    title: "MUI Talks & Panel Conversations",
    desc: "Curated discussions around purpose, leadership, culture, and responsibility.",
    icon: MessagesSquare
  },
  {
    title: "Creative & Talent Showcases",
    desc: "Performances, spoken word, drama, and artistic expression revealing campus creativity.",
    icon: Sparkles
  },
  {
    title: "Campus Listening Sessions",
    desc: "Research-driven dialogues surfacing student needs, challenges, and opportunities.",
    icon: Ear
  },
  {
    title: "Leadership & Club Engagements",
    desc: "Strategic meetings with student leaders and societies for alignment and long-term impact.",
    icon: Handshake
  },
  {
    title: "Ambassador Identification",
    desc: "Recognizing and onboarding purpose-driven students to steward MUI's mission.",
    icon: BadgeCheck
  },
];

/* -----------------------------
   Larger-scale formats — built on the same
   listening approach as a Campus Tour, none run yet
------------------------------ */
const eventCards: Array<{
  title: string;
  points: string[];
  note: string;
}> = [
  {
    title: "MUC Talks (Stage Conversations)",
    points: [
      "Students and young thinkers",
      "Academics and educators",
      "Creatives and cultural voices",
      "Policy and industry contributors",
    ],
    note: "These conversations will be curated, recorded, and preserved—ensuring ideas outlive the event itself.",
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
  {
    title: "Summits & Forums",
    points: [
      "Connect campuses across regions",
      "Encourage cross-cultural learning",
      "Address pressing youth and campus themes",
    ],
    note: "These forums are meant to shape collective direction and thought leadership, once they exist.",
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
    <main className="relative min-h-screen text-white overflow-hidden" style={{backgroundColor: '#0D1F35'}}>
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
              Events &amp; Campus Tours
            </h1>
            <p className="mx-auto text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
              Where campus will meet the world.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-24">
        <div className="relative">
          {/* Hero Content Below Background */}
          <motion.section
            className="max-w-4xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
              Where This Is Going
            </span>

            <div className="mt-6 space-y-3 text-white/75 leading-relaxed">
              <p>
                MUI hasn't held an event yet — not a tour, not a talk, not a
                summit. This page is the architecture we're building toward,
                from the smallest scale (a single campus visit) to the largest
                (a multi-campus summit).
              </p>
              <p>
                We're designing platforms where campus voices can meet real-world
                conversations—where ideas can be tested, talent discovered, and
                students able to engage beyond their immediate environment.
              </p>
              <p className="font-medium text-white">
                Student life does not exist in isolation; it is a vital thread in the fabric of society. It's a life
                at the intersection of Education, Culture, Policy, Industry and Society. MUI exists to bridge these
                worlds—bringing campus into wider conversations while inviting external voices to engage
                meaningfully with student realities.
              </p>

              <p className="mt-3 text-base font-medium text-emerald-400">
                The events we build won't be just gatherings. They're meant to be catalysts for change, connection, and culture-shaping.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="/contact" label="Request a Campus Tour" />
              <CTAButton href="/contact" label="Host a Campus Conversation" />
              <CTAButton href="/Get-Involved/Partnerships" label="Partner With MUI" />
              <CTAButton
                href="/contact"
                label="Participate as a Speaker"
                variant="ghost"
              />
            </div>
          </motion.section>

          {/* Campus Tours — the smallest scale */}
          <motion.section
            variants={bounce}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-16"
          >
            <div className="mb-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Campus Tours — The Smallest Scale
                </h2>
                <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                  Not yet run
                </span>
              </div>
              <p className="mt-2 max-w-3xl text-sm text-white/60 leading-relaxed">
                A Campus Tour is designed to be a listening journey: a single
                visit to one campus. When MUI arrives, the plan isn't to bring a
                programme — it's to listen, ask, converse, document, and learn,
                connecting what we hear to the wider MUI network where it's
                relevant. It's the smallest, most frequent format on this page;
                everything below is the same approach at a larger scale.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tourActivities.map((item, index) => (
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
                  <div className="h-full rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5
                             hover:border-amber-400/30 hover:bg-white/[0.04]
                             cursor-default transition-all duration-300">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-amber-300 transition">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/70 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Larger-scale formats, none run yet */}
          <section className="mt-16">
            <div className="mb-5">
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                Where We're Going — Larger Formats
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Built on the same listening approach as a Campus Tour, just at a bigger scale. None of this has happened yet.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {eventCards.map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 transition hover:border-amber-400/30"
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
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
