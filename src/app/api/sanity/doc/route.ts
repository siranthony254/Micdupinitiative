import { NextResponse } from 'next/server'
import { client } from '../../../../sanity/lib/client'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const type = url.searchParams.get('type')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const query = type
      ? '*[_type == $type && (_id == $id || _id == "drafts." + $id)][0]'
      : '*[_id == $id || _id == "drafts." + $id][0]'

    const doc = await client.fetch(query, { id, type })

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json(doc)
  } catch (err) {
    console.error('Sanity doc lookup error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
