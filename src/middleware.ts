import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { publicRoutes, authRoutes } from "./routes";
import { NextResponse } from "next/server";

const { auth: middleware } = NextAuth(authConfig)

export default middleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.some(route =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith('/api/auth/')
  );

  console.log("isLoggedIn", isLoggedIn)
  console.log("isPublicRoute", isPublicRoute)
  console.log("isAuthRoute", isAuthRoute)

  // Handle auth routes (login, register, etc)
  if (isAuthRoute) {
    // If already logged in, redirect away from auth pages
    if (isLoggedIn) {
      console.log("[MIDDLEWARE]--> sending to /redirect")
      return NextResponse.redirect(new URL('/redirect', nextUrl));
    }
    // Otherwise, allow access to auth pages for non-logged in users
    console.log("[MIDDLEWARE]--> allowing access to auth page")
    return NextResponse.next();
  }

  // Handle public routes - allow access regardless of auth status
  if (isPublicRoute) {
    console.log("[MIDDLEWARE]--> allowing access to public route")
    return NextResponse.next();
  }

  // Handle protected routes - redirect to login if not logged in
  if (!isLoggedIn) {
    console.log("[MIDDLEWARE]--> sending to /login")
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // User is logged in accessing a protected route, allow access
  console.log("[MIDDLEWARE]--> allowing access to protected route")
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|img|icons|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}