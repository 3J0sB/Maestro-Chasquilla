'use client'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function PublicHeader() {
  const router = useRouter()

  const handleLoginClick = () => {
    router.push('/login')
  }

  const handleRegisterClickUser = () => {
    router.push('/register')
  }
  const handleRegisterClickProvider = () => {
    router.push('/register-provider')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center h-auto md:h-16 gap-2 md:gap-0">
          {/* Logo y nombre */}
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/img/red_maestro_icon.png"
                width={32}
                height={32}
                alt="Maestro Chasquilla logo"
                className="rounded-full"
              />
              <h1 className="text-lg md:text-xl font-bold text-gray-800">
                RED <span className="text-orange-500">MAESTRO</span>
              </h1>
            </Link>
          </div>

          {/* Navegación central */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/#inicio" className="text-gray-600 cursor-pointer hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
              Inicio
            </Link>
            <Link href="//#servicios" className="text-gray-600 cursor-pointer hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
              Servicios
            </Link>
            <Link href="/#como-funciona" className="text-gray-600 cursor-pointer hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
              Cómo funciona
            </Link>

          </nav>

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <button
              onClick={handleLoginClick}
              className="text-orange-500 hover:text-orange-700 px-4 py-2 rounded-md text-sm font-medium transition-colors w-full md:w-auto"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={handleRegisterClickUser}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition-colors w-full md:w-auto"
            >
              Para consumidores
            </button>
            <button
              onClick={handleRegisterClickProvider}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition-colors w-full md:w-auto"
            >
              Para proveedores
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default PublicHeader