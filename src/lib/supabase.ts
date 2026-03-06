import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcxnjdiotipnfcssdpou.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeG5qZGlvdGlwbmZjc3NkcG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDE2NTgsImV4cCI6MjA4ODExNzY1OH0.Ex6L1y1qSW0M_HuaD9kowHXNNh_l2YxGFMiVaykUEQs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeG5qZGlvdGlwbmZjc3NkcG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0MTY1OCwiZXhwIjoyMDg4MTE3NjU4fQ.gMXWTwGdCKT6rZSS7GUGYfLJl1Qei4Swwg1PNcZi8kI'
)
