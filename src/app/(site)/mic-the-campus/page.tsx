"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ======================================================
   PAGE
====================================================== */
export default function MicTheCampusPage() {
  const [supportItem, setSupportItem] = useState<null | {
    label: string;
    amount?: string;
  }>(null);

  return (
    <PageShell
      title="Mic the Campus"
      subtitle="Voices shape culture. Infrastructure determines which ones endure."
    >
      {/* SECTION 1 */}
      <motion.section
        className="max-w-4xl mb-20 space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-semibold text-white">
          Why Campus Voices Matter
        </motion.h2>

        <motion.p variants={fadeUp} className="text-lg text-white/80 leading-relaxed">
          Across African campuses, conversations are shaping identity, belief,
          leadership, and the future of society—yet most disappear undocumented.
        </motion.p>

        <motion.p variants={fadeUp} className="text-lg text-white/80 leading-relaxed">
          <strong className="text-white">Mic the Campus</strong> builds the
          infrastructure that allows student ideas to be recorded, shared, and
          preserved with integrity.
        </motion.p>

        <motion.p variants={fadeUp} className="text-lg text-white/80 leading-relaxed">
          Support enables equipment, facilitation, production, and platforms—
          ensuring responsible voices endure beyond the moment.
        </motion.p>
      </motion.section>

      {/* SECTION 2 — ENDORSEMENT LEVELS */}
      <motion.section
        className="mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-8">
          Endorse the Mic
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ENDORSEMENT_LEVELS.map((tier) => (
            <motion.button
              key={tier.label}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSupportItem(tier)}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left hover:border-amber-400/50"
            >
              <h3 className="text-lg font-semibold text-white">{tier.label}</h3>
              <p className="mt-2 text-sm text-white/70">{tier.description}</p>
              <p className="mt-4 text-amber-300 font-medium">{tier.amount}</p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* SECTION 3 — EQUIPMENT */}
      <motion.section
        className="mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-8">
          Equip the Voice
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPMENT_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="relative mb-4 aspect-video rounded-xl overflow-hidden bg-white/10">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>

              <h3 className="text-base font-semibold text-white">{item.name}</h3>
              <p className="text-sm text-white/70 mt-2">{item.description}</p>
              <p className="mt-3 text-sm font-medium text-amber-300">{item.price}</p>

              <button
                onClick={() =>
                  setSupportItem({ label: item.name, amount: item.price })
                }
                className="mt-4 text-sm font-medium text-amber-400 hover:underline"
              >
                Support this equipment →
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SUPPORT FORM MODAL */}
      <AnimatePresence>
        {supportItem && (
          <SupportModal
            item={supportItem}
            onClose={() => setSupportItem(null)}
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}

/* ======================================================
   SUPPORT MODAL + FORM
====================================================== */
function SupportModal({
  item,
  onClose,
}: {
  item: { label: string; amount?: string };
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-2">
          Support: {item.label}
        </h3>
        {item.amount && (
          <p className="text-amber-300 text-sm mb-4">{item.amount}</p>
        )}

        <SupportForm />

        <p className="mt-6 text-xs text-white/50 leading-relaxed">
          No payments are processed automatically on this website. After
          submitting this form, the Mic’d Up Initiative team will contact you
          with official payment instructions. We do not request PINs or card
          details directly on this platform.
        </p>

        <button
          onClick={onClose}
          className="mt-6 text-sm text-white/60 hover:text-white"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ======================================================
   REUSABLE SUPPORT FORM
====================================================== */
function SupportForm() {
  return (
    <form className="space-y-4">
      <input
        placeholder="Full Name"
        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white"
      />
      <input
        placeholder="Email Address"
        type="email"
        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white"
      />
      <input
        placeholder="Phone Number"
        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white"
      />

      <button
        type="button"
        className="w-full rounded-full bg-amber-400 text-black py-3 text-sm font-semibold hover:bg-amber-300"
      >
        Submit Support Intent
      </button>
    </form>
  );
}

/* ======================================================
   DATA
====================================================== */
const ENDORSEMENT_LEVELS = [
  {
    label: "Builder Level",
    amount: "KES 500",
    description: "Supports basic recording and campus dialogue facilitation.",
  },
   {
    label: "Steward Level",
    amount: "KES 1,000",
    description: "Strengthen research documentation and campus dialogue platforms.",
  },
  {
    label: "Voice Patron",
    amount: "KES 5,000",
    description: "Substantially support equipment acquisition and long-term storytelling sustainability.",
  },
  {
    label: "Silver Endorsement",
    amount: "KES 10,000",
    description: "Supports upgraded recording and campus dialogue facilitation systems.",
  },
  {
    label: "Gold Endorsement",
    amount: "KES 30,000",
    description: "Funds production and structured student conversations.",
  },
  {
    label: "Platinum Endorsement",
    amount: "KES 60,000",
    description: "Enables full podcast or talk series recording.",
  },
  {
    label: "Diamond Endorsement",
    amount: "KES 100,000",
    description: "Sustains long-term campus media infrastructure.",
  },
];

const EQUIPMENT_ITEMS = [
  {
    id: "camera",
    name: "Entry-Level Camera",
    description: "For documentaries and interviews.",
    price: "KES 45,000",
    image: "/equipment/camera-basic.jpg",
  },
  {
    id: "mic",
    name: "Podcast Microphone",
    description: "Professional audio capture.",
    price: "KES 12,000",
    image: "/equipment/mic.jpg",
  },
  {
    id: "lights",
    name: "Lighting Kit",
    description: "Improves visual production quality.",
    price: "KES 18,000",
    image: "/equipment/lighting.jpg",
  },
];
