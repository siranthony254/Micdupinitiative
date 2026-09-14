import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/writeClient'
import { validatePost } from '@/lib/admin-validation'
import { revalidateForDocument } from '@/lib/admin-revalidate'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const { id } = await params
  const body = await request.json()
  const errors = validatePost(body)
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

  const doc = await writeClient
    .patch(id)
    .set({
      title: body.title,
      slug: { _type: 'slug', current: body.slug },
      author: { _type: 'reference', _ref: body.authorId },
      mainImage: body.mainImage ?? undefined,
      categories: (body.categoryIds ?? []).map((catId: string) => ({
        _type: 'reference',
        _ref: catId,
        _key: catId,
      })),
      publishedAt: body.publishedAt || new Date().toISOString(),
      body: body.body,
    })
    .commit()

  revalidateForDocument('post', doc, ['/blog'])

  return NextResponse.json(doc)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const { id } = await params
  const doc = await writeClient.fetch(`*[_id == $id][0]`, { id })
  await writeClient.delete(id)

  if (doc) revalidateForDocument('post', doc, ['/blog'])

  return NextResponse.json({ ok: true })
}
