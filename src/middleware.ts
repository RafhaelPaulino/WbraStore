import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public routes
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth')

  // Admin routes
  const isAdminRoute = pathname.startsWith('/admin')

  // Auth routes (login, register)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Protect cart and checkout routes
  if ((pathname.startsWith('/cart') || pathname.startsWith('/checkout')) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
