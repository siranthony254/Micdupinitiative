"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MediaGallery } from "@/components/media/MediaGallery";
import type { MediaItem } from "@/components/media/types/media";

interface PlaylistsRailProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}

async function getRailVideos() {
  const res = await fetch(
    `${process.env.NODE_ENV === "development" ? "http" : "https"}://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/api/videos?rail=true`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch rail videos");

  return res.json();
}

export function PlaylistsRail({
  title,
  subtitle,
  viewAllHref,
}: PlaylistsRailProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRailVideos()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg aspect-video"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <p className="text-gray-400">Failed to load videos</p>
        </div>
      </section>
    );
  }

  const playlists: MediaItem[] = data.videos;

  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && (
              <p className="text-sm text-white/70">{subtitle}</p>
            )}
          </div>

          {viewAllHref && (
            <Link href={viewAllHref} className="text-sm hover:underline">
              See all
            </Link>
          )}
        </div>

        <MediaGallery items={playlists} />
      </div>
    </section>
  );
}
