import { MediaGallery } from "@/components/media/MediaGallery";
import { getVideos } from "@/lib/videos";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import type { SanityVideo } from "@/types/video";

export default async function VideoPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  // Fetch all videos
  const { id } = await params;
  const allVideos = await getVideos();
  const video = allVideos.data?.find((v: SanityVideo) => v._id === id);

  if (!video) return notFound();

  // Group videos by type/category for recommendations
  const recommendations = {
    podcast: allVideos.data?.filter((v) => v.type === "podcast" && v._id !== video._id) || [],
    documentary: allVideos.data?.filter((v) => v.type === "documentary" && v._id !== video._id) || [],
    talk: allVideos.data?.filter((v) => v.type === "talk" && v._id !== video._id) || [],
    // Add more categories as needed
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0D1F35' }}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
        <div className="aspect-video mb-8 rounded-lg overflow-hidden shadow-lg">
          {video.youtubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : video.externalUrl ? (
            <a href={video.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Watch External Video</a>
          ) : (
            <div>No video available</div>
          )}
        </div>
        <p className="mb-8 text-lg text-white/80">{video.description}</p>
        <h2 className="text-2xl font-semibold mb-4">Recommended Podcasts</h2>
        <MediaGallery items={recommendations.podcast} />
        <h2 className="text-2xl font-semibold mt-10 mb-4">Documentaries</h2>
        <MediaGallery items={recommendations.documentary} />
        <h2 className="text-2xl font-semibold mt-10 mb-4">Talks</h2>
        <MediaGallery items={recommendations.talk} />
      </div>
    </div>
  );
}
