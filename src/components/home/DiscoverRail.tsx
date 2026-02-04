// src/components/home/DiscoverRail.tsx
"use client";

import Link from "next/link";

const categories = [
  { label: "All", slug: "all" },
  { label: "Talent & Creativity", slug: "talent" },
  { label: "Debates & Dialogues", slug: "debates" },
  { label: "Panels & Forums", slug: "panels" },
  { label: "Mental Health", slug: "mental-health" },
  { label: "Leadership & Influence", slug: "leadership" },
  { label: "Education", slug: "education" },
  { label: "Research & Insights", slug: "research" },
];

export default function DiscoverRail() {
  return (
    <section className="bg-black text-white border-y border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-8">
        
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">Discover</h2>
            <p className="mt-1 text-sm text-white/60">
              Explore voices, ideas, and stories shaping campus life
            </p>
          </div>

          <Link
            href="/"
            className="text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            Coming Soon!!
          </Link>
        </div>

        {/* Category Rail */}
        <div
          className="
            flex gap-3 overflow-x-auto scrollbar-hide
            snap-x snap-mandatory
            pb-1
          "
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/Media/${cat.slug}`}
              className="
                snap-start shrink-0
                px-5 py-2 rounded-full
                text-sm font-medium
                bg-white/10 text-white/90
                hover:bg-white hover:text-black
                transition
              "
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
