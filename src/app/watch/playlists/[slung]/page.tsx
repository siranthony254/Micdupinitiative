import { notFound } from "next/navigation";

interface PlaylistPageProps {
  params: { slug: string };
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const category = params.slug.replace(/-/g, " ");

  const res = await fetch(
    `/api/videos?section=playlist&category=${encodeURIComponent(category)}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const data = await res.json();
  if (!data.videos || data.videos.length === 0) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="mb-10 text-3xl font-semibold capitalize">
        {category}
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.videos.map((video: any) => (
          <div
            key={video.youtubeId}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              className="aspect-video w-full"
              allowFullScreen
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
