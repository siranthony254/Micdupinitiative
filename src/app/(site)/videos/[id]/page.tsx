import { MediaGallery } from "@/components/media/MediaGallery";
import { getVideoYouTubeId, getVideos, toMediaItem } from "@/lib/videos";
import { getYouTubeEmbedUrl } from "@/components/media/youtube";
import { notFound } from "next/navigation";
import type { SanityVideo } from "@/types/video";

export default async function VideoPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  // Fetch all videos
  const { id } = await params;
  const allVideos = await getVideos();
  const video = allVideos.data?.find((v: SanityVideo) => v._id === id);

  if (!video) return notFound();
  const youtubeId = getVideoYouTubeId(video);

  // Group videos by type/category for recommendations
  const recommendations = {
    podcast: (allVideos.data?.filter((v: SanityVideo) => v.type === "podcast" && v._id !== video._id) || []).map(toMediaItem),
    documentary: (allVideos.data?.filter((v: SanityVideo) => v.type === "documentary" && v._id !== video._id) || []).map(toMediaItem),
    talk: (allVideos.data?.filter((v: SanityVideo) => v.type === "talk" && v._id !== video._id) || []).map(toMediaItem),
    // Add more categories as needed
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0D1F35' }}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">{video.title || "Untitled video"}</h1>
        <div className="aspect-video mb-8 rounded-lg overflow-hidden shadow-lg">
          {youtubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(youtubeId)}
              title={video.title || "YouTube video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <p className="text-gray-400">Video not available</p>
              </div>
            </div>
          )}
        </div>
        {video.description && (
          <p className="mb-8 text-lg text-white/80">{video.description}</p>
        )}
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
