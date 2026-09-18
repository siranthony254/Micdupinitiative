import Link from "next/link";

// Root-level fallback for routes outside the (site) group (e.g. /admin/*).
// Public pages get the fuller, chrome-wrapped version at src/app/(site)/not-found.tsx.
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
      <div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link href="/" className="mt-4 inline-block text-amber-500 hover:text-amber-400">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
