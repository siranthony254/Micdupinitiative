import dynamic from "next/dynamic";
import { HomePage as HeroSection } from "@/components/home/hero";
import WhyWeExist from "@/components/home/WhyWeExist";
import WhyThisMatters from "@/components/home/WhyThisMatters";
import OurObjectives from "@/components/home/OurObjectives";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import GetInvolved from "@/components/home/GetInvolved";
import ClosingLine from "@/components/home/ClosingLine";

// Dynamically import heavy components
const PlaylistsRail = dynamic(() => import("@/components/home/PlaylistsRail"), {
  loading: () => <div className="animate-pulse bg-gray-800 rounded-lg h-32 w-full" />
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyWeExist />
      <WhyThisMatters />
      <OurObjectives />
      <WhatWeDo />

      {/* Mixed-content editorial rail (podcasts, talks, documentaries) */}
      <PlaylistsRail
        title="Playlists"
        subtitle="Podcasts, talks, and documentaries shaping campus culture"
        viewAllHref="/media"
      />

      <GetInvolved />
      
      {/* Homepage Closing Line Section */}
      <ClosingLine />
    </>
  );
}
