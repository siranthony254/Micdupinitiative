import { NextRequest, NextResponse } from 'next/server'
import { getUpdates } from '@/lib/updates'

// GET /api/updates - Get updates with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error } = await getUpdates({
      featured,
      type: type || undefined,
      limit,
      offset
    })

    if (error) {
      console.error('Error fetching updates:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        limit,
        offset,
        total: data?.length || 0
      }
    })
  } catch (error) {
    console.error('Updates API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
