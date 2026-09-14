import { notFound } from 'next/navigation'
import { AuthorForm } from '@/components/admin/AuthorForm'
import { getAdminAuthor } from '@/lib/admin-content'

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = await getAdminAuthor(id)

  if (!author) notFound()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit Author</h1>
      <AuthorForm
        initialValue={{
          _id: author._id,
          name: author.name || '',
          slug: author.slug?.current || '',
          image: author.image ?? null,
          bio: author.bio ?? [],
        }}
      />
    </div>
  )
}
