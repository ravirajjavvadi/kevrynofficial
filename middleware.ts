import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/workspace(.*)',
  '/admin(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // 1. Global Protection for /workspace and /admin
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
