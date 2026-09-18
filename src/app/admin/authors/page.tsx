import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { getAdminAuthors } from '@/lib/admin-content'

export const dynamic = 'force-dynamic'

export default async function AdminAuthorsPage() {
  const authors = await getAdminAuthors()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Authors</h1>
        <Button href="/admin/authors/new">+ New Author</Button>
      </div>

      <Card className="p-0" hover={false}>
        {authors.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No authors yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {authors.map((author: any) => (
                <tr key={author._id} className="border-b border-gray-800 last:border-0">
                  <td className="px-6 py-3 text-white">{author.name}</td>
                  <td className="px-6 py-3 text-gray-400">{author.slug}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/authors/${author._id}/edit`} className="text-amber-500 hover:text-amber-400">
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
