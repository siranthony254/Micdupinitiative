// components/discover/CategoryRail.tsx
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  "All",
  "Talent & Creativity",
  "Research & Insights",
  "Panels & Forums",
  "Mental Health",
  "Personal Growth",
  "Policies & Education",
  "Content & Media",
  "Debates & Dialogues",
  "Leadership & Influence",
];

function CategoryRailInner() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("category") ?? "All";

  return (
    <div
      className="
        mx-auto max-w-7xl
        px-4 sm:px-6
        py-4 sm:py-6
        flex gap-2 sm:gap-3
        overflow-x-auto
        bg-neutral-50 sm:bg-transparent
        scrollbar-none
      "
    >
      {categories.map((cat) => {
        const isActive = active === cat;

        return (
          <button
            key={cat}
            onClick={() =>
              router.push(`/discover?category=${cat === "All" ? "" : cat}`)
            }
            className={`
              whitespace-nowrap
              px-4 sm:px-5
              py-2
              rounded-full
              text-sm
              font-medium
              border
              transition-colors
              ${
                isActive
                  ? "bg-black text-white border-black ring-1 ring-black/30"
                  : `
                      border-black/20
                      text-black
                      sm:text-black/70
                      sm:hover:bg-black
                      sm:hover:text-white
                    `
              }
            `}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export function CategoryRail() {
  return (
    <Suspense fallback={<div className="h-12" />}>
      <CategoryRailInner />
    </Suspense>
  );
}
