import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { getVideos } from "@/app/lib/getVideos";

export default async function PodcastsPage() {
  const data = await getVideos("podcast");

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.videos.map((item: any) => (
          <ExternalMediaCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
