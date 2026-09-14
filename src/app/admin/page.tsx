import Link from 'next/link'
import { Card } from '@/components/ui'
import { getAdminCounts } from '@/lib/admin-content'

export default async function AdminDashboardPage() {
  const counts = await getAdminCounts()

  const tiles = [
    { label: 'Posts', count: counts.posts, href: '/admin/posts', newHref: '/admin/posts/new' },
    { label: 'Updates', count: counts.updates, href: '/admin/updates', newHref: '/admin/updates/new' },
    { label: 'Categories', count: counts.categories, href: '/admin/categories', newHref: '/admin/categories/new' },
    { label: 'Authors', count: counts.authors, href: '/admin/authors', newHref: '/admin/authors/new' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.label}>
            <p className="text-sm text-gray-400">{tile.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{tile.count}</p>
            <div className="mt-4 flex gap-3 text-sm">
              <Link href={tile.href} className="text-amber-500 hover:text-amber-400">
                View all
              </Link>
              <Link href={tile.newHref} className="text-gray-400 hover:text-white">
                + New
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
