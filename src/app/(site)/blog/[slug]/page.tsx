// app/(site)/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/libs/notion";
import { PageShell } from "@/components/layout/PageShell";
import dynamic from "next/dynamic";

// Client-only Notion renderer
const NotionContent = dynamic(
  () => import("@/components/notion/NotionRenderer"),
  {
    ssr: false,
    loading: () => (
      <p className="mt-12 text-center text-sm text-white/50">
        Loading content…
      </p>
    ),
  }
);

export const runtime = "nodejs";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const post: any = await getPostBySlug(params.slug);

    if (!post) return notFound();

    const props = post.properties;

    const title = props.Title.title[0]?.plain_text ?? "Untitled";
    const excerpt = props.Excerpt?.rich_text[0]?.plain_text ?? "";
    const coverUrl =
      props.Cover?.files?.[0]?.file?.url ||
      props.Cover?.files?.[0]?.external?.url ||
      null;
    const publishedDate = props.Published?.date?.start
      ? new Date(props.Published.date.start).toLocaleDateString()
      : "Draft";

    // Fetch Notion page content
    let recordMap: any = null;
    try {
      recordMap = await fetch(
        `https://notion-api.splitbee.io/v1/page/${post.id}`
      ).then((res) => res.json());
    } catch (err) {
      console.error("Error fetching Notion page:", err);
      recordMap = null;
    }

    return (
      <PageShell title={title}>
        <article className="mx-auto max-w-3xl">
          {/* Cover */}
          {coverUrl && (
            <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10">
              <img
                src={coverUrl}
                alt={title}
                className="h-[22rem] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>
          )}

          {/* Meta */}
          <p className="mb-3 text-xs uppercase tracking-wide text-white/50">
            {publishedDate}
          </p>

          {/* Title */}
          <h1 className="mb-5 text-4xl font-semibold leading-tight tracking-tight text-white">
            {title}
          </h1>

          {/* Excerpt / Dek */}
          {excerpt && (
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/75">
              {excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="mb-10 h-px w-full bg-white/10" />

          {/* Notion Content */}
          <div className="prose prose-invert prose-neutral max-w-none prose-p:leading-relaxed prose-p:text-white/80 prose-headings:text-white prose-a:text-amber-400 hover:prose-a:text-amber-300">
            {recordMap && Object.keys(recordMap).length > 0 ? (
              <NotionContent recordMap={recordMap} />
            ) : (
              <p className="mt-8 text-center text-sm text-white/50">
                Content unavailable.
              </p>
            )}
          </div>
        </article>
      </PageShell>
    );
  } catch (error) {
    console.error("Failed to load blog content:", error);
    return (
      <PageShell title="Error">
        <p className="mt-12 text-center text-sm text-red-400">
          Failed to load blog content. Please try again later.
        </p>
      </PageShell>
    );
  }
}
