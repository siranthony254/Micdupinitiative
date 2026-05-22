"use client";

import { useState, useEffect } from "react";
import { MediaGallery } from "@/components/media/MediaGallery";
import { getVideos, toMediaItem } from "@/lib/videos";
import type { SanityVideo } from "@/types/video";

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

  const mediaItems = videos.map(toMediaItem);

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
