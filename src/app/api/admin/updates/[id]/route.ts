import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/writeClient'
import { validateUpdate } from '@/lib/admin-validation'
import { revalidateForDocument } from '@/lib/admin-revalidate'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const { id } = await params
  const body = await request.json()
  const errors = validateUpdate(body)
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

  const doc = await writeClient
    .patch(id)
    .set({
      title: body.title,
      description: body.description,
      content: body.content,
      type: body.type,
      image: body.image ?? undefined,
      link: body.link || undefined,
      featured: !!body.featured,
      order: typeof body.order === 'number' ? body.order : 0,
      publishedAt: body.publishedAt || new Date().toISOString(),
      expiryDate: body.expiryDate || undefined,
      showInRail: !!body.showInRail,
      memoContent: body.memoContent ?? undefined,
      memoSender: body.memoSender || undefined,
      memoReference: body.memoReference || undefined,
    })
    .commit()

  revalidateForDocument('update', doc, ['/', '/conversations'])

  return NextResponse.json(doc)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const { id } = await params
  const doc = await writeClient.fetch(`*[_id == $id][0]`, { id })
  await writeClient.delete(id)

  if (doc) revalidateForDocument('update', doc, ['/', '/conversations'])

  return NextResponse.json({ ok: true })
}
