import { ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/mui-auth-context'

interface LayoutProps {
  children: ReactNode
}

export default function MuiPortalLayout({ children }: LayoutProps) {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading MUI Portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/mui-portal" className="flex items-center">
              <span className="text-xl font-bold text-amber-500">MUI Portal</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/mui-portal/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/mui-portal/courses" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Courses
              </Link>
              <Link href="/mui-portal/cohorts" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Cohorts
              </Link>
              {profile?.role === 'admin' && (
                <Link href="/mui-portal/admin" className="text-amber-500 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </Link>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-300">
                    {profile?.full_name || user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/mui-portal/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/mui-portal/signup"
                    className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Society is shaped by voices; we are the mic
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2024 MUI Portal. Campus Initiative Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
