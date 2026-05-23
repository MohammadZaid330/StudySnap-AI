import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { isSupabaseConfigured, MOCK_USER } from './mock'

export async function createClient() {
  const cookieStore = await cookies()

  if (!isSupabaseConfigured()) {
    const hasSession = cookieStore.get('mock-user-session')?.value === 'true'
    const mockUserDataStr = cookieStore.get('mock-user-data')?.value
    let user = MOCK_USER
    if (mockUserDataStr) {
      try {
        user = JSON.parse(decodeURIComponent(mockUserDataStr))
      } catch {}
    }

    return {
      auth: {
        getUser: async () => {
          if (hasSession) {
            return { data: { user }, error: null }
          }
          return { data: { user: null }, error: null }
        },
        signOut: async () => {
          cookieStore.delete('mock-user-session')
          cookieStore.delete('mock-user-data')
          return { error: null }
        }
      }
    } as any
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
