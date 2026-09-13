// src/app/(site)/Media/Documentaries/page.tsx
import Link from "next/link";
import { MediaGallery } from "@/components/media/MediaGallery";
import { getVideos } from "@/app/lib/getVideos";

export default async function DocumentariesPage() {
  const data = await getVideos("documentary");

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 min-h-screen text-white" style={{backgroundColor: '#0D1F35'}}>
      <header className="max-w-3xl mb-14">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          A Future Conversation Format
        </span>
        <h1 className="mt-3 text-4xl font-semibold mb-4 text-amber-300">
          Documentaries
        </h1>
        <p className="text-white/70">
          Deep-dive visual stories capturing real campus challenges.
        </p>
        <span className="mt-6 inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-amber-300">
          Coming Soon
        </span>
        <p className="mt-3 text-white/70">
          We are curating impactful documentaries that spotlight real campus stories, challenges, and triumphs. Stay tuned for powerful visual narratives coming your way.
        </p>
        <Link href="/conversations" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition">
          See what&apos;s already recorded
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      <MediaGallery items={data.videos} />
    </section>
  );
}
