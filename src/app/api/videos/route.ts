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
      category: "Mental Health",
      title: "Pressure, Expectations & Balance",
      description: "Navigating mental health in campus spaces.",
      campus: "Muranga University of Technology",
      duration: "48 min",
      thumbnail: "https://img.youtube.com/vi/YjrYed2sCz4/hqdefault.jpg",
      primaryPlatform: "youtube",
      youtubeId: "YjrYed2sCz4",
      externalUrl: "https://youtu.be/YjrYed2sCz4",
      social: {
        youtube: "https://youtu.be/YjrYed2sCz4",
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
      showInRail: true,
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

if (category && category !== "All") {
  filtered = filtered.filter(v => v.category === category);
}

return NextResponse.json({
  videos: filtered,
  nextCursor: null,
});
}
