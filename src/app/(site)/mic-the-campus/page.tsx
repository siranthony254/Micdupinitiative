"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MicTheCampusPage() {
  const [paymentItem, setPaymentItem] = useState<null | {
    label: string;
    amount: string;
  }>(null);

  const [deliveryItem, setDeliveryItem] = useState<null | {
    label: string;
    amount?: string;
  }>(null);

  return (
    <PageShell
      title="Mic the Campus"
      subtitle="Voices shape culture. Infrastructure determines which ones endure."
    >
      {/* SECTION 1 — WHY */}
      <motion.section
        className="max-w-4xl mb-20 space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={fadeUp}
          className="text-2xl md:text-3xl font-semibold text-white"
        >
          Why Campus Voices Matter
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-lg text-white/80 leading-relaxed"
        >
          Across campuses, ideas are shaping belief, leadership, and society—
          yet most disappear undocumented.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-lg text-white/80 leading-relaxed"
        >
          Mic the Campus builds the infrastructure that allows responsible
          student voices to be recorded, preserved, and amplified with dignity.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-lg text-white/80 leading-relaxed"
        >
          Support strengthens equipment, documentation, production systems, and
          long-term cultural preservation.
        </motion.p>
      </motion.section>

      {/* SECTION 2 — ENDORSEMENT LEVELS */}
      <motion.section
        className="mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold text-white mb-8">
          Endorse the Mic
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ENDORSEMENT_LEVELS.map((tier) => (
            <motion.div
              key={tier.label}
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold text-white">
                {tier.label}
              </h3>

              <p className="mt-2 text-sm text-white/70">
                {tier.description}
              </p>

              <p className="mt-4 text-amber-300 font-medium">
                {tier.amount}
              </p>

              <button
                onClick={() =>
                  setPaymentItem({
                    label: tier.label,
                    amount: tier.amount,
                  })
                }
                className="mt-5 text-sm font-semibold text-amber-400 hover:underline"
              >
                Pay via M-Pesa →
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 3 — EQUIPMENT CATALOG */}
      <motion.section
        className="mb-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          Equipment Catalog
        </h2>

        <p className="text-white/70 max-w-3xl mb-12 text-sm md:text-base leading-relaxed">
          Supporters may pledge to deliver equipment directly to Mic’d Up
          Initiative. Transparency is maintained through physical delivery and
          public fulfillment tracking.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPMENT_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold text-white">
                {item.icon} {item.name}
              </h3>

              <p className="mt-3 text-sm text-white/70">
                {item.description}
              </p>

              <p className="mt-3 text-sm text-amber-300 font-medium">
                Estimated Cost: {item.price}
              </p>

              <div className="mt-4 text-sm text-white/70 space-y-1">
                <p className="font-medium text-white">Impact:</p>
                {item.impact.map((point, i) => (
                  <p key={i}>• {point}</p>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Fulfillment Progress</span>
                  <span>{item.progress}% Complete</span>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  setDeliveryItem({
                    label: item.name,
                    amount: item.price,
                  })
                }
                className="mt-6 text-sm font-semibold text-amber-400 hover:underline"
              >
                Promise Delivery →
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 4 — RECENTLY SPONSORED */}
      <motion.section
        className="mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">
          Recently Sponsored
        </h2>

        <div className="space-y-4 max-w-3xl">
          {RECENT_SPONSORS.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm text-white">
                <span className="text-amber-300 font-medium">
                  {item.supporter}
                </span>{" "}
                pledged to deliver{" "}
                <span className="font-medium text-white">
                  {item.item}
                </span>
              </p>

              <p className="text-xs text-white/50 mt-1">
                {item.date}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <AnimatePresence>
        {paymentItem && (
          <PaymentModal
            item={paymentItem}
            onClose={() => setPaymentItem(null)}
          />
        )}

        {deliveryItem && (
          <DeliveryModal
            item={deliveryItem}
            onClose={() => setDeliveryItem(null)}
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}

/* PAYMENT MODAL */

function PaymentModal({
  item,
  onClose,
}: {
  item: { label: string; amount: string };
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handlePayment() {
    if (!phone) return;

    try {
      setLoading(true);

      await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: item.amount.replace(/\D/g, ""),
          reference: item.label,
        }),
      });

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

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
        className="w-full max-w-lg rounded-2xl border border-white/10 p-6" style={{backgroundColor: '#1A3A5C'}}
      >
        <h3 className="text-xl font-semibold text-white mb-2">
          Pay: {item.label}
        </h3>

        <p className="text-amber-300 text-sm mb-4">
          Amount: {item.amount}
        </p>

        {!success ? (
          <>
            <input
              placeholder="M-Pesa Phone Number (07XXXXXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white"
            />

            <button
              onClick={handlePayment}
              disabled={loading}
              className="mt-4 w-full rounded-full bg-amber-400 text-black py-3 text-sm font-semibold hover:bg-amber-300"
            >
              {loading ? "Sending Prompt..." : "Send M-Pesa Prompt"}
            </button>

            <p className="mt-4 text-xs text-white/50">
              You will receive an M-Pesa prompt on your phone to complete payment.
            </p>
          </>
        ) : (
          <p className="text-green-400 text-sm">
            Payment prompt sent. Complete the transaction on your phone.
          </p>
        )}

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

/* DELIVERY MODAL */

function DeliveryModal({
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
        className="w-full max-w-lg rounded-2xl border border-white/10 p-6" style={{backgroundColor: '#1A3A5C'}}
      >
        <h3 className="text-xl font-semibold text-white mb-2">
          Promise Delivery: {item.label}
        </h3>

        {item.amount && (
          <p className="text-amber-300 text-sm mb-4">
            Estimated Cost: {item.amount}
          </p>
        )}

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
            Submit Delivery Commitment
          </button>
        </form>

        <p className="mt-6 text-xs text-white/50 leading-relaxed">
          This form records your intent to physically deliver the equipment to
          Mic’d Up Initiative. Our team will contact you with official delivery
          details and address information.
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

/* DATA */

const ENDORSEMENT_LEVELS = [
  {
    label: "Builder Level",
    amount: "KES 500",
    description: "Supports campus documentation and dialogue facilitation.",
  },
  {
    label: "Steward Level",
    amount: "KES 1,000",
    description: "Strengthens research and student conversation platforms.",
  },
  {
    label: "Voice Patron",
    amount: "KES 5,000",
    description: "Supports sustainable storytelling infrastructure.",
  },
  {
    label: "Silver Endorsement",
    amount: "KES 10,000",
    description:
      "Supports upgraded recording and campus dialogue facilitation systems.",
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
    id: "podcast-mic",
    icon: "🎤",
    name: "Podcast Microphone Kit",
    description: "Professional audio setup for interviews and podcasts.",
    price: "KES 25,000",
    progress: 0,
    impact: [
      "Clear voice capture",
      "Reduced background noise",
      "Professional podcast quality",
    ],
  },
  {
    id: "camera",
    icon: "📷",
    name: "Mirrorless Production Camera",
    description: "High-quality recording for documentaries and talks.",
    price: "KES 65,000",
    progress: 0,
    impact: [
      "Multi-platform content",
      "Archival documentation",
      "Professional visual quality",
    ],
  },
  {
    id: "lighting",
    icon: "💡",
    name: "LED Lighting Kit",
    description: "Consistent lighting for indoor productions.",
    price: "KES 15,000",
    progress: 0,
    impact: [
      "Elevated visual presence",
      "Reliable filming setup",
      "Improved production credibility",
    ],
  },
];

const RECENT_SPONSORS = [
  {
    supporter: "Anonymous Supporter",
    item: "LED Lighting Kit",
    date: "February 2026",
  },
];
