import { createClient } from '@supabase/supabase-js'
import { useAuthUser } from 'src/composables/useAuthUser'

const supabaseUrl = 'https://scvatuxfijoufqqshrxj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjdmF0dXhmaWpvdWZxcXNocnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk1OTgzMDEsImV4cCI6MTk2NTE3NDMwMX0.0k4Kfo-uIPevBJf4e0Q0plYIT7YI5cGhy9O0NCcc_dE'

const supabase = createClient(supabaseUrl, supabaseKey)
supabase.auth.onAuthStateChange((event, session) => {
  const { user } = useAuthUser()
  user.value = session?.user || null
})

export function useSupabase () {
  return supabase
}
