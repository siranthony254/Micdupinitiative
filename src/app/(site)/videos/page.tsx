"use client";

import { useState, useEffect } from "react";
import { MediaGallery } from "@/components/media/MediaGallery";
import { getVideos } from "@/lib/videos";
import { urlFor } from "@/sanity/lib/image";
import type { SanityVideo } from "@/types/video";
import type { MediaItem } from "@/components/media/types/media";

// Constant for consistent background color
const BACKGROUND_COLOR = '#1A3A5C';

export default function VideosPage() {
  const [videos, setVideos] = useState<SanityVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideos()
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
      <div className="min-h-screen text-white" style={{backgroundColor: BACKGROUND_COLOR}}>
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-8 w-1/3"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg aspect-video"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform SanityVideo to MediaItem format for MediaGallery
  const mediaItems: MediaItem[] = videos.map((video) => ({
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
    <div className="min-h-screen text-white" style={{backgroundColor: BACKGROUND_COLOR}}>
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Videos
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our collection of conversations, talks, and documentaries shaping campus culture
          </p>
        </div>

        {/* Media Gallery */}
        <MediaGallery items={mediaItems} />
      </div>
    </div>
  );
}
