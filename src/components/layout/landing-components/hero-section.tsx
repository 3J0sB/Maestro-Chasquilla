import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Encuentra al <span className="text-orange-500">maestro</span> perfecto 
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Conectamos a personas que necesitan servicios para el hogar con personas que los ofrecen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-center font-medium shadow-md transition-colors"
              >
                Registrarme Ahora
              </Link>
              <Link 
                href="#como-funciona" 
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg text-center font-medium transition-colors"
              >
                Cómo Funciona
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image 
              src="https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png" 
              width={500} 
              height={400} 
              alt="Maestro Chasquilla Hero" 
              className="object-contain"
              priority
            />
          </div>
        </div>
  )
}

export default HeroSection