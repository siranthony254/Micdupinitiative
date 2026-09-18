import { notFound } from 'next/navigation'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { getAdminCategory } from '@/lib/admin-content'

export const dynamic = 'force-dynamic'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getAdminCategory(id)

  if (!category) notFound()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit Category</h1>
      <CategoryForm
        initialValue={{
          _id: category._id,
          title: category.title || '',
          slug: category.slug?.current || '',
          description: category.description || '',
        }}
      />
    </div>
  )
}
