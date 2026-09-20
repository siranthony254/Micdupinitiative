"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { VideoPlayerModal } from "@/components/media/VideoPlayerModal";

export interface CategoryVideoItem {
  id: string;
  youtubeId: string | null;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration?: string;
  campus?: string;
  publishedAt?: string;
}

export function CategoryVideoList({ videos }: { videos: CategoryVideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<CategoryVideoItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            disabled={!video.youtubeId}
            onClick={() => setActiveVideo(video)}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="relative aspect-video bg-black">
              {video.thumbnailUrl && (
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform duration-300 group-hover:scale-95">
                  <Play className="ml-0.5 h-5 w-5" />
                </div>
              </div>
              {video.duration && (
                <span className="absolute bottom-3 right-3 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white">
                  {video.duration}
                </span>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-3">
                  {video.description}
                </p>
              )}
              {video.campus && (
                <p className="mt-3 text-xs uppercase tracking-wide text-white/40">{video.campus}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {activeVideo?.youtubeId && (
        <VideoPlayerModal
          youtubeId={activeVideo.youtubeId}
          title={activeVideo.title}
          description={activeVideo.description}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  );
}
