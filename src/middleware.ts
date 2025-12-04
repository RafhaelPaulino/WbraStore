import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session token from cookies
  const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                       request.cookies.get('__Secure-next-auth.session-token')?.value

  const isLoggedIn = !!sessionToken

  // Admin routes protection (basic - will be enhanced with role check in layout)
  if (pathname.startsWith('/admin') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from auth pages
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Protect cart and checkout routes
  if ((pathname.startsWith('/cart') || pathname.startsWith('/checkout')) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
