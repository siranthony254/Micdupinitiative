"use client"

import { useState } from 'react'

export default function MuiPortalLanding() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl">
          <div>
            <h1 className="text-6xl font-bold text-amber-500 mb-4">MUI Portal</h1>
            <p className="text-xl text-gray-400">Society is shaped by voices; we are the mic</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              Welcome to the Campus Initiative Learning Platform
            </p>
            <div className="space-x-4">
              <a
                href="/mui-portal/login"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                href="/mui-portal/signup"
                className="inline-block border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>
          
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading...</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Self-Paced Courses</h3>
              <p className="text-gray-400 text-sm">Learn at your own speed with comprehensive courses</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cohort Learning</h3>
              <p className="text-gray-400 text-sm">Join cohorts and learn together with peers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Progress Tracking</h3>
              <p className="text-gray-400 text-sm">Monitor your learning progress and achievements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-8">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a
                href="/debug"
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="text-white font-medium">Debug Panel</div>
                  <div className="text-gray-400 text-sm mt-1">Check system status</div>
                </div>
              </a>
              
              <a
                href="/mui-portal/login"
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🔐</div>
                  <div className="text-white font-medium">Sign In</div>
                  <div className="text-gray-400 text-sm mt-1">Access your account</div>
                </div>
              </a>
              
              <a
                href="/mui-portal/signup"
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="text-white font-medium">Sign Up</div>
                  <div className="text-gray-400 text-sm mt-1">Create new account</div>
                </div>
              </a>
              
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-white font-medium">Courses</div>
                  <div className="text-gray-400 text-sm mt-1">Coming soon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
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
