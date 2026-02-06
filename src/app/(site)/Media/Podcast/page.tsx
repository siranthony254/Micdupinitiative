// src/app/(site)/Media/Podcasts/page.tsx

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
  return data.videos;
}

export default async function CampusPodcastPage() {
  const episodes = await getPodcastEpisodes();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <header className="max-w-3xl mb-14">
        <h1 className="text-4xl font-semibold mb-4 text-amber-300">
          Mic’d Up Campus Podcast
        </h1>
        <p className="text-white/70">
          Long-form conversations exploring leadership, culture, and student
          realities shaping university life.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {episodes.map((item) => (
          <ExternalMediaCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
