import { NextResponse } from 'next/server'
import { getBlogCategories } from '@/lib/blog'

// GET /api/blog/categories - Get all blog categories
export async function GET() {
  try {
    const { data, error } = await getBlogCategories()

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: data || []
    })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
