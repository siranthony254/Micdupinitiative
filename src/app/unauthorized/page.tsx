import Link from 'next/link'
import { Card } from '@/components/ui'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <Card className="w-full max-w-sm text-center">
        <h1 className="mb-3 text-xl font-semibold text-white">Admin access required</h1>
        <p className="mb-6 text-sm text-gray-400">
          Your account doesn&rsquo;t have permission to view this page. If you believe this is a
          mistake, ask an existing admin to grant your account access.
        </p>
        <Link href="/" className="text-sm font-medium text-amber-500 hover:text-amber-400">
          Back to the site
        </Link>
      </Card>
    </div>
  )
}
