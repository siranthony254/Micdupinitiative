"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Mic'd Up Initiative (MUI)</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: {currentDate}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 prose prose-invert max-w-none">
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Mic'd Up Initiative ("MUI", "we", "our", or "us") is committed to protecting the privacy of our users, participants, and visitors. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or access the MUI Portal.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              By using our website and services, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              When you register for programs, apply to be a campus ambassador, or create a portal account, we may collect:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>University or institution</li>
              <li>Phone number (optional)</li>
              <li>Profile information related to cohorts or programs</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">Usage Information</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may automatically collect certain data when you interact with the site, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Browser type</li>
              <li>Device information</li>
              <li>Pages visited</li>
              <li>Time spent on pages</li>
              <li>IP address</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              This information helps us improve the experience and functionality of our platform.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide access to the MUI Portal</li>
              <li>Manage cohort programs and training sessions</li>
              <li>Track learning progress and participation</li>
              <li>Improve our website and learning platform</li>
              <li>Communicate program updates and opportunities</li>
              <li>Issue certificates of completion</li>
              <li>Maintain platform security</li>
            </ul>
            <p className="text-amber-400 font-semibold mt-4">
              We do not sell personal data to third parties.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">4. Data Storage and Protection</h2>
            <p className="text-gray-300 leading-relaxed">
              We take appropriate technical and organizational measures to protect user data from unauthorized access, 
              alteration, or disclosure.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              User data may be stored securely through trusted infrastructure providers used to operate the MUI Portal.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our platform may use trusted third-party services to operate effectively, including tools for:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Authentication</li>
              <li>Analytics</li>
              <li>Hosting infrastructure</li>
              <li>Payment processing (for certificate issuance)</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              These providers only process data necessary to perform their services.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our website may use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Improve site performance</li>
              <li>Understand visitor behavior</li>
              <li>Remember login sessions</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              For more details, please review our <Link href="/cookie-policy" className="text-amber-400 hover:text-amber-300 underline">Cookie Policy</Link>.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">7. User Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Users may request to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Access their personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of their data</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Requests can be submitted through our contact channels.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              The MUI platform is designed primarily for university and college participants. 
              We do not knowingly collect personal information from individuals under the age of 16.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">9. Updates to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy periodically. Any changes will be reflected on this page 
              with an updated revision date.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">10. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, you may contact us through the official 
              communication channels listed on the MUI website.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-amber-500 font-bold text-lg mb-2">Mic'd Up Initiative (MUI)</p>
          <p className="text-gray-400">Empowering voices. Shaping society.</p>
          
          <div className="mt-6 space-x-4">
            <Link href="/" className="text-amber-400 hover:text-amber-300 underline">
              Back to Home
            </Link>
            <Link href="/cookie-policy" className="text-amber-400 hover:text-amber-300 underline">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
