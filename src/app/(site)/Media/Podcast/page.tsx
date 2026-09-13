import Link from "next/link";
import { MediaGallery } from "@/components/media/MediaGallery";
import { getVideos } from "@/app/lib/getVideos";

export default async function PodcastsPage() {
  const data = await getVideos("podcast");

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 min-h-screen text-white" style={{backgroundColor: '#0D1F35'}}>
      <header className="max-w-3xl mb-14">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          A Conversation Format
        </span>
        <h1 className="mt-3 text-4xl font-semibold mb-4 text-amber-300">
          Campus Podcast
        </h1>
        <p className="text-white/70">
          The longest-running way we carry a conversation — long-form campus
          conversations on faith, leadership, and growth.
        </p>
        <Link href="/conversations" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition">
          See all MUI Conversations
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      <MediaGallery items={data.videos} />
    </section>
  );
}
