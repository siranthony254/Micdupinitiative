"use client";

// Root-level fallback for routes outside the (site) group (e.g. /admin/*).
// Public pages get the fuller, chrome-wrapped version at src/app/(site)/error.tsx.
export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
      <div>
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
