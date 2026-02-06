import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { getVideos } from "@/app/lib/getVideos";

export default async function TalksPage() {
  const data = await getVideos("talk");

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <header className="max-w-3xl mb-14">
        <h1 className="text-4xl font-semibold mb-4 text-amber-300">
          MUC Talks
        </h1>
        <p className="text-white/70">
          Stage-based talks that challenge ideas and inspire action.
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
