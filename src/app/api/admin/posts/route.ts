import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/writeClient'
import { validatePost } from '@/lib/admin-validation'
import { revalidateForDocument } from '@/lib/admin-revalidate'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })

  const body = await request.json()
  const errors = validatePost(body)
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

  const doc = await writeClient.create({
    _type: 'post',
    title: body.title,
    slug: { _type: 'slug', current: body.slug },
    author: { _type: 'reference', _ref: body.authorId },
    mainImage: body.mainImage ?? undefined,
    categories: (body.categoryIds ?? []).map((id: string) => ({
      _type: 'reference',
      _ref: id,
      _key: id,
    })),
    publishedAt: body.publishedAt || new Date().toISOString(),
    body: body.body,
  })

  revalidateForDocument('post', doc, ['/blog'])

  return NextResponse.json(doc, { status: 201 })
}
