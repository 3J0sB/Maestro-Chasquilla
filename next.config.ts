import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // Habilitar orígenes para imágenes
  images: {
    domains: ['localhost', 'z9lmh397-3000.brs.devtunnels.ms', '192.168.1.88', 'res.cloudinary.com'],
  },
  // Soporte para acciones del servidor
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.devtunnels.ms', '192.168.1.88:3000', '*'],
    },
  },
  // IMPORTANTE: Descomenta y usa esta configuración para CORS
  async headers() {
    return [
      {
        // Aplica a todas las rutas API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;