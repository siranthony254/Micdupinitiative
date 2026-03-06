// Test login without profile fetch to isolate the issue
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function testLogin() {
  try {
    console.log('Testing login...')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })

    if (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }

    console.log('Login successful:', data)
    
    // Test session
    const { data: session } = await supabase.auth.getSession()
    console.log('Current session:', session)

    // Test profile fetch
    if (session?.user) {
      console.log('Fetching profile for:', session.user.id)
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      console.log('Profile result:', { profile, profileError })
    }

    return { success: true, data }
  } catch (error) {
    console.error('Test login error:', error)
    return { success: false, error: error.message }
  }
}
