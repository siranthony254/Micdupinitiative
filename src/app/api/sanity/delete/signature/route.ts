import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

interface SignatureRequestBody {
  id: string
  type: string
  paths?: string[]
}

const createSigningString = ({id, type, paths, expiresAt}: {id: string; type: string; paths?: string[]; expiresAt: string}) =>
  `${id}|${type}|${JSON.stringify(paths || [])}|${expiresAt}`

export async function POST(request: Request) {
  try {
    const secret = process.env.SANITY_DELETE_SECRET
    if (!secret) {
      return NextResponse.json(
        { error: 'Signing is disabled because SANITY_DELETE_SECRET is not configured.' },
        { status: 500 },
      )
    }

    const body = (await request.json()) as SignatureRequestBody
    if (!body?.id || !body?.type) {
      return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    const signature = createHmac('sha256', secret)
      .update(createSigningString({ id: body.id, type: body.type, paths: body.paths, expiresAt }))
      .digest('hex')

    return NextResponse.json({ signature, expiresAt })
  } catch (err) {
    console.error('Delete signature error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
