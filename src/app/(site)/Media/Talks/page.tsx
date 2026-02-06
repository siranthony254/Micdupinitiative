// src/app/(site)/Media/Talks/page.tsx

import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { MediaItem } from "@/components/media/types/media";

async function getTalks(): Promise<MediaItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/videos?section=talk`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch talks");
  }

  const data = await res.json();
  return data.videos;
}

export default async function MUCTalksPage() {
  const talks = await getTalks();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <header className="max-w-3xl mb-14">
        <h1 className="text-4xl font-semibold mb-4 text-amber-300">
          MUC Talks
        </h1>
        <p className="text-white/70">
          Stage-based talks where students, leaders, and thinkers challenge
          ideas and inspire action.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {talks.map((item) => (
          <ExternalMediaCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
