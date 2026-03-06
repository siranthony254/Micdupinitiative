"use client"

import { Suspense } from "react"
import LoginPageContent from "./login-content"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading login...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}