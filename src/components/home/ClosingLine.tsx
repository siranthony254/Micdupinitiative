import { FadeInSection } from "@/components/FadeInSection";

export default function ClosingLine() {
  return (
    <section className="relative text-white py-12 overflow-hidden" style={{backgroundColor: '#0D1F35'}}>
      <div className="mx-auto max-w-6xl px-6">
        <FadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-amber-400 mb-6">
            Voices shape society!
          </h2>

          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-4xl mx-auto">
            We exist to ensure that the voices shaping tomorrow's Africa are formed with purpose, grounded in integrity, and heard while they are still young enough to act on what they believe.
          </p>

          {/* Decorative Element */}
          <div className="mt-8 flex justify-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
