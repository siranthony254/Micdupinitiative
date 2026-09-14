import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/writeClient'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type || undefined,
    })

    return NextResponse.json({ _id: asset._id, url: asset.url })
  } catch (err) {
    console.error('Asset upload error', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
