import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { getAdminCategories } from '@/lib/admin-content'

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Categories</h1>
        <Button href="/admin/categories/new">+ New Category</Button>
      </div>

      <Card className="p-0" hover={false}>
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No categories yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((category: any) => (
                <tr key={category._id} className="border-b border-gray-800 last:border-0">
                  <td className="px-6 py-3 text-white">{category.title}</td>
                  <td className="px-6 py-3 text-gray-400">{category.slug}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/categories/${category._id}/edit`} className="text-amber-500 hover:text-amber-400">
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
