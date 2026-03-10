import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { name, description, secret_key } = await request.json()

    if (!name || !secret_key) {
      return NextResponse.json(
        { error: 'Name and secret key are required' },
        { status: 400 }
      )
    }

    // Check if secret key already exists
    const { data: existing } = await supabase
      .from('cohorts')
      .select('id')
      .eq('secret_key', secret_key)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Secret key already exists' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('cohorts')
      .insert({
        name,
        description: description || null,
        secret_key
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, cohort: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
