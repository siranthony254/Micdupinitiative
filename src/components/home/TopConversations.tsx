import Link from "next/link";
import Image from "next/image";
import { getVideos, getVideoThumbnailUrl } from "@/lib/videos";
import type { SanityVideo } from "@/types/video";

export async function TopConversations() {
  const result = await getVideos({ limit: 4 });
  const videos = (result.data ?? []) as SanityVideo[];

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Top Conversations</h3>
        <Link
          href="/videos"
          className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-2"
        >
          See all conversations
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4-4m4 4H5a4 4 0 00-4-4v12a4 4 0 004 4h6a4 4 0 004-4V4a4 4 0 00-4-4z" />
          </svg>
        </Link>
      </div>

      <div className="grid gap-4">
        {videos.map((video) => {
          const thumbnailUrl = getVideoThumbnailUrl(video);

          return (
            <Link
              key={video._id}
              href={video._id ? `/videos/${video._id}` : "/videos"}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-200 border border-white/10 hover:border-amber-500/30"
            >
              <div className="flex gap-4">
                <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-700">
                  {thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={video.title || "Video thumbnail"}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}

                  {video.duration && (
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                      {video.duration}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-2 text-sm leading-tight mb-1">
                    {video.title || "Untitled video"}
                  </h4>

                  <div className="flex items-center gap-3 text-white/60 text-xs">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {video.campus || "MUC"}
                    </span>

                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4" />
                      </svg>
                      {video.type.charAt(0).toUpperCase() + video.type.slice(1)}
                    </span>

                    {video.category && (
                      <span className="text-amber-400">{video.category}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
