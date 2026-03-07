"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function CookiePolicy() {
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }))

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-amber-500">MUI</h1>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-gray-400">Mic'd Up Initiative (MUI)</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: {currentDate}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 prose prose-invert max-w-none">
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">1. How MUI Uses Cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Mic'd Up Initiative uses cookies to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Maintain login sessions in the MUI Portal</li>
              <li>Understand how visitors interact with the website</li>
              <li>Improve website functionality and performance</li>
              <li>Provide a smoother navigation experience</li>
            </ul>
          </section>
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">2. Changes to This Cookie Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, 
              legislation, or our practices.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">3. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions regarding this Cookie Policy, don't hesitate to get in touch with us through 
              the official contact channels on the MUI website.
            </p>
          </section>
        </div>

        {/* Cookie Consent Notice */}
        <div className="mt-12 bg-amber-900/20 border border-amber-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">Cookie Consent</h3>
          <p className="text-gray-300 leading-relaxed">
            By continuing to use the MUI Portal and website, you consent to our use of cookies as described 
            in this policy. You can withdraw or modify your consent at any time through your browser settings.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-amber-500 font-bold text-lg mb-2">Mic'd Up Initiative (MUI)</p>
          <p className="text-gray-400">Voices shape society. We are the mic.</p>
          
          <div className="mt-6 space-x-4">
            <Link href="/" className="text-amber-400 hover:text-amber-300 underline">
              Back to Home
            </Link>
            <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
