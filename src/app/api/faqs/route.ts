import { NextRequest, NextResponse } from 'next/server'
import { getFAQs } from '@/lib/faqs'

// GET /api/faqs - Get FAQs with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error } = await getFAQs({
      featured,
      category: category || undefined,
      limit,
      offset
    })

    if (error) {
      console.error('Error fetching FAQs:', error)
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
    console.error('FAQs API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
