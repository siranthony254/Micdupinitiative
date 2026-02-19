"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function AmbassadorsPage() {
  const totalSteps = 3;

  const [step, setStep] = useState(1);
  const [hasApplied, setHasApplied] = useState(false);

  const [formData, setFormData] = useState({
    campusType: "",
    campusName: "",
    year: "",
    course: "",
    motivation: "",
    name: "",
    email: "",
    phone: "",
  });

  // ✅ Check localStorage on load
  useEffect(() => {
    const applied = localStorage.getItem("ambassadorApplied");
    if (applied === "true") {
      setHasApplied(true);
      setStep(totalSteps + 2); // Already applied state
    }
  }, []);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = "https://formspree.io/f/xbdknweo";

    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // ✅ Save status
      localStorage.setItem("ambassadorApplied", "true");
      setHasApplied(true);

      // show thank you
      setStep(totalSteps + 1);
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-20">

        {/* Header */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="mb-14 space-y-4"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-amber-400">
            Campus Ambassadors
          </h1>
          <p className="max-w-2xl text-white/70 leading-relaxed">
            Represent Mic’d Up Initiative on your campus and help amplify
            student voices through media, dialogue, and leadership.
          </p>
        </motion.header>

        {/* Role Overview */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-sm"
        >
          <h2 className="text-xl font-medium mb-4">What You’ll Do</h2>
          <ul className="list-disc list-inside space-y-2 text-white/75">
            <li>Coordinate Mic’d Up campus activities and outreach</li>
            <li>Identify and nurture authentic student voices</li>
            <li>
              Serve as a bridge between Mic’d Up Initiative and your university
            </li>
          </ul>
        </motion.section>

        {/* Perks + Requirements */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-14 grid gap-8 md:grid-cols-2"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7 shadow-sm hover:border-amber-400/40 transition">
            <h2 className="text-lg font-semibold mb-4">Ambassador Perks</h2>
            <ul className="space-y-2 text-white/75 list-disc list-inside">
              <li>Official Mic’d Up Initiative certification</li>
              <li>Leadership & media training opportunities</li>
              <li>Priority access to mentorship and events</li>
              <li>Networking with student leaders nationwide</li>
              <li>Feature opportunities on Mic’d Up platforms</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7 shadow-sm hover:border-amber-400/40 transition">
            <h2 className="text-lg font-semibold mb-4">Requirements</h2>
            <ul className="space-y-2 text-white/75 list-disc list-inside">
              <li>Currently enrolled at a recognized university/college</li>
              <li>Strong communication and leadership potential</li>
              <li>Commitment to ethical campus engagement</li>
              <li>Availability for monthly ambassador check-ins</li>
              <li>Aligned with Mic’d Up Initiative values and mission</li>
            </ul>
          </div>
        </motion.section>


        {/* Hide entire form if already applied */}
        {!hasApplied && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg"
          >
            {/* Progress */}
            {step <= totalSteps && (
              <div className="mb-6 text-center text-sm text-white/60">
                Step {step} of {totalSteps}
                <div className="mt-2 h-2 w-full bg-white/20 rounded-full">
                  <div
                    className="h-2 bg-amber-400 rounded-full"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <div className="space-y-2">
                  <label htmlFor="campusType" className="text-sm text-white/70">
                    Select Campus Type
                  </label>
                  <select
                    id="campusType"
                    name="campusType"
                    required
                    value={formData.campusType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm"
                  >
                    <option value="">Select campus type</option>
                    <option value="TVET">TVET</option>
                    <option value="College">College</option>
                    <option value="KMTC">KMTC</option>
                    <option value="University">University</option>
                  </select>
                </div>

                <input
                  name="campusName"
                  required
                  value={formData.campusName}
                  onChange={handleChange}
                  placeholder="Campus Name (e.g., University of Nairobi)"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm"
                />

                <input
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Year of Study"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm"
                />

                <button type="submit" className="w-full bg-amber-400 text-black py-3 rounded-xl font-semibold">
                  Next
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <input
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Course"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm"
                />

                <textarea
                  name="motivation"
                  required
                  minLength={100}
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Why do you want to be an ambassador?"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm"
                />

                <div className="flex justify-between gap-4">
                  <button type="button" onClick={handleBack} className="border px-6 py-3 rounded-xl">
                    Back
                  </button>
                  <button type="submit" className="bg-amber-400 text-black px-6 py-3 rounded-xl font-semibold">
                    Next
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm"
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm"
                />

                <input
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+2547XXXXXXXX"
                  pattern="^\+2547\07\01\d{8}$"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm"
                />

                <div className="flex justify-between gap-4">
                  <button type="button" onClick={handleBack} className="border px-6 py-3 rounded-xl">
                    Back
                  </button>
                  <button type="submit" className="bg-amber-400 text-black px-6 py-3 rounded-xl font-semibold">
                    Submit
                  </button>
                </div>
              </form>
            )}

            {/* THANK YOU */}
            {step === totalSteps + 1 && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-medium">Thank you!</h2>
                <p className="text-white/70">
                  You will be contacted and added to the cohort group soon.
                </p>
              </div>
            )}
          </motion.section>
        )}

        {/* ALREADY APPLIED */}
        {hasApplied && step === totalSteps + 2 && (
          <div className="text-center space-y-4 mt-10">
            <h2 className="text-2xl font-medium text-amber-400">
              You’ve already applied
            </h2>
            <p className="text-white/70">
              Your application is under review. We will contact you soon.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
