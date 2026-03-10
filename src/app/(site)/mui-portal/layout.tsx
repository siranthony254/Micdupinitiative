"use client"

import { AuthProvider } from '@/contexts/mui-auth-context'
import MuiPortalLayout from '@/components/mui-portal-layout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <MuiPortalLayout>
        {children}
      </MuiPortalLayout>
    </AuthProvider>
  )
}
