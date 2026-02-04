import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { MediaItem } from "@/components/media/types/media";

const documentaries: MediaItem[] = [
  {
    id: "inside-campus-life",
    title: "Inside the Campus Experience",
    description:
      "A deep-dive into student life, activism, and identity across universities.",
    campus: "Selected Universities",
    duration: "32 min",
    thumbnail: "/images/media/documentaries/campus.png",
    platform: "YouTube",
    externalUrl: "https://youtube.com/",
  },
  {
    id: "voices-in-transition",
    title: "Voices in Transition",
    description:
      "Students navigating change, uncertainty, and leadership.",
    campus: "Kenyan Universities",
    duration: "40 min",
    thumbnail: "/images/media/documentaries/voices.png",
    platform: "YouTube",
    externalUrl: "https://youtube.com/",
    comingSoon: true,
  },
];

export default function DocumentariesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-slate-900 min-h-screen">
      <header className="max-w-3xl mb-14">
        <h1 className="text-4xl font-semibold mb-4 text-amber-300">Documentaries</h1>
        <p className="text-white/70">
          Deep-dive visual stories capturing real campus challenges,
          movements, and transformative journeys.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {documentaries.map((item) => (
          <ExternalMediaCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
