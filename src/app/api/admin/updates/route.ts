import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/writeClient'
import { validateUpdate } from '@/lib/admin-validation'
import { revalidateForDocument } from '@/lib/admin-revalidate'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const body = await request.json()
  const errors = validateUpdate(body)
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

  const doc = await writeClient.create({
    _type: 'update',
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

  revalidateForDocument('update', doc, ['/', '/updates'])

  return NextResponse.json(doc, { status: 201 })
}
