"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      className="flex min-h-[70vh] items-center justify-center px-6 text-center text-white"
      style={{ backgroundColor: "#0D1F35" }}
    >
      <div>
        <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
          Something went wrong
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
          We hit a snag loading this page.
        </h1>
        <p className="mt-4 max-w-md mx-auto text-white/70">
          Try again, or head back to the homepage. If this keeps happening, let us know.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
