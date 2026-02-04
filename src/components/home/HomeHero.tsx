import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="relative bg-neutral-950 text-white overflow-hidden">
  {/* Background Visual */}
  <div className="absolute inset-0">
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/80 to-neutral-900/40" />
  </div>

  {/* Content */}
  <div className="relative mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    
    {/* LEFT: Statement */}
    <div>
      <span className="inline-block mb-4 text-xs font-semibold tracking-widest uppercase text-emerald-400">
        Mic’d Up Initiative
      </span>

      <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white">
        Voicing a Generation.
        <br />
        Shaping Culture.
        <br />
        Restoring Purpose.
      </h1>

      <p className="mt-6 text-base lg:text-lg text-white/70 max-w-xl">
        MUI is a transformative movement that shapes,the culture of campuses by amplifying voices, ideas,
and issues that matter, raising a renewed
generation of young people formed into holistic
excellence across campuses and beyond.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex items-center gap-6">
        <Link
          href="/mic-the-campus"
          className="
            inline-flex items-center justify-center
            px-7 py-3 text-sm font-medium
            bg-amber-500 text-black
            rounded-full
            hover:bg-amber-400 transition
          "
        >
          Mic the Campus
        </Link>
        
        <Link
          href="/Get-involved/Partnerships"
          className="text-sm font-medium text-royal-400 underline underline-offset-4 hover:text-royal-300 transition"
        >
          Partner With Us
        </Link>
      </div>

      {/* Credibility Line */}
      <div className="mt-10 text-xs text-white/60">
        Podcasts • Campus Talks • Research • Cultural Documentation
      </div>
    </div>

    {/* RIGHT: Reserved Visual Space (future video) */}
    <div className="hidden lg:block relative">
      <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <Image
          src="/images/hero.jpeg"
          alt="Mic’d Up Campus Talk"
          fill
          className="object-cover"
        />
      </div>
    </div>

  </div>
</section>
  );
}



