export const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/api/auth',
    '/favicon.ico',
    '/login',
    '/register'
  ];

export const protectedRoutes = [
    '/admin',
    '/admin/:path*',
    '/home',

]

export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/login',
    '/register'
  ];