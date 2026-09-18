import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  // Hidden honeypot field - same convention as the site's other forms.
  // Real visitors never fill this in; bots that auto-fill every field do.
  if (typeof body?.company === 'string' && body.company.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  try {
    const existing = await writeClient.fetch<string | null>(
      `*[_type == "newsletterSubscriber" && email == $email][0]._id`,
      { email }
    )

    if (!existing) {
      await writeClient.create({
        _type: 'newsletterSubscriber',
        email,
        subscribedAt: new Date().toISOString(),
        source: 'footer',
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Newsletter subscribe error', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
