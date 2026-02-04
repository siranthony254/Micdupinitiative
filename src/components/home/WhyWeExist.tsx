// src/components/home/WhyWeExist.tsx

export default function WhyWeExist() {
  return (
   <section className="border-b border-white/10 bg-neutral-950 text-white">
  <div className="mx-auto max-w-7xl px-6 py-7">

    {/* Eyebrow */}
    <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
      Our Purpose
    </span>

    {/* Headline */}
    <h2 className="mt-4 text-3xl lg:text-4xl font-semibold max-w-3xl text-white">
      Why Mic’d Up Exists
    </h2>

    {/* Editorial intro */}
    <p className="mt-6 text-base text-white/70 max-w-3xl leading-relaxed">
      Across campuses, ideas are forming, leaders are emerging, and culture is
      being shaped — yet much of this remains unseen, unheard, or misrepresented.
      Mic’d Up Initiative exists to bring structure, clarity, and responsibility
      to campus expression.
    </p>

    {/* Core reasons */}
    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

      <div>
        <h3 className="text-sm font-semibold text-amber-500">
          Unheard Voices
        </h3>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">
          Talent and ideas exist across campuses, but few platforms amplify them
          with intention, depth, and purpose.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-amber-500">
          Distorted Visibility
        </h3>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">
          Digital attention often rewards extremes rather than excellence,
          substance, or integrity.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-amber-500">
          Untapped Leadership
        </h3>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">
          Campuses are forming not tomorrow’s leaders, but also leaders of today — yet their voices rarely enter
          serious public discourse.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-amber-500">
          Content Without Direction
        </h3>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">
          Influence without values creates noise, not progress.
        </p>
      </div>

    </div>

    {/* Closing conviction */}
    <div className="mt-14 max-w-3xl">
      <p className="text-base font-medium text-white/70">
        Mic’d Up Initiative exists to change the narrative — amplifying authentic
        campus voices, cultivating leadership, and shaping responsible cultural
        influence.
      </p>
      <p className="mt-1 text-base font-medium text-emerald-400">
       Society is shaped by voices and that's what we exist to amplify across the Campuses. How campuses express themselves today shapes the society of
        tomorrow! 
      </p>
    </div>

  </div>
</section>
  );
}