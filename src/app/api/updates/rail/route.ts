import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

// GET /api/updates/rail - Get updates for the news rail
export async function GET() {
  try {
    const updates = await client.fetch(`
      *[_type == "update" && showInRail == true && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) {
        _id,
        _type,
        title,
        description,
        content,
        type,
        image,
        link,
        featured,
        order,
        publishedAt,
        expiryDate,
        showInRail,
        memoContent,
        memoSender,
        memoReference
      }
    `)

    return NextResponse.json({
      updates: updates || []
    })
  } catch (error) {
    console.error('Rail updates API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
