import Link from 'next/link'
import { Card, Button, Badge } from '@/components/ui'
import { getAdminUpdates } from '@/lib/admin-content'

export default async function AdminUpdatesPage() {
  const updates = await getAdminUpdates()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Updates</h1>
        <Button href="/admin/updates/new">+ New Update</Button>
      </div>

      <Card className="p-0" hover={false}>
        {updates.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No updates yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Flags</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {updates.map((update: any) => (
                <tr key={update._id} className="border-b border-gray-800 last:border-0">
                  <td className="px-6 py-3 text-white">{update.title}</td>
                  <td className="px-6 py-3 text-gray-400">{update.type}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {update.featured && <Badge variant="warning">Featured</Badge>}
                      {update.showInRail && <Badge variant="success">On Rail</Badge>}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/updates/${update._id}/edit`} className="text-amber-500 hover:text-amber-400">
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
