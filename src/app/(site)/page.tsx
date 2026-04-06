import { HomePage as HeroSection } from "@/components/home/hero";
import WhyWeExist from "@/components/home/WhyWeExist";
import OurObjectives from "@/components/home/OurObjectives";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { PlaylistsRail } from "@/components/home/PlaylistsRail";
import GetInvolved from "@/components/home/GetInvolved";
import ClosingLine from "@/components/home/ClosingLine";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyWeExist />
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
