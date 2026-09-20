"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { VideoCategory } from "@/lib/conversations";

const VISIBLE_LIMIT = 5;

export function CategoryPlaylistGrid({ categories }: { categories: VideoCategory[] }) {
  const [expanded, setExpanded] = useState(false);

  if (categories.length === 0) {
    return null;
  }

  const visibleCategories = expanded ? categories : categories.slice(0, VISIBLE_LIMIT);
  const hasMore = categories.length > VISIBLE_LIMIT;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          Playlists
        </span>
        <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-white">
          Browse by Category
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/conversations/category/${category.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30"
          >
            <div className="relative aspect-video bg-black">
              {category.thumbnailUrl && (
                <Image
                  src={category.thumbnailUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black">
                  <Play className="ml-0.5 h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-white/50">
                {category.videos.length} {category.videos.length === 1 ? "video" : "videos"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && !expanded && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            Show More Categories
          </button>
        </div>
      )}
    </section>
  );
}
