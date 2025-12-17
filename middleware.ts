import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function
export function middleware(request: NextRequest) {
    const session = request.cookies.get('appwrite-session')?.value; // Get the value of the cookie
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/sign-in', '/sign-up'];
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // Test route - allow in development only
    if (pathname.startsWith('/test-session')) {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Redirect to sign-in if no session and trying to access protected route
    if (!session && !isPublicRoute) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
    }

    // Redirect to dashboard if has session and trying to access auth pages
    if (session && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Config for matcher
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - assets (public folder assets)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
    ],
};