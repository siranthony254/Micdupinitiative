"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MediaGallery } from "@/components/media/MediaGallery";
import { getRailVideos } from "@/lib/videos";
import { urlFor } from "@/sanity/lib/image";
import type { SanityVideo } from "@/types/video";
import type { MediaItem } from "@/components/media/types/media";

interface PlaylistsRailProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}

export function PlaylistsRail({
  title,
  subtitle,
  viewAllHref,
}: PlaylistsRailProps) {
  const [videos, setVideos] = useState<SanityVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRailVideos()
      .then((result) => {
        if (result.data) {
          setVideos(result.data);
        }
      })
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

  // Transform SanityVideo to MediaItem format for MediaGallery
  const mediaItems = videos.map((video) => ({
    id: video._id,
    type: video.type,
    category: video.category,
    title: video.title,
    description: video.description,
    campus: video.campus,
    duration: video.duration,
    thumbnail: video.thumbnail ? urlFor(video.thumbnail).width(400).height(225).url() : '',
    primaryPlatform: 'youtube' as keyof MediaItem['social'],
    youtubeId: video.youtubeId,
    externalUrl: video.externalUrl,
    social: {
      youtube: video.social?.youtube || null,
      spotify: video.social?.youtube || null,
      apple: null,
      instagram: video.social?.instagram || null,
      tiktok: null,
      facebook: video.social?.facebook || null,
      x: null,
      linkedin: null,
    },
  }));

  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              View All
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4-4m4 4H5a4 4 0 00-4-4v12a4 4 0 004 4h6a4 4 0 004-4V4a4 4 0 00-4-4z"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Media Gallery */}
        <MediaGallery items={mediaItems} />
      </div>
    </section>
  );
}
