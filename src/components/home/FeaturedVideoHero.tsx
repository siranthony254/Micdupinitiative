import Image from "next/image";
import Link from "next/link";
import { getFeaturedVideos } from "@/lib/videos";
import { urlFor } from "@/sanity/lib/image";
import type { SanityVideo } from "@/types/video";

function getVideoImage(video: SanityVideo) {
  if (video.thumbnail) {
    return urlFor(video.thumbnail).width(960).height(540).url();
  }

  if (video.youtubeId) {
    return `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  }

  return null;
}

export async function FeaturedVideoHero() {
  const result = await getFeaturedVideos(1);
  const featuredVideo = result.data?.[0] ?? null;

  if (!featuredVideo) {
    return null;
  }

  const imageUrl = getVideoImage(featuredVideo);
  const videoHref = featuredVideo.slug?.current
    ? `/videos/${featuredVideo.slug.current}`
    : "/videos";

  return (
    <section className="bg-gradient-to-br from-amber-900 via-orange-800 to-amber-700 text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-600/20 border border-amber-400/30">
              <span className="text-sm font-medium text-amber-200">
                Featured Conversation
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {featuredVideo.title}
            </h1>

            <p className="text-xl text-amber-100 leading-relaxed">
              {featuredVideo.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-amber-200">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {featuredVideo.campus}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {featuredVideo.duration}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4" />
                </svg>
                {featuredVideo.type.charAt(0).toUpperCase() + featuredVideo.type.slice(1)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={videoHref}
                className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-lg transition-colors border"
                style={{ backgroundColor: "#1A3A5C" }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Now
              </Link>

              {featuredVideo.externalUrl && (
                <a
                  href={featuredVideo.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L16 8" />
                  </svg>
                  External
                </a>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-800">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={featuredVideo.thumbnail?.alt || featuredVideo.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 bg-amber-500/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
