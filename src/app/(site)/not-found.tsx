import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="flex min-h-[70vh] items-center justify-center px-6 text-center text-white"
      style={{ backgroundColor: "#0D1F35" }}
    >
      <div>
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          404
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
          This page hasn&rsquo;t been recorded.
        </h1>
        <p className="mt-4 max-w-md mx-auto text-white/70">
          The conversation you&rsquo;re looking for doesn&rsquo;t exist at this address, or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
