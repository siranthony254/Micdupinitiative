export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { DiscoverGrid } from "@/components/discover/DiscoverGrid";
import { DiscoverHero } from "@/components/discover/DiscoverHero";
import { CategoryRail } from "@/components/discover/CategoryRail";

export default function DiscoverPage() {
  return (
    <main className="bg-white text-black">
      <DiscoverHero />

      <Suspense fallback={<div className="h-12" />}>
        <CategoryRail />
      </Suspense>

      <DiscoverGrid />
    </main>
  );
}
