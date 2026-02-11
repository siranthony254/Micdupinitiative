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

    // --- Basic Fields ---
    const title = props.Title?.title?.[0]?.plain_text ?? "Untitled";
    const excerpt = props.Excerpt?.rich_text?.[0]?.plain_text ?? "";
    const coverUrl =
      props.Cover?.files?.[0]?.file?.url ||
      props.Cover?.files?.[0]?.external?.url ||
      null;
    const publishedDate = props.Published?.date?.start
      ? new Date(props.Published.date.start).toLocaleDateString()
      : "Draft";

    // --- Optional Author ---
    const author = props.Author?.rich_text?.[0]?.plain_text ?? null;

    // --- Fetch Notion page content safely ---
    let recordMap: any = null;
    try {
      const res = await fetch(
        `https://notion-api.splitbee.io/v1/page/${post.id}`
      );
      if (!res.ok) throw new Error("Notion page fetch failed");
      recordMap = await res.json();
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
          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-white">
            {title}
          </h1>

          {/* Author byline */}
          {author && (
            <p className="mb-6 text-sm text-white/60">
              By <span className="text-white/80">{author}</span>
            </p>
          )}

          {/* Excerpt / Dek */}
          {excerpt && (
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/75">
              {excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="mb-12 h-px w-full bg-white/10" />

          {/* Notion Content */}
          <div
            className="
              prose prose-invert prose-neutral max-w-none
              prose-p:leading-relaxed prose-p:text-white/80
              prose-headings:text-white
              prose-a:text-amber-400 hover:prose-a:text-amber-300

              /* Pull quotes */
              prose-blockquote:border-l-amber-400/40
              prose-blockquote:bg-white/5
              prose-blockquote:py-4
              prose-blockquote:px-6
              prose-blockquote:not-italic
              prose-blockquote:text-white/85
              prose-blockquote:rounded-r-xl

              /* Footnotes / references */
              prose-ol:text-sm
              prose-ul:text-sm
              prose-li:text-white/60
              prose-li:leading-relaxed
              prose-hr:border-white/10
            "
          >
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
