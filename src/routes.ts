export const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/api/auth',
    '/favicon.ico',
    '/services',
    '/services/:path*',
    /^\/services\/[^\/]+$/,
    '/register',
    '/auth/password-recovery',
    '/auth/verify',
  ];

export const protectedRoutes = [
    '/admin',
    '/admin/:path*',
    '/service-provider',
    '/service-provider/:path*',
    '/home',
    '/redirect',

]

export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/register',
    '/register-provider',
    '/login',
    '/password-recovery',
    '/password-recovery/reset',
    '/password-recovery/verify',
    '/auth/password-recovery',
    '/auth/verify',
  ];