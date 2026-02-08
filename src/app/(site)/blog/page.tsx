// app/(site)/blog/page.tsx
import Link from "next/link";
import { getPublishedPosts } from "@/libs/notion";
import { PageShell } from "@/components/layout/PageShell";

export const runtime = "nodejs";

export default async function BlogListPage() {
  const posts: any[] = await getPublishedPosts();

  return (
    <PageShell title="MUI Blog">
      <div className="mx-auto max-w-5xl space-y-10">
        {posts.map((post) => {
          const props = post.properties;
          const title = props.Title.title[0]?.plain_text ?? "Untitled";
          const excerpt = props.Excerpt?.rich_text[0]?.plain_text ?? "";
          const coverUrl =
            props.Cover?.files?.[0]?.file?.url ||
            props.Cover?.files?.[0]?.external?.url ||
            null;
          // Make slug URL-safe
          const slug = encodeURIComponent(
            props.Slug?.rich_text[0]?.plain_text ?? post.id
          );
          const publishedDate = props.Published?.date?.start
            ? new Date(props.Published.date.start).toLocaleDateString()
            : "Draft";

          return (
            <article
              key={post.id}
              className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 md:p-8 backdrop-blur"
            >
              {/* Cover */}
              {coverUrl && (
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={coverUrl}
                    alt={title}
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}

              {/* Meta */}
              <p className="mb-2 text-xs uppercase tracking-wide text-white/50">
                {publishedDate}
              </p>

              {/* Title */}
              <h2 className="mb-3 text-2xl font-semibold leading-tight tracking-tight text-white">
                {title}
              </h2>

              {/* Excerpt */}
              <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/75 line-clamp-3">
                {excerpt}
              </p>

              {/* Read More */}
              <Link
                href={`/blog/${slug}`}
                className="inline-flex items-center text-sm font-medium text-amber-400 transition hover:text-amber-300"
              >
                Read More
                <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
