// src/components/home/WhatWeAreDoingNow.tsx
import Link from "next/link";

export default function WhatWeAreDoingNow() {
  return (
    <section className="border-b border-white/10 text-white" style={{ backgroundColor: "#0D1F35" }}>
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          This Semester
        </span>

        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-white">
          We&rsquo;re Putting Conversations First
        </h2>

        <div className="mt-6 space-y-2 text-white/80 text-lg leading-relaxed">
          <p>We are listening to campus.</p>
          <p>We are speaking with people shaping higher education and society.</p>
          <p>We are documenting perspectives that deserve to be heard.</p>
          <p>And we are turning those conversations into stories, insights, and questions that can travel beyond the room.</p>
        </div>

        <Link
          href="/conversations"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition"
        >
          Explore MUI Conversations
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
