import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { publicRoutes, authRoutes, protectedRoutes } from "./routes";
import { NextResponse } from "next/server";


const { auth: middleware } = NextAuth(authConfig)


export default middleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // console.log("session from middleware", {
  //   user: req.auth?.user,
  //   id: req.auth?.user?.id,
  //   role: req.auth?.user?.role,
  //   expires: req.auth?.expires
  // });
  
  const isPublicRoute = publicRoutes.some(route =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith('/api/auth/')
  );

  console.log("isPublicRoute", isPublicRoute)

  const isAuthRoute = authRoutes.some(route =>
    nextUrl.pathname === route
  );

  // if route is api auth or public, do nothing
  if (isAuthRoute || isPublicRoute) {
    console.log("[MIDDLEWARE]--> do nothing 1")
    return NextResponse.next();
  }
  if (isAuthRoute) {
    // if is already loged in, send it directly to /landing page
    if (isLoggedIn) {
      console.log("[MIDDLEWARE]--> sending to /home")
      return NextResponse.redirect(new URL('/home', nextUrl));
    }
    // else, do nothing, let the user fill in the login form
    console.log("[MIDDLEWARE]--> do nothin 2")
    return NextResponse.next();
  }


  // if user is not logged in and route is not public, send him to /login page
  if (!isLoggedIn && !isPublicRoute) {
    console.log("[MIDDLEWARE]--> sending to /login")
    return NextResponse.redirect(new URL('/login', nextUrl));
  }
  // any other case, do nothing
  console.log("[MIDDLEWARE]--> do nothin 3")
  return NextResponse.next();
});

export const config = {


  matcher: [
    '/((?!api|_next/static|_next/image|img|icons|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}