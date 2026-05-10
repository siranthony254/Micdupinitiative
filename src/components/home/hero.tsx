import Image from "next/image";
import Link from "next/link";

export function HomePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-6 left-6 text-emerald-500 font-semibold tracking-wide">
        Mic&apos;d Up Initiative
      </div>

      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/background-1.jpg"
          alt="Campus dialogue and collaboration"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.6] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-950/90" />
      </div>

      <section className="relative max-w-4xl px-6 md:px-10 text-center animate-[fadeUp_700ms_ease-out_both]">
        <h1 className="mb-6 tracking-tight leading-tight">
          <span className="block text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] md:leading-[1.1] mb-4">
            Join a Generation
          </span>

          <span className="block text-2xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent leading-[1.2] text-center">
            <span className="block text-inherit leading-inherit">
              Becoming Clear Thinkers, Bold Voices And
            </span>
            <span className="block text-inherit leading-inherit">
              Responsible Influencers
            </span>
          </span>
        </h1>

        <div className="mt-6 space-y-3">
          <p className="text-base md:text-lg text-white/75 leading-relaxed">
            Because voices shape society and real problems will be solved by bold
            people who were heard, formed, and trusted even while they were still
            in school. MUI focuses on helping you express truth with clarity,
            conviction, and responsibility.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/About/OurStory"
            className="inline-flex items-center gap-2 rounded-full border border-white/60 px-8 py-3 text-sm md:text-base font-medium text-white hover:bg-white hover:text-slate-900 hover:scale-[1.04] active:scale-[0.97] transition-all duration-300"
          >
            Learn More
            <span className="text-lg leading-none" aria-hidden="true">
              ↓
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
