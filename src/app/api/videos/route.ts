import { NextResponse } from "next/server";
import { getVideos, getRailVideos, getVideosByType, getFeaturedVideos, toMediaItem } from "@/lib/videos";
import type { SanityVideo } from "@/types/video";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const section = searchParams.get("section"); // podcast | talk | documentary | playlist
  const category = searchParams.get("category"); // optional
  const railOnly = searchParams.get("rail") === "true";
  const featured = searchParams.get("featured") === "true";
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    let result: { data?: SanityVideo[] | undefined; error?: Error | null | undefined };
    
    if (railOnly) {
      const railResult = await getRailVideos();
      result = { data: railResult.data, error: railResult.error };
    } else if (featured) {
      const featuredResult = await getFeaturedVideos(limit);
      result = { data: featuredResult.data, error: featuredResult.error };
    } else if (search) {
      const searchResult = await getVideos({ search, limit, offset });
      result = { data: searchResult.data, error: searchResult.error };
    } else if (section) {
      const typeResult = await getVideosByType(section, limit);
      result = { data: typeResult.data, error: typeResult.error };
    } else if (category) {
      const categoryResult = await getVideos({ category, limit, offset });
      result = { data: categoryResult.data, error: categoryResult.error };
    } else {
      const defaultResult = await getVideos({ limit, offset });
      result = { data: defaultResult.data, error: defaultResult.error };
    }

    const { data: videos, error } = result;

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter by section if specified
    let filtered = videos || [];
    
    if (section) {
      filtered = filtered.filter(v => v.type === section);
    }

    if (category && category !== "podcasts" && category !== "talks" && category !== "documentaries") {
      filtered = filtered.filter(v => v.category === category);
    }

    return NextResponse.json({
      videos: filtered.map(toMediaItem),
      nextCursor: null,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Videos API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
