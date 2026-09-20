import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideosByCategorySlug } from "@/lib/conversations";
import { getVideoYouTubeId, getVideoThumbnailUrl } from "@/lib/videos";
import { getYouTubeVideoDetails } from "@/lib/youtube-api";
import { CategoryVideoList, type CategoryVideoItem } from "@/components/conversations/CategoryVideoList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getVideosByCategorySlug(slug);

  if (!result) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${result.name} | MUI Conversations`,
    description: `Campus conversations in ${result.name}, from Mic'd Up Initiative.`,
  };
}

export default async function ConversationCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getVideosByCategorySlug(slug);

  if (!result || result.videos.length === 0) {
    notFound();
  }

  const youtubeIds = result.videos
    .map((video) => getVideoYouTubeId(video))
    .filter((id): id is string => Boolean(id));

  const youtubeDetails = await getYouTubeVideoDetails(youtubeIds);

  const videos: CategoryVideoItem[] = result.videos.map((video) => {
    const youtubeId = getVideoYouTubeId(video);
    const details = youtubeId ? youtubeDetails[youtubeId] : undefined;

    return {
      id: video._id,
      youtubeId,
      title: details?.title || video.title || "Untitled video",
      description: details?.description || video.description || "",
      thumbnailUrl: details?.thumbnailUrl || getVideoThumbnailUrl(video),
      duration: video.duration,
      campus: video.campus,
      publishedAt: details?.publishedAt || video.publishedAt,
    };
  });

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "#0D1F35" }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Link
          href="/conversations"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition"
        >
          ← All Conversations
        </Link>

        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          Playlist
        </span>
        <h1 className="mt-3 mb-10 text-3xl md:text-4xl font-bold tracking-tight text-white">
          {result.name}
        </h1>

        <CategoryVideoList videos={videos} />
      </div>
    </main>
  );
}
