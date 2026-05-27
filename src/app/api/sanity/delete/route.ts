import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createHmac, timingSafeEqual } from 'crypto'

interface DeleteRequestBody {
  id: string
  type: string
  paths?: string[]
  signature?: string
  expiresAt?: string
}

const createSigningString = ({id, type, paths, expiresAt}: {id: string; type: string; paths?: string[]; expiresAt: string}) =>
  `${id}|${type}|${JSON.stringify(paths || [])}|${expiresAt}`

const isSignatureValid = (body: DeleteRequestBody, secret: string) => {
  if (!body.signature || !body.expiresAt) return false

  const expectedSignature = createHmac('sha256', secret)
    .update(createSigningString({id: body.id, type: body.type, paths: body.paths, expiresAt: body.expiresAt}))
    .digest('hex')

  if (expectedSignature.length !== body.signature.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(expectedSignature, 'utf8'), Buffer.from(body.signature, 'utf8'))
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DeleteRequestBody
    const secret = process.env.SANITY_DELETE_SECRET
    const providedSecret = request.headers.get('x-site-delete-secret')

    if (secret) {
      const signatureValid = isSignatureValid(body, secret)
      if (!signatureValid && providedSecret !== secret) {
        console.warn('Unauthorized delete webhook call')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (signatureValid && body.expiresAt) {
        const expiry = Date.parse(body.expiresAt)
        if (Number.isNaN(expiry) || expiry < Date.now()) {
          console.warn('Expired delete signature')
          return NextResponse.json({ error: 'Expired signature' }, { status: 401 })
        }
      }
    }

    try {
      console.info('Sanity delete webhook payload:', JSON.stringify(body))
    } catch (e) {
      /* ignore stringify errors */
    }

    const paths: string[] = Array.isArray(body.paths) ? body.paths : []

    for (const p of paths) {
      try {
        await revalidatePath(p)
        console.info('Revalidated', p)
      } catch (err) {
        console.warn('Revalidate failed for', p, err)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Sanity delete webhook error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
