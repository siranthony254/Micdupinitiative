// components/home/PlaylistsRail.tsx


import Image from "next/image";
import Link from "next/link";
import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";

interface PlaylistsRailProps {
  title: string;
  subtitle?: string;
  type: "podcast" | "talk" | "documentary";
  category?: string;
  viewAllHref?: string;
}

async function getVideos(type: string, category?: string) {
  const params = new URLSearchParams({ type });
  if (category) params.set("category", category);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/videos?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch videos");

  return res.json();
}

export async function PlaylistsRail({
  title,
  subtitle,
  type,
  category,
  viewAllHref,
}: PlaylistsRailProps) {
  const data = await getVideos(type, category);

  // Map videos for display
  const playlists = data.videos.map((video: any) => ({
    title: video.title,
    count: video.duration,
    image: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
    href: video.social?.[video.primaryPlatform],
    category: video.category,
    meta: video.campus,
    youtubeId: video.youtubeId,
    social: video.social,
    featured: video.featured || false,
  }));

  // Pick editorial hero: featured in category OR first video
  const editorialVideo =
    playlists.find((v: any) => v.featured) ||
    playlists[0];

  // Exclude hero from grid
  const gridVideos = playlists.filter((item: any) => item.youtubeId !== editorialVideo.youtubeId);

  return (
    <section className="bg-slate-200 text-black">
      <div className="mx-auto max-w-7xl px-6 py-14">

        {/* =======================
            EDITORIAL HERO (VIDEO)
        ======================= */}
        {editorialVideo && (
          <div className="mb-14 grid gap-10 lg:grid-cols-2 items-center">
            {/* Text */}
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Recommended
              </p>

              <h1 className="text-4xl font-semibold tracking-tight leading-tight">
                Big ideas. Real Campus Conversations.
              </h1>

              <p className="mt-4 text-base text-black/70 leading-relaxed">
                This episode marks the start of a new era of campus dialogue.
                We’re excited to share this moment and invite you to listen,
                reflect, and join the conversation.
              </p>
            </div>

            {/* Video */}
            <div className="relative aspect-[16/9] overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${editorialVideo.youtubeId}`}
                title={editorialVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />

              {/* Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-black/40" />

              {/* Branding */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end px-8 pb-8">
                <p className="text-3xl md:text-4xl font-semibold text-white">
                  Mic’d Up Initiative
                </p>
                <p className="mt-1 text-sm md:text-base text-white/80">
                  Vision Launch Podcast
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-12 border-t border-black/10" />

        {/* =======================
            SECTION HEADER
        ======================= */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-black/60">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-black hover:underline"
            >
              See all
            </Link>
          )}
        </div>

        {/* =======================
            GRID OF VIDEOS
        ======================= */}
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {gridVideos.map((video: any) => (
            <ExternalMediaCard
              key={video.youtubeId}
              id={video.youtubeId}
              title={video.title}
              description={video.meta}
              duration={video.count}
              thumbnail={video.image}
              youtubeId={video.youtubeId}
              social={video.social}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
