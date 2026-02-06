// src/app/(site)/Media/Documentaries/page.tsx

import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { MediaItem } from "@/components/media/types/media";

async function getDocumentaries(): Promise<MediaItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/videos?section=documentary`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch documentaries");
  }

  const data = await res.json();
  return data.videos;
}

export default async function DocumentariesPage() {
  const documentaries = await getDocumentaries();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <header className="max-w-3xl mb-14">
        <h1 className="text-4xl font-semibold mb-4 text-amber-300">
          Documentaries
        </h1>
        <p className="text-white/70">
          Deep-dive visual stories capturing real campus challenges,
          movements, and transformative journeys.
        </p>
        <h1 className="text-4xl font-semibold mb-4 text-amber-300">
          Coming Soon: A Documentary Series on Campus Realities
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {documentaries.map((item) => (
          <ExternalMediaCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
