import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/writeClient'
import { validateAuthor } from '@/lib/admin-validation'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const body = await request.json()
  const errors = validateAuthor(body)
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

  const doc = await writeClient.create({
    _type: 'author',
    name: body.name,
    slug: { _type: 'slug', current: body.slug },
    image: body.image ?? undefined,
    bio: body.bio ?? [],
  })

  return NextResponse.json(doc, { status: 201 })
}
