"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

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
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    y: -8,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export default function PartnersPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mykprovo", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const partnershipTypes = [
    {
      icon: "🎓",
      title: "Educational Institutions",
      description: "Universities & colleges, student unions, campus clubs, alumni associations",
      purpose: "Facilitate campus programs, mentorship, and student engagement"
    },
    {
      icon: "📺",
      title: "Media & Content Platforms",
      description: "Journalism schools, filmmakers, documentary producers",
      purpose: "Co-produce podcasts, videos, and youth-focused media content"
    },
    {
      icon: "🏛️",
      title: "Government & Policy Makers",
      description: "Ministry of Education, education boards, youth councils",
      purpose: "Conduct policy research, host national youth summits and forums"
    },
    {
      icon: "🎤",
      title: "Influencers & Thought Leaders",
      description: "Student leaders, alumni, motivational speakers, content creators",
      purpose: "Guest appearances, masterclasses, mentorship, and campaigns"
    },
    {
      icon: "🔬",
      title: "Research & Think Tanks",
      description: "Campus research centers, media institutes, youth policy think tanks",
      purpose: "Provide data-driven insights, credibility, and influence policy"
    },
    {
      icon: "🤝",
      title: "NGOs & Nonprofits",
      description: "Mental health organizations, literacy & education NGOs",
      purpose: "Co-host mentorship programs, workshops, and awareness campaigns"
    },
    {
      icon: "🌍",
      title: "International Youth Movements",
      description: "Global media bodies, leadership networks, research organizations",
      purpose: "Co-create research reports, cross-cultural learning, global conferences"
    },
    {
      icon: "📊",
      title: "Corporate Partners",
      description: "Youth-focused brands, tech companies, educational publishers",
      purpose: "Sponsor programs, provide resources, career opportunities"
    }
  ];

  return (
    <section className="min-h-screen bg-slate-950 text-white">
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
                backgroundImage: `url('/images/partnership-${currentImage + 1}.jpg')`
              }}
            >
              <div className="absolute inset-0 bg-slate-950/70"></div>
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
              Partnerships & Collaborations
            </h1>
            <p className="mx-auto text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
              Mic'd Up Initiative partners with institutions, leaders, and organizations committed to shaping responsible campus culture, youth excellence, and meaningful public discourse.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* Partnership Types Section */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-amber-400">
              Our Partnership Ecosystem
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              We collaborate with diverse partners to create meaningful impact across campus communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnershipTypes.map((partner, index) => (
              <motion.div
                key={index}
                variants={bounce}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {partner.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-amber-400">
                    {partner.title}
                  </h3>
                  <p className="text-sm text-white/70 mb-4 leading-relaxed">
                    {partner.description}
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-amber-300/80 font-medium">
                      Purpose: {partner.purpose}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* Why Partner */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-20"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-sm">
            <h2 className="text-2xl font-medium mb-5">
              Why Partner With Mic'd Up Initiative
            </h2>
            <ul className="space-y-3 text-white/75 list-disc list-inside">
              <li>Direct access to authentic campus communities</li>
              <li>Credible, values-driven youth engagement</li>
              <li>Research-informed media and programming</li>
              <li>Long-term institutional impact beyond one-off campaigns</li>
            </ul>
          </div>
        </motion.section>

        {/* Partnership Form */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg">
            <h2 className="text-2xl font-medium mb-6 text-center">
              Start a Partnership Conversation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization */}
              <div className="space-y-2">
                <label htmlFor="organization" className="text-sm text-white/70 block text-center">
                  Organization / Individual Name
                </label>
                <input
                  id="organization"
                  name="organization"
                  required
                  placeholder="Enter organization name"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label htmlFor="contact_person" className="text-sm text-white/70 block text-center">
                  Contact Person
                </label>
                <input
                  id="contact_person"
                  name="contact_person"
                  required
                  placeholder="Full name"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-white/70 block text-center">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label htmlFor="website" className="text-sm text-white/70 block text-center">
                  Website / Social Link
                </label>
                <input
                  id="website"
                  name="website"
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              {/* Interest */}
              <div className="space-y-2">
                <label htmlFor="partnership_interest" className="text-sm text-white/70 block text-center">
                  Partnership Interest
                </label>
                <textarea
                  id="partnership_interest"
                  name="partnership_interest"
                  rows={5}
                  placeholder="Describe the type of partnership you're interested in..."
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Start Partnership"}
              </button>

              {/* Success Message */}
              {status === "success" && (
                <p className="text-green-400 text-sm text-center">
                  ✅ Thank you! Your partnership request has been received.
                </p>
              )}

              {/* Error Message */}
              {status === "error" && (
                <p className="text-red-400 text-sm text-center">
                  ❌ Something went wrong. Please try again.
                </p>
              )}

              <p className="text-xs text-white/50 leading-relaxed text-center">
                © {new Date().getFullYear()} Mic'd Up Initiative. All rights reserved.
              </p>
            </form>
          </div>
        </motion.section>
      </div>
    </section>
  );
}
