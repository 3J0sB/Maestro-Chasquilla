export const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/api/auth',
    '/favicon.ico',
    '/services',
    '/services/:path*',
    '/register'
  ];

export const protectedRoutes = [
    '/admin',
    '/admin/:path*',
    '/home',
    '/redirect',

]

export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/register',
    '/register-provider',
    '/login',
  ];