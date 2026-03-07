"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function DataProtectionPolicy() {
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
          <h1 className="text-4xl font-bold mb-4">Data Protection Policy</h1>
          <p className="text-gray-400">Mic'd Up Initiative (MUI) – MUI Portal</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: {currentDate}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 prose prose-invert max-w-none">
          {/* Purpose Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">1. Purpose</h2>
            <p className="text-gray-300 leading-relaxed">
              Mic'd Up Initiative (MUI) is committed to protecting the personal data of all users who interact with the MUI Portal. 
              This Data Protection Policy outlines how personal information is collected, stored, processed, and protected within our platform.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Our goal is to ensure transparency, accountability, and responsible handling of participant data.
            </p>
          </section>

          {/* Scope Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">2. Scope</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              This policy applies to all individuals who interact with MUI Portal, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Campus Ambassadors</li>
              <li>Mentors</li>
              <li>Program Participants</li>
              <li>Portal Account Users</li>
              <li>Contributors and Administrators</li>
            </ul>
          </section>

          {/* Personal Data Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">3. Personal Data We Collect</h2>
            
            <div className="space-y-6">
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-amber-400 mb-3">Identity Information</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>University or institution</li>
                  <li>Profile information related to MUI participation</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-amber-400 mb-3">Program Participation Data</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Cohort enrollment</li>
                  <li>Course participation</li>
                  <li>Lesson progress</li>
                  <li>Completion records</li>
                  <li>Certification eligibility</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-amber-400 mb-3">Technical Information</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Login timestamps</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>IP address (for security monitoring)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Purpose of Processing Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">4. Purpose of Data Processing</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Personal data is collected for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Providing access to <strong>MUI Portal</strong></li>
              <li>Managing cohort programs and educational initiatives</li>
              <li>Tracking learning progress and engagement</li>
              <li>Issuing certificates upon completion of training programs</li>
              <li>Improving the effectiveness of MUI programs</li>
              <li>Ensuring platform security and integrity</li>
            </ul>
            <p className="text-amber-400 font-semibold mt-4">
              Personal data will <strong>only be used for legitimate program-related purposes</strong>.
            </p>
          </section>

          {/* Data Storage and Security Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">5. Data Storage and Security</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              MUI implements reasonable technical and administrative safeguards to protect personal data from:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Unauthorized access</li>
              <li>Data breaches</li>
              <li>Loss or misuse of information</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Access to sensitive information is restricted to authorized administrators who require it to operate the platform.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              All platform infrastructure is hosted using secure technologies designed to maintain high standards of data protection.
            </p>
          </section>

          {/* Data Retention Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">6. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              Participant data will be retained only for as long as necessary to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Maintain program records</li>
              <li>Provide certificates and verification</li>
              <li>Improve future initiatives</li>
              <li>Meet administrative requirements</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Users may request removal of their personal data when their participation with MUI ends.
            </p>
          </section>

          {/* User Rights Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">7. User Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Users of MUI Portal have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Request access to personal information stored about them</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of their account and associated information</li>
              <li>Ask questions about how their data is handled</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Requests can be submitted through official MUI contact channels.
            </p>
          </section>

          {/* Data Sharing Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">8. Data Sharing</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              MUI does <strong>not sell, trade, or distribute personal data</strong> to third parties.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Data may only be shared when necessary to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide essential platform services</li>
              <li>Process certificate payments</li>
              <li>Maintain technical infrastructure</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Any service providers involved are expected to follow appropriate data protection standards.
            </p>
          </section>

          {/* Responsible Use Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">9. Responsible Use of the Platform</h2>
            <p className="text-gray-300 leading-relaxed">
              All users of MUI Portal are expected to respect the privacy and data protection of other participants. 
              Unauthorized collection or misuse of personal information through the platform is strictly prohibited.
            </p>
          </section>

          {/* Policy Updates Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">10. Policy Updates</h2>
            <p className="text-gray-300 leading-relaxed">
              This Data Protection Policy may be updated periodically as the MUI platform evolves. 
              Any changes will be reflected on this page with an updated revision date.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">11. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              Questions regarding this policy or requests regarding personal data may be directed through the official 
              communication channels listed on the MUI website.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-amber-500 font-bold text-lg mb-2">Mic'd Up Initiative (MUI)</p>
          <p className="text-gray-400">Empowering voices. Building the next Responsible Cultural Influencers</p>
          
          <div className="mt-6 space-x-4">
            <Link href="/" className="text-amber-400 hover:text-amber-300 underline">
              Back to Home
            </Link>
            <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline">
              Privacy Policy
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
