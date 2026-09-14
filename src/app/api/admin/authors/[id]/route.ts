import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/writeClient'
import { validateAuthor } from '@/lib/admin-validation'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const { id } = await params
  const body = await request.json()
  const errors = validateAuthor(body)
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

  const doc = await writeClient
    .patch(id)
    .set({
      name: body.name,
      slug: { _type: 'slug', current: body.slug },
      image: body.image ?? undefined,
      bio: body.bio ?? [],
    })
    .commit()

  return NextResponse.json(doc)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const { id } = await params
  await writeClient.delete(id)

  return NextResponse.json({ ok: true })
}
