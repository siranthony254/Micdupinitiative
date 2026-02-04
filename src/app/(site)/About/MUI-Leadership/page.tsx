"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeZoom = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

export default function FoundingDirectorsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      {/* Header */}
      <motion.header
        className="mb-16 max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={fadeZoom}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-semibold text-amber-400">Founding Directors</h1>
        <p className="mt-4 text-white/70">
          The leadership team guiding the vision, governance, and strategic
          direction of the Mic’d Up Initiative.
        </p>
      </motion.header>

      {/* Directors Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {DIRECTORS.map((director, index) => (
          <motion.article
            key={director.id}
            variants={fadeZoom}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            {/* Image */}
            <div className="relative mb-5 aspect-square overflow-hidden rounded-xl bg-white/10">
              <Image
                src={director.photo}
                alt={director.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index < 3}
              />
            </div>

            {/* Name */}
            <h3 className="text-lg font-medium text-amber-400">{director.name}</h3>

            {/* Role */}
            <p className="mt-1 text-sm text-emerald-400 font-semibold">
              {director.department}
            </p>

            {/* Bio */}
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              {director.bio}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------
   Stable Static Data
--------------------------------- */
const DIRECTORS = [
  {
    id: "President",
    name: "Sir Anthony",
    department: "Founder & President",
    bio: "The visionary behind MUI, leading strategy, mission alignment, and institutional growth. Responsible for setting the direction, fostering partnerships, and ensuring MUI’s initiatives create lasting impact across campuses and beyond.",
    photo: "/directors/President.jpg",
  },
  {
    id: "Vice-President",
    name: "David Testimony",
    department: "Vice President",
    bio: "Supports the President in overseeing operations, executing strategy, and mentoring department leads. Ensures cohesion across teams while driving innovation and maintaining MUI’s core values.",
    photo: "/directors/V.President.jpeg",
  },
  {
    id: "Secretariat",
    name: "Daisy Mutheu",
    department: "Secretariat",
    bio: "The operational backbone of MUI, coordinating internal workflows, governance, documentation, and communication. Ensures all departments function efficiently and remain aligned with the vision.",
    photo: "",
  },
  {
    id: "Media & Communications",
    name: "John Mwandown",
    department: "Media & Communications",
    bio: "Manages MUI’s brand, public presence, and communication channels. Crafts messaging, promotes initiatives, and builds relationships to extend MUI’s influence and visibility nationally and beyond.",
    photo: "/directors/Communications.jpeg",
  },
  {
    id: "Content, Research & Insights",
    name: "Hopewin Adams",
    department: "Content, Research & Insights",
    bio: "Leads content direction, storytelling, and campus research initiatives. Translates student perspectives, trends, and insights into actionable strategies, engaging content, and knowledge-driven impact.",
    photo: "/directors/Content.jpeg",
  },
  {
    id: "Events, Talents & Mentorship",
    name: "Peter Bahati",
    department: "Events, Talents & Mentorship",
    bio: "Designs and executes MUI’s engagement platforms, mentorship programs, and talent showcases. Builds the next generation of campus ambassadors, shaping leaders who embody MUI’s values.",
    photo: "",
  },
  {
    id: "Productions",
    name: "Sandra Mutanu",
    department: "Productions",
    bio: "Oversees all visual and audio production for MUI, including podcasts, documentaries, and event recordings. Ensures high-quality storytelling that amplifies voices and ideas that matter.",
    photo: "",
  },
];
