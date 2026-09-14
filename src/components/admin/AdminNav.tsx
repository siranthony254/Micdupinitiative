"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/updates', label: 'Updates' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/authors', label: 'Authors' },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    router.push('/auth/signin')
  }

  return (
    <aside className="flex w-60 flex-none flex-col border-r border-gray-800 bg-gray-900 text-gray-300">
      <div className="border-b border-gray-800 px-5 py-5">
        <span className="text-sm font-semibold text-amber-500">MUI Admin</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_LINKS.map((link) => {
          const active = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active ? 'bg-amber-500 text-black' : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-800 px-5 py-4">
        <p className="mb-3 truncate text-xs text-gray-500">{user?.email}</p>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
