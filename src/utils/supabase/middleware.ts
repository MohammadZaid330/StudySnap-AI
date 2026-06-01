import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured, MOCK_USER } from './mock'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  if (!isSupabaseConfigured()) {
    const hasSession = request.cookies.get('mock-user-session')?.value === 'true'
    const mockUserDataStr = request.cookies.get('mock-user-data')?.value
    let user = null
    if (hasSession) {
      try {
        user = mockUserDataStr ? JSON.parse(decodeURIComponent(mockUserDataStr)) : MOCK_USER
      } catch {
        user = MOCK_USER
      }
    }

    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

    if (!user && isDashboardPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (user && isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
      global: {
        fetch: (url, options) => {
          const controller = new AbortController()
          const id = setTimeout(() => controller.abort(), 2000) // 2 second timeout
          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => clearTimeout(id))
        }
      }
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user || null
  } catch (error) {
    console.error('Supabase updateSession: Failed to authenticate session (offline or network error):', error)
  }

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  if (!user && isDashboardPage) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    // user is logged in, redirect them away from auth pages
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}
