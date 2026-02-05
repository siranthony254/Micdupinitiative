import { HomePage as HeroSection }  from "@/components/home/hero";
import  WhyWeExist  from "@/components/home/WhyWeExist";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { PlaylistsRail } from "@/components/home/PlaylistsRail"; 
import  GetInvolved  from "@/components/home/GetInvolved";
import { Disc } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Homepage Content Data (temporary – later comes from CMS / API)     */
/* ------------------------------------------------------------------ */

const featuredPlaylists = [
  {
    title: "Voices of the Campus",
    count: "8 talks",
    image: "/playlist-1.jpg",
    href: "/watch/playlists/campus",
  },
  {
    title: "African Futures",
    count: "6 talks",
    image: "/playlist-2.jpg",
    href: "/watch/playlists/futures",
  },
  {
    title: "Faith, Truth & Society",
    count: "10 talks",
    image: "/playlist-3.jpg",
    href: "/watch/playlists/faith",
  },
  {
    title: "Creativity",
    count: "5 talks",
    image: "/playlist-4.jpg",
    href: "/watch/playlists/creative",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyWeExist />
      <WhatWeDo />
      <PlaylistsRail title="Featured Playlists" playlists={featuredPlaylists} />
      <GetInvolved />

    </>
  );
}