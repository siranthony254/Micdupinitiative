import { HomePage as HeroSection } from "@/components/home/hero";
import WhyWeExist from "@/components/home/WhyWeExist";
import WhyThisMatters from "@/components/home/WhyThisMatters";
import OurObjectives from "@/components/home/OurObjectives";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import GetInvolved from "@/components/home/GetInvolved";
import ClosingLine from "@/components/home/ClosingLine";
import { FeaturedConversations } from "@/components/home/FeaturedConversations";

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

      <GetInvolved />
      
      {/* Homepage Closing Line Section */}
      <ClosingLine />
    </>
  );
}
