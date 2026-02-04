import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { MediaItem } from "@/components/media/types/media";

const episodes: MediaItem[] = [
  {
    id: "life-beyond-lectures",
    title: "Life Beyond Lectures",
    description: "Student life, ambition, pressure, and purpose.",
    campus: "Multiple Campuses",
    duration: "52 min",
    thumbnail: "/images/media/podcast/episode-1.png",
    platform: "Spotify",
    externalUrl: "https://open.spotify.com/",
  },
  {
    id: "finding-your-voice",
    title: "Finding Your Voice on Campus",
    description: "Why speaking up matters more than ever.",
    campus: "Mic’d Up Initiative",
    duration: "48 min",
    thumbnail: "/images/media/podcast/episode-2.png",
    platform: "Apple Podcasts",
    externalUrl: "https://podcasts.apple.com/",
    comingSoon: true,
  },
];

export default function CampusPodcastPage() {
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
