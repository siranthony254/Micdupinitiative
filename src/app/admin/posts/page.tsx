import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { getAdminPosts } from '@/lib/admin-content'

export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
  const posts = await getAdminPosts()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Posts</h1>
        <Button href="/admin/posts/new">+ New Post</Button>
      </div>

      <Card className="p-0" hover={false}>
        {posts.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No posts yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Author</th>
                <th className="px-6 py-3 font-medium">Published</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post: any) => (
                <tr key={post._id} className="border-b border-gray-800 last:border-0">
                  <td className="px-6 py-3 text-white">{post.title}</td>
                  <td className="px-6 py-3 text-gray-400">{post.authorName || '—'}</td>
                  <td className="px-6 py-3 text-gray-400">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/posts/${post._id}/edit`} className="text-amber-500 hover:text-amber-400">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
