export function DiscoverHero({ total }: { total?: number }) {
  return (
    <section className="border-b border-black/10 bg-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
            DISCOVER
          </p>

          <h1 className="text-4xl font-semibold leading-tight text-black">
            Real Voices: Transformative Conversations.
          </h1>

          <p className="mt-4 text-black/70">
            Curated campus voices from YouTube, Instagram, and TikTok —
            focused on depth, dialogue, and cultural relevance.
          </p>
        </div>

        <div className="bg-black text-white flex items-center justify-center aspect-video">
          <span className="text-5xl font-semibold">
            {total ? `${total}+` : "—"}
          </span>
        </div>
      </div>
    </section>
  );
}
