import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/workspace(.*)',
  '/admin(.*)'
]);

const ADMIN_WHITELIST = [
  'ravirajjavvadhi@gmail.com',
  'kevryntech@gmail.com'
];

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const email = (sessionClaims?.primary_email as string) || "";

  // 1. Admin Lockdown: Only whitelisted emails can access /admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!userId || !ADMIN_WHITELIST.includes(email.toLowerCase())) {
      const homeUrl = new URL('/', req.url);
      return Response.redirect(homeUrl);
    }
  }

  // 2. Dashboard Redirect: Logged in users on '/' go to '/workspace'
  if (userId && req.nextUrl.pathname === '/') {
    const workspaceUrl = new URL('/workspace', req.url);
    return Response.redirect(workspaceUrl);
  }

  // 3. Global Protection for /workspace and /admin (fallback)
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
