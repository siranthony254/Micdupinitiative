import { notFound } from 'next/navigation'
import { UpdateForm } from '@/components/admin/UpdateForm'
import { getAdminUpdate } from '@/lib/admin-content'

export default async function EditUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const update = await getAdminUpdate(id)

  if (!update) notFound()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit Update</h1>
      <UpdateForm
        initialValue={{
          _id: update._id,
          title: update.title || '',
          description: update.description || '',
          type: update.type || 'general',
          image: update.image ?? null,
          link: update.link || '',
          featured: update.featured ?? false,
          order: update.order ?? 0,
          showInRail: update.showInRail ?? false,
          publishedAt: update.publishedAt || new Date().toISOString(),
          expiryDate: update.expiryDate || '',
          content: update.content || [],
          memoContent: update.memoContent || [],
          memoSender: update.memoSender || '',
          memoReference: update.memoReference || '',
        }}
      />
    </div>
  )
}
