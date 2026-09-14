import { PostForm } from '@/components/admin/PostForm'
import { getAdminAuthors, getAdminCategories } from '@/lib/admin-content'

export default async function NewPostPage() {
  const [authors, categories] = await Promise.all([getAdminAuthors(), getAdminCategories()])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">New Post</h1>
      <PostForm
        authors={authors.map((a: any) => ({ _id: a._id, name: a.name }))}
        categories={categories.map((c: any) => ({ _id: c._id, title: c.title }))}
      />
    </div>
  )
}
