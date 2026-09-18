import { AuthorForm } from '@/components/admin/AuthorForm'

export const dynamic = 'force-dynamic'

export default function NewAuthorPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">New Author</h1>
      <AuthorForm />
    </div>
  )
}
