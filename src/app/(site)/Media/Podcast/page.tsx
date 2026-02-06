import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { getVideos } from "@/app/lib/getVideos";

export default async function PodcastsPage() {
  const videos = await getVideos("podcast");

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {videos.map((v: typeof videos[number]) => (
          <ExternalMediaCard
            key={v.id}
            title={v.title}
            description={v.campus}
            duration={v.duration}
            thumbnail={v.thumbnail}
            youtubeId={v.youtubeId}
            externalUrl={v.externalUrl}
            social={v.social}
            comingSoon={v.comingSoon}
          />
        ))}
      </div>
    </section>
  );
}
