import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { MediaItem } from "@/components/media/types/media";

const talks: MediaItem[] = [
  {
    id: "courage-to-speak",
    title: "The Courage to Speak",
    description: "A powerful talk on voice, leadership, and responsibility.",
    campus: "University of Nairobi",
    duration: "14 min",
    thumbnail: "/images/media/talks/courage.png",
    platform: "YouTube",
    externalUrl: "https://youtube.com/",
  },
  {
    id: "leading-without-permission",
    title: "Leading Without Permission",
    description: "Creating change without waiting for authority.",
    campus: "Kenyatta University",
    duration: "12 min",
    thumbnail: "/images/media/talks/permission.png",
    platform: "YouTube",
    externalUrl: "https://youtube.com/",
    comingSoon: true,
  },
];

export default function MUCTalksPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <header className="max-w-3xl mb-14">
        <h1 className="text-4xl font-semibold mb-4">MUC Talks</h1>
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
