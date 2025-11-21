import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/practice", "/progress", "/profile", "/add-word"];

// Routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Since we're using localStorage via redux-persist, we can't check auth in middleware
  // Middleware runs on the server and can't access localStorage
  // Instead, we'll let the AuthProvider handle redirects on the client side
  // This middleware will just pass through all requests

  return NextResponse.next();
}

// Export the middleware function as 'proxy' for Next.js 16
export { middleware as proxy };

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
