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
            <h3 className="text-lg font-medium">{director.name}</h3>

            {/* Role */}
            <p className="mt-1 text-sm text-amber-400">
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
    bio: "Provides overall vision and strategic direction for the Mic’d Up Initiative across campuses.",
    photo: "/directors/President.jpg",
  },
  {
    id: "Vice-President",
    name: "David Testimony",
    department: "Vice President",
    bio: "Oversees talent development, leadership formation, and campus-based mentorship programs.",
    photo: "/directors/V.President.jpeg",
  },
  {
    id: "Secretariat",
    name: "Daisy Mutheu",
    department: "Secretariat",
    bio: "Leads content strategy, podcasts, talks, and documentary storytelling across platforms.",
    photo: "",
  },
  {
    id: "Media & Communications",
    name: "John Mwandown",
    department: "Media & Communications",
    bio: "Manages all media and communications efforts across platforms.",
    photo: "/directors/Communications.jpeg",
  },
  {
    id: "Content, Research & Insights",
    name: "Hopewin Adams",
    department: "Content, Research & Insights",
    bio: "Manages institutional partnerships, sponsorships, and long-term sustainability efforts.",
    photo: "/directors/Content.jpeg",
  },
  {
    id: "Events, Talents & Mentorship",
    name: "Peter Bahati",
    department: "Events, Talents & Mentorship",
    bio: "Oversees talent development, leadership formation, and campus-based mentorship programs.",
    photo: "",
  },
   {
    id: "Productions",
    name: "Sandra Mutanu",
    department: "Productions",
    bio: "Manages all production efforts across platforms.",
    photo: "",
  },
];
