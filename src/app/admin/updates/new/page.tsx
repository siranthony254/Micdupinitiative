import { UpdateForm } from '@/components/admin/UpdateForm'

export const dynamic = 'force-dynamic'

export default function NewUpdatePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">New Update</h1>
      <UpdateForm />
    </div>
  )
}
