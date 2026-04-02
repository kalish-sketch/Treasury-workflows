import { auth } from '@/lib/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/check-email', '/api/', '/backoffice'];

  if (publicPaths.some(p => pathname.startsWith(p))) {
    return; // Allow through
  }

  // Everything else requires login (including /, /dashboard)
  if (!isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl.origin));
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
