import { MediaGallery } from "@/components/media/MediaGallery";
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

      <MediaGallery items={data.videos} />
    </section>
  );
}
