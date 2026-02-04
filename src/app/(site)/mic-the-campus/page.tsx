"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MicTheCampusPage() {
  return (
    <PageShell
      title="Mic the Campus"
      subtitle="Enable student voices. Fund dialogue. Equip ideas to travel further."
    >
      {/* Intro */}
      <motion.section
        className="max-w-3xl mb-12"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lg text-white/80 leading-relaxed">
          Mic’d Up Initiative exists to amplify student voices across African
          campuses. This requires more than ideas — it requires tools,
          platforms, and sustained support.
        </p>
      </motion.section>

      {/* Contribution Cards */}
      <motion.section
        className="grid gap-6 sm:grid-cols-2 mb-16"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <ContributionCard
          title="Fund the Voice"
          description="Support student-led conversations, research, and public dialogue through direct financial contributions."
          href="/get-involved/funding"
        />

        <ContributionCard
          title="Equip the Voice"
          description="Contribute cameras, microphones, recording equipment, or production resources."
          href="/get-involved/equipment"
        />

        <ContributionCard
          title="Sponsor the Platform"
          description="Sponsor campus podcasts, stage talks, mentorship tours, or research initiatives."
          href="/get-involved/sponsorships"
        />

        <ContributionCard
          title="Endorse the Vision"
          description="Partner institutionally, endorse the initiative, or align your organization with the mission."
          href="/get-involved/partnerships"
        />
      </motion.section>

      {/* Impact */}
      <motion.section
        className="max-w-3xl mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-5">
          What Your Contribution Enables
        </h2>

        <ul className="space-y-3 text-white/70 text-sm md:text-base list-disc pl-5">
          <li>Campus-based podcasts and talk series</li>
          <li>Student research and policy conversations</li>
          <li>Mentorship and leadership formation tours</li>
          <li>Documentation of campus culture and innovation</li>
        </ul>
      </motion.section>

      {/* CTA Buttons */}
      <motion.section
        className="flex flex-wrap gap-4"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <CTAButton
          href="/contact"
          primary
          text="Start a Conversation"
        />

        <CTAButton
          href="/get-involved/partnerships"
          text="Explore Partnerships"
        />
      </motion.section>
    </PageShell>
  );
}

/* -----------------------------
   Contribution Card (Animated)
------------------------------*/
function ContributionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group"
    >
      <Link href={href} className="block">
        <motion.div
          className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-sm hover:shadow-xl hover:shadow-amber-400/25 hover:border-amber-400/50 transition-all duration-300"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 15px 35px rgba(251,191,36,0.25)",
            borderColor: "rgb(251 191 36 / 60%)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">{description}</p>

          <motion.span
            className="mt-5 inline-flex text-sm font-medium text-amber-300 opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          >
            Learn more →
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* -----------------------------
   CTA Button (Animated)
------------------------------*/
function CTAButton({
  href,
  text,
  primary = false,
}: {
  href: string;
  text: string;
  primary?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="w-full sm:w-auto"
    >
      <Link
        href={href}
        className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition shadow-lg ${
          primary
            ? "bg-amber-400 text-black hover:bg-amber-300 shadow-amber-400/30"
            : "border border-white/20 text-white hover:bg-white/5 hover:border-white/40"
        }`}
      >
        {text}
      </Link>
    </motion.div>
  );
}
