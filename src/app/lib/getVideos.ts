// lib/getVideos.ts
import { headers } from "next/headers";

export async function getVideos(
  section: "podcast" | "talk" | "documentary",
  category?: string
) {
  const params = new URLSearchParams();
  params.set("section", section);
  if (category) params.set("category", category);

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/videos?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch ${section}`);
  }

  return res.json();
}
