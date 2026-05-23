import { createBrowserClient } from '@supabase/ssr'
import { isSupabaseConfigured, createMockClient } from './mock'

export function createClient() {
  if (!isSupabaseConfigured()) {
    return createMockClient() as any
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
