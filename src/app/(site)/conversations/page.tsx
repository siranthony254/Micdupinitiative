import { ConversationsHero } from "@/components/conversations/ConversationsHero";
import { CategoryPlaylistGrid } from "@/components/conversations/CategoryPlaylistGrid";
import { FeaturedVideoHero } from "@/components/home/FeaturedVideoHero";
import { getVideoCategories } from "@/lib/conversations";

export default async function ConversationsPage() {
  const categories = await getVideoCategories();

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "#0D1F35" }}>
      <ConversationsHero />

      {/* Only renders if a video is actually marked featured in the admin panel */}
      <FeaturedVideoHero />

      {/* Only renders if at least one published video has a category set */}
      <CategoryPlaylistGrid categories={categories} />
    </main>
  );
}
