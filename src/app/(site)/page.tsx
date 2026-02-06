import { HomePage as HeroSection }  from "@/components/home/hero";
import  WhyWeExist  from "@/components/home/WhyWeExist";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { CategoryRail } from "@/components/discover/CategoryRail";
import { PlaylistsRail } from "@/components/home/PlaylistsRail"; 
import  GetInvolved  from "@/components/home/GetInvolved";
import { Disc } from "lucide-react";





export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyWeExist />
      <WhatWeDo />
      <CategoryRail />
      <PlaylistsRail title="Playlists" type="podcast"/>
      <GetInvolved />

    </>
  );
}