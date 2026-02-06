// src/app/(site)/Media/Documentaries/page.tsx
import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { getVideos } from "@/app/lib/getVideos";

export default async function DocumentariesPage() {
  const data = await getVideos("documentary");

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <header className="max-w-3xl mb-14">
        <h1 className="text-4xl font-semibold mb-4 text-amber-300">
          Documentaries
        </h1>
        <p className="text-white/70">
          Deep-dive visual stories capturing real campus challenges.
        </p>
        <h1 className="text-4xl font-semibold mb-4 text-amber-300">
          Coming Soon!!
        </h1>
        <p className="text-white/70">
          We are curating impactful documentaries that spotlight real campus stories, challenges, and triumphs. Stay tuned for powerful visual narratives coming your way!
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.videos.map((item: any) => (
          <ExternalMediaCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
