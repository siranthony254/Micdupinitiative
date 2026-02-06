import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { MediaItem } from "@/components/media/types/media";

async function getPodcastEpisodes(): Promise<MediaItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/videos?section=podcast`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch podcast episodes");
  }

  const data = await res.json();

  // ✅ EXTRACT ARRAY
  return Array.isArray(data.videos) ? data.videos : [];
}

export default async function PodcastsPage() {
  const videos = await getPodcastEpisodes();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <header className="max-w-3xl mb-14">
        <h1 className="text-4xl font-semibold mb-4 text-amber-300">
          Podcasts
        </h1>
        <p className="text-white/70">
          Long-form campus conversations on faith, leadership, and growth.
        </p>
      </header>

      {videos.length === 0 ? (
        <p className="text-white/60">No podcast episodes available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map((v) => (
            <ExternalMediaCard
              key={v.id}
              title={v.title}
              description={v.description}
              duration={v.duration}
              thumbnail={v.thumbnail}
              youtubeId={v.youtubeId}
              externalUrl={v.externalUrl}
              social={v.social}
              comingSoon={v.comingSoon}
            />
          ))}
        </div>
      )}
    </section>
  );
}
