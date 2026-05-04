import { HomePage as HeroSection } from "@/components/home/hero";
import WhyWeExist from "@/components/home/WhyWeExist";
import WhyThisMatters from "@/components/home/WhyThisMatters";
import OurObjectives from "@/components/home/OurObjectives";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import GetInvolved from "@/components/home/GetInvolved";
import ClosingLine from "@/components/home/ClosingLine";
import { FeaturedConversations } from "@/components/home/FeaturedConversations";
import { PlaylistsRail } from "@/components/home/PlaylistsRail";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyWeExist />
      <WhyThisMatters />
      <OurObjectives />
      <WhatWeDo />

      {/* Featured Conversations Section */}
      <FeaturedConversations />

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
