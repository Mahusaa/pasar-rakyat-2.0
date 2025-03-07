import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, signToken } from './server/auth/session';

const authRoutes = ['/dashboard', '/logs', '/analytics'];
const adminRoutes = ['/analytic'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const res = NextResponse.next();

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Handle unauthenticated requests
  if (!sessionCookie) {
    // If trying to access any protected route (auth or admin) without a session
    if (isAuthRoute || isAdminRoute) {
      const redirectUrl = new URL("/sign-in", request.url);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Public routes are accessible without session
    return res;
  }

  // Verify session token for authenticated requests
  try {
    const session = await verifyToken(sessionCookie.value);

    // Handle authenticated requests to auth routes
    if (isAuthRoute) {
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
      res.cookies.set({
        name: 'session',
        value: await signToken({ ...session, expires: expiresInOneDay.toISOString() }),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresInOneDay,
      });
      return res;
    }

    // Handle admin routes
    if (isAdminRoute) {
      if (session.user.role !== 'owner') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return res;
    }

    // Handle all other authenticated routes
    return res;
  } catch (error) {
    console.error('Session invalid:', error);
    res.cookies.delete('session');
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
