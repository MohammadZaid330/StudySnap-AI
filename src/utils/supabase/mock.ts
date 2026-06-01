// Mock Supabase Client utility for local development when credentials are not configured

export const MOCK_USER = {
  id: "mock-user-id-12345",
  email: "student@university.edu",
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {
    full_name: "Demo Student",
    plan: "Pro Plan (Demo)",
    avatar_url: "",
  },
  aud: "authenticated",
  role: "authenticated",
}

// Helper to check if Supabase is properly configured in env variables
export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    url && 
    url !== 'your_supabase_url_here' && 
    url.startsWith('http') && 
    key && 
    key !== 'your_supabase_anon_key_here'
  )
}

// Client-side cookie utilities
export const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return null
}

export const setCookie = (name: string, val: string, days = 7) => {
  if (typeof document === 'undefined') return
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${val}; expires=${date.toUTCString()}; path=/`
}

export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export function createMockClient() {
  return {
    auth: {
      getUser: async () => {
        const hasSession = typeof document !== 'undefined' 
          ? getCookie('mock-user-session') === 'true'
          : false
        if (hasSession) {
          const userDataStr = getCookie('mock-user-data')
          let user = MOCK_USER
          if (userDataStr) {
            try {
              user = JSON.parse(decodeURIComponent(userDataStr))
            } catch {}
          }
          return { data: { user }, error: null }
        }
        return { data: { user: null }, error: null }
      },
      signUp: async ({ email, password, options }: any) => {
        const fullName = options?.data?.full_name || "Demo Student"
        const user = {
          ...MOCK_USER,
          email,
          user_metadata: {
            ...MOCK_USER.user_metadata,
            full_name: fullName,
          }
        }
        setCookie('mock-user-session', 'true')
        setCookie('mock-user-data', encodeURIComponent(JSON.stringify(user)))
        return { data: { user }, error: null }
      },
      signInWithPassword: async ({ email }: any) => {
        const user = { ...MOCK_USER, email }
        setCookie('mock-user-session', 'true')
        setCookie('mock-user-data', encodeURIComponent(JSON.stringify(user)))
        return { data: { user }, error: null }
      },
      signInWithOAuth: async () => {
        setCookie('mock-user-session', 'true')
        setCookie('mock-user-data', encodeURIComponent(JSON.stringify(MOCK_USER)))
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard'
        }
        return { data: {}, error: null }
      },
      signOut: async () => {
        deleteCookie('mock-user-session')
        deleteCookie('mock-user-data')
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
        return { error: null }
      },
      exchangeCodeForSession: async () => {
        return { data: {}, error: null }
      }
    }
  }
}
