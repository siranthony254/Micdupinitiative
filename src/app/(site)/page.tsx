import { HomePage as HeroSection } from "@/components/home/hero";
import WhatWeAreDoingNow from "@/components/home/WhatWeAreDoingNow";
import WhyWeExist from "@/components/home/WhyWeExist";
import WhyThisMatters from "@/components/home/WhyThisMatters";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import GetInvolved from "@/components/home/GetInvolved";
import ClosingLine from "@/components/home/ClosingLine";
import OurObjectives from "@/components/home/OurObjectives";
import { FeaturedConversations } from "@/components/home/FeaturedConversations";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* This semester's actual work, stated plainly, before anything else */}
      <WhatWeAreDoingNow />

      {/* Featured Conversations Section — the largest, most present-tense
          section on the page, promoted directly under the hero framing */}
      <FeaturedConversations />

      <WhyWeExist />
      <WhyThisMatters />
      <WhatWeDo />

      <GetInvolved />

      {/* Homepage Closing Line Section */}
      <ClosingLine />

      {/* The wider institutional horizon — kept, but demoted below the
          fold so it reads as where the work can lead, not what it already is */}
      <OurObjectives />
    </>
  );
}
