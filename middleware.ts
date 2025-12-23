import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth data from cookies or check if user is authenticated
    // Since we're using localStorage, we'll handle this client-side
    // This middleware will just handle basic route structure

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/'];

    // Check if current path is public
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Allow public routes
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // For protected routes, we'll handle auth check client-side
    // since we're using localStorage for token storage
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
