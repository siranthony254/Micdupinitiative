import { FeaturedVideoHero } from "./FeaturedVideoHero";
import { TopConversations } from "./TopConversations";

export function FeaturedConversations() {
  return (
    <section className="text-white" style={{backgroundColor: '#1A3A5C'}}>
      {/* Section Headline */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Conversations
          </h2>
          <p className="text-lg md:text-xl text-white/75 max-w-4xl mx-auto leading-relaxed">
            Big ideas. Real campus conversations.
            These are not highlights. These are beginning of a record — a growing archive of what African students are actually thinking, feeling, building, and asking. The conversations happen on campuses. The impact travels further.
          </p>
        </div>
      </div>

      {/* Featured Video Hero */}
      <FeaturedVideoHero />

      {/* Top Conversations */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="text-center mb-8">
          <p className="text-lg text-white/75 mb-4">
            Every conversation is archived. Every voice is preserved.
          </p>
          <div className="flex items-center justify-center gap-2 text-white/60">
            <span>→</span>
            <span className="text-amber-400 hover:text-amber-300 transition-colors">
              See all conversations
            </span>
          </div>
        </div>
        
        <TopConversations />
      </div>
    </section>
  );
}
