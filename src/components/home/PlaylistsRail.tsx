import Link from "next/link";
import { headers } from "next/headers";
import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";

interface PlaylistsRailProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}

async function getRailVideos() {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/videos?rail=true`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch rail videos");

  return res.json();
}

export async function PlaylistsRail({
  title,
  subtitle,
  viewAllHref,
}: PlaylistsRailProps) {
  const data = await getRailVideos();

  const playlists = data.videos.map((video: any) => ({
    title: video.title,
    duration: video.duration,
    thumbnail: video.thumbnail,
    youtubeId: video.youtubeId,
    campus: video.campus,
    social: video.social,
    featured: video.featured || false,
  }));

  const editorialVideo =
    playlists.find((v: any) => v.featured) || playlists[0];

  const gridVideos = playlists.filter(
    (v: any) => v.youtubeId !== editorialVideo.youtubeId
  );

  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">

        {/* ================= HERO ================= */}
        {editorialVideo && (
          <div className="mb-14 grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-500">
                Recommended
              </p>
              <h1 className="mt-3 text-4xl font-semibold">
                Big ideas. Real campus conversations.
              </h1>
            </div>

            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${editorialVideo.youtubeId}`}
                className="absolute inset-0 h-full w-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="mb-8 flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && (
              <p className="text-sm text-white/70">{subtitle}</p>
            )}
          </div>

          {viewAllHref && (
            <Link href={viewAllHref} className="text-sm hover:underline">
              See all
            </Link>
          )}
        </div>

        {/* ================= GRID ================= */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gridVideos.map((video: any) => (
            <ExternalMediaCard
              key={video.youtubeId}
              id={video.youtubeId}
              title={video.title}
              description={video.campus}
              duration={video.duration}
              thumbnail={video.thumbnail}
              youtubeId={video.youtubeId}
              social={video.social}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
