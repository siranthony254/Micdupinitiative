import { NextResponse } from "next/server";
import { MediaItem } from "@/components/media/types/media";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const section = searchParams.get("section"); // podcast | talk | documentary | playlist
  const category = searchParams.get("category"); // optional

  const videos: MediaItem[] = [
    // ===================== PODCASTS =====================
    {
      id: "playlist-faith-001",
      type: "podcast",
      category: "Faith & Spiritual Growth",
      title: "Living as a System of Purpose",
      description: "Living purposefully in campus.",
      campus: "Muranga University of Technology",
      duration: "35 min",
      thumbnail: "https://img.youtube.com/vi/_Ngw2Houq68/hqdefault.jpg",
      primaryPlatform: "youtube",
      youtubeId: "_Ngw2Houq68",
      externalUrl: "https://youtu.be/_Ngw2Houq68",
      social: {
        youtube: "https://youtu.be/_Ngw2Houq68",
      },
      showInRail: true, // 👈 hidden but still accessible via API
    },

    {
      id: "mui-podcast-001",
      type: "podcast",
      category: "Personal Growth",
      title: "Fresher Life & Mental Health",
      description: "Student voices on the challenges and growth of first-year campus life.",
      campus: "Muranga University of Technology",
      duration: "52 min",
      thumbnail: "https://img.youtube.com/vi/o1zGk4rtoC8/hqdefault.jpg",
      primaryPlatform: "youtube",
      youtubeId: "o1zGk4rtoC8",
      externalUrl: "https://youtu.be/o1zGk4rtoC8",
      social: {
        youtube: "https://youtu.be/o1zGk4rtoC8",
      },
      comingSoon: false,

      featured: true,     // 👈 editorial hero
      showInRail: true,   // 👈 visible in PlaylistsRail
    },

    {
      id: "mui-podcast-002",
      type: "talk",
      category: "Purpose & Meaning",
      title: "Purpose in Campus",
      description: "Navigating purpose and meaning during university life.",
      campus: "Muranga University of Technology",
      duration: "48 min",
      thumbnail: "https://img.youtube.com/vi/NH4X8cWDFBo/hqdefault.jpg",
      primaryPlatform: "youtube",
      youtubeId: "NH4X8cWDFBo",
      externalUrl: "https://youtu.be/NH4X8cWDFBo",
      social: {
        youtube: "https://youtu.be/NH4X8cWDFBo",
      },
      showInRail: true,
    },

    // ===================== DOCUMENTARIES =====================
    {
      id: "doc-campus-life-001",
      type: "documentary",
      category: "Student Life",
      title: "Fresher Life Documentary",
      description: "A documentary exploring fresher life.",
      campus: "Muranga University of Technology",
      duration: "32 min",
      thumbnail: "https://img.youtube.com/vi/_Ngw2Houq68/hqdefault.jpg",
      primaryPlatform: "youtube",
      youtubeId: "_Ngw2Houq68",
      externalUrl: "https://youtu.be/_Ngw2Houq68",
      social: {
        youtube: "https://youtu.be/_Ngw2Houq68",
      },
      showInRail: false,
    },

    // ===================== TALKS =====================
    {
      id: "muc-talk-001",
      type: "talk",
      category: "Student Life",
      title: "Campus Reality Talk",
      description: "A short campus talk.",
      campus: "Muranga University of Technology",
      duration: "14 min",
      thumbnail: "https://img.youtube.com/vi/OKwxZonPRZc/hqdefault.jpg",
      primaryPlatform: "youtube",
      youtubeId: "OKwxZonPRZc",
      externalUrl: "https://youtu.be/OKwxZonPRZc",
      social: {
        youtube: "https://youtu.be/OKwxZonPRZc",
      },
      showInRail: true, // 👈 exists, but NOT shown in rail
    },
  ];

  // ===================== FILTERING =====================
  let filtered = videos;

  if (section) {
    filtered = filtered.filter(v => v.type === section);
  }

  if (category && category !== "podcasts" && category !== "talks" && category !== "documentaries") {
    filtered = filtered.filter(v => v.category === category);
  }

  // 👇 Editorial visibility control for rails
  filtered = filtered.filter(v => v.showInRail !== false);

  return NextResponse.json({
    videos: filtered,
    nextCursor: null,
  });
}
