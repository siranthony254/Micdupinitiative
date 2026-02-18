import { HomePage as HeroSection } from "@/components/home/hero";
import WhyWeExist from "@/components/home/WhyWeExist";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { PlaylistsRail } from "@/components/home/PlaylistsRail";
import GetInvolved from "@/components/home/GetInvolved";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyWeExist />
      <WhatWeDo />

      {/* Mixed-content editorial rail (podcasts, talks, documentaries) */}
      <PlaylistsRail
        title="Playlists"
        subtitle="Podcasts, talks, and documentaries shaping campus culture"
        viewAllHref="/media"
      />

      <GetInvolved />
    </>
  );
}
