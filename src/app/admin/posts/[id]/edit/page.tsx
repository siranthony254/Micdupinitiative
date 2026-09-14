import { notFound } from 'next/navigation'
import { PostForm } from '@/components/admin/PostForm'
import { getAdminPost, getAdminAuthors, getAdminCategories } from '@/lib/admin-content'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, authors, categories] = await Promise.all([
    getAdminPost(id),
    getAdminAuthors(),
    getAdminCategories(),
  ])

  if (!post) notFound()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit Post</h1>
      <PostForm
        initialValue={{
          _id: post._id,
          title: post.title || '',
          slug: post.slug?.current || '',
          authorId: post.authorId || '',
          categoryIds: post.categoryIds || [],
          mainImage: post.mainImage ?? null,
          publishedAt: post.publishedAt || new Date().toISOString(),
          body: post.body || [],
        }}
        authors={authors.map((a: any) => ({ _id: a._id, name: a.name }))}
        categories={categories.map((c: any) => ({ _id: c._id, title: c.title }))}
      />
    </div>
  )
}
