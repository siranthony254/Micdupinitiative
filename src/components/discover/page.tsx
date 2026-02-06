// app/discover/page.tsx
import { DiscoverHero } from "@/components/discover/DiscoverHero";
import { CategoryRail } from "@/components/discover/CategoryRail";
import { ExternalMediaCard } from "@/components/media/ExternalMediaCard";
import { MediaItem } from "@/components/media/types/media";

interface DiscoverPageProps {
  searchParams: {
    category?: string;
  };
}

async function getVideos(category?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const url = new URL("/api/videos", baseUrl);

  if (category && category !== "all") {
    url.searchParams.set("category", category);
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch videos");
  }

  return res.json();
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const category = searchParams.category ?? "all";

  const { videos } = await getVideos(category);

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero */}
      <DiscoverHero total={videos.length} />

      {/* Category filter */}
      <CategoryRail />

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {videos.length === 0 ? (
          <p className="text-white/60">
            No content found for this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((item: MediaItem) => (
              <ExternalMediaCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
