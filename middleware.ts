// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const adminRoute = '/Admin';
  const authRoute = '/Admin/auth';

  if (req.nextUrl.pathname.startsWith(adminRoute)) {
    const isLoggedIn = req.cookies.get('pb_auth'); // Check if the authentication cookie exists

    if (!isLoggedIn && req.nextUrl.pathname !== authRoute) {
      const url = req.nextUrl.clone();
      url.pathname = authRoute;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/Admin/:path*',
};
