"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ExternalLink } from "lucide-react";
import type { MediaItem } from "@/components/media/types/media";
import { getYouTubeEmbedUrl } from "@/components/media/youtube";

interface MediaGalleryProps {
  items: MediaItem[];
}

export function MediaGallery({ items }: MediaGalleryProps) {
  const playableItems = useMemo(
    () => items.filter((item) => item.youtubeId || item.externalUrl),
    [items]
  );
  const [selectedId, setSelectedId] = useState(playableItems[0]?.id ?? items[0]?.id ?? "");

  const selectedItem =
    playableItems.find((item) => item.id === selectedId) ??
    playableItems[0] ??
    items[0] ??
    null;

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/30 px-6 py-12 text-center text-white/70">
        No videos available yet.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {selectedItem && (
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl shadow-black/30">
          <div className="relative aspect-video bg-black">
            {selectedItem.youtubeId ? (
              <iframe
                key={selectedItem.youtubeId}
                src={getYouTubeEmbedUrl(selectedItem.youtubeId, { autoplay: false })}
                title={selectedItem.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Link
                  href={selectedItem.externalUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open video
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-4 px-6 py-6 md:px-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-amber-200">
                {selectedItem.type}
              </span>
              {selectedItem.campus && <span>{selectedItem.campus}</span>}
              {selectedItem.duration && <span>{selectedItem.duration}</span>}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                {selectedItem.title}
              </h2>
              {selectedItem.description && (
                <p className="mt-3 max-w-3xl text-white/70">
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isActive = item.id === selectedItem?.id;
          const canPlayOnSite = Boolean(item.youtubeId);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.youtubeId || item.externalUrl) {
                  setSelectedId(item.id);
                }
              }}
              className={`group overflow-hidden rounded-2xl border text-left transition duration-300 ${
                isActive
                  ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/10"
                  : "border-white/10 bg-black/30 hover:-translate-y-1 hover:border-amber-400/60"
              }`}
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <Image
                  src={item.thumbnail || "/images/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition duration-300 group-hover:scale-95">
                    {canPlayOnSite ? (
                      <Play className="ml-1 h-5 w-5" />
                    ) : (
                      <ExternalLink className="h-5 w-5" />
                    )}
                  </div>
                </div>
                {item.duration && (
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white">
                    {item.duration}
                  </span>
                )}
              </div>

              <div className="space-y-3 p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
                  <span>{item.type}</span>
                  {item.campus && <span>{item.campus}</span>}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white transition group-hover:text-amber-300">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-white/65">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
