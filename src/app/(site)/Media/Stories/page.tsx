import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { MediaItem } from "@/components/media/types/media";

const stories: MediaItem[] = [
  {
    id: "daily-campus-life",
    title: "A Day in Campus Life",
    description: "Short reflections from everyday student experiences.",
    campus: "Campus Spotlight",
    duration: "3–5 min",
    thumbnail: "/images/media/stories/day.png",
    platform: "Instagram",
    externalUrl: "https://instagram.com/",
  },
  {
    id: "creative-voices",
    title: "Creative Voices",
    description: "Expression through art, spoken word, and storytelling.",
    campus: "Multiple Campuses",
    duration: "4–6 min",
    thumbnail: "/images/media/stories/creative.png",
    platform: "TikTok",
    externalUrl: "https://tiktok.com/",
    comingSoon: true,
  },
];

export default function VoicesAndStoriesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <header className="max-w-3xl mb-14">
        <h1 className="text-4xl font-semibold mb-4">Voices & Stories</h1>
        <p className="text-white/70">
          Short-form visual narratives capturing everyday campus life,
          resilience, and creative expression.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stories.map((item) => (
          <ExternalMediaCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
