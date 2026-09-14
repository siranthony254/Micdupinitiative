import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/writeClient'
import { validateCategory } from '@/lib/admin-validation'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const body = await request.json()
  const errors = validateCategory(body)
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

  const doc = await writeClient.create({
    _type: 'category',
    title: body.title,
    slug: { _type: 'slug', current: body.slug },
    description: body.description || '',
  })

  return NextResponse.json(doc, { status: 201 })
}
