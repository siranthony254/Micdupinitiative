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
            <h2 className="text-2xl font-bold text-amber-500 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-300 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. 
              They help websites remember information about your visit and improve user experience.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">2. How MUI Uses Cookies</h2>
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
            <h2 className="text-2xl font-bold text-amber-500 mb-4">3. Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-amber-400 mb-3">Essential Cookies</h3>
                <p className="text-gray-300 leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable core features 
                  such as authentication and security.
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-amber-400 mb-3">Analytics Cookies</h3>
                <p className="text-gray-300 leading-relaxed">
                  These help us understand how visitors use the website so we can improve content, design, 
                  and user experience.
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-amber-400 mb-3">Functional Cookies</h3>
                <p className="text-gray-300 leading-relaxed">
                  These allow the website to remember user preferences and improve usability.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">4. Managing Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              Most web browsers allow you to control or disable cookies through your browser settings. 
              However, disabling certain cookies may affect the functionality of some parts of the website.
            </p>
            
            <div className="mt-6 bg-black/30 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Browser Settings</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                You can typically manage cookie preferences through:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Browser settings menu</li>
                <li>Privacy or security settings</li>
                <li>Cookie preferences panel</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">5. Changes to This Cookie Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, 
              legislation, or our practices.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">6. Contact</h2>
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
