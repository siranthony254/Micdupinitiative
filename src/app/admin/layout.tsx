import { AuthProvider } from '@/contexts/auth-context'
import { AdminNav } from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-black">
        <AdminNav />
        <main className="flex-1 overflow-x-hidden p-8">{children}</main>
      </div>
    </AuthProvider>
  )
}
