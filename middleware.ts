import { auth } from '@/lib/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const protectedPaths = ['/dashboard'];

  if (protectedPaths.some(p => pathname.startsWith(p)) && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl.origin));
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
