'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function PublicHeader() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png"
                width={40}
                height={40}
                alt='Maestro Chasquilla logo'
                className="rounded-full"
              />
              <h1 className="text-xl font-bold text-gray-800">
                RED <span className="text-orange-500">MAESTRO</span>
              </h1>
            </Link>
          </div>

          {/* Navegación central */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/#inicio" className="text-gray-600 cursor-pointer hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
              Inicio
            </Link>
            <Link href="/#servicios" className="text-gray-600 cursor-pointer hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
              Servicios
            </Link>
            <Link href="/#como-funciona" className="text-gray-600 cursor-pointer hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
              Cómo funciona
            </Link>

          </nav>

          {/* Botones de acción - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLoginClick}
              className="text-orange-500 cursor-pointer hover:text-orange-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={handleRegisterClickUser}
              className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
            >
              Para consumidores
            </button>
            <button
              onClick={handleRegisterClickProvider}
              className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
            >
              Para proveedores
            </button>
          </div>

          {/* Botón hamburguesa - Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-orange-500 p-2 rounded-md transition-colors"
              aria-label="Menú"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Navegación móvil */}
              <Link 
                href="/#inicio" 
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/#servicios" 
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link 
                href="/#como-funciona" 
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cómo funciona
              </Link>
              
              {/* Separador */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* Botones de acción móvil */}
              <div className="space-y-2 px-3">
                <button
                  onClick={() => {
                    handleLoginClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-orange-500 hover:text-orange-700 text-sm font-medium transition-colors border border-orange-500 rounded-md hover:bg-orange-50"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    handleRegisterClickUser()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium shadow-sm transition-colors rounded-md"
                >
                  Para consumidores
                </button>
                <button
                  onClick={() => {
                    handleRegisterClickProvider()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium shadow-sm transition-colors rounded-md"
                >
                  Para proveedores
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default PublicHeader