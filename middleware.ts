import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Paths that require authentication
    const isProtectedPath = path.startsWith('/dashboard') || path.startsWith('/day');
    const isAdminPath = path.startsWith('/admin');

    // Check for the session cookies
    const session = request.cookies.get('milano_session');
    const adminSession = request.cookies.get('milano_admin_session');

    if (isProtectedPath && !session) {
        // Redirect to landing page if not authenticated
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (isAdminPath && !adminSession) {
        // Redirect to landing page if not authenticated as admin
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow authenticated users to proceed or allow non-protected paths
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/day/:path*',
        '/admin/:path*',
    ],
};
