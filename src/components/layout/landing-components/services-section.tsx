import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ServicesSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Servicios</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Conecta con emprendedores que ofrezcan el servicio que estás buscando.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Servicio 1 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Image
                src={"icons/pipe-valve.svg"}
                width={20} height={20}
                alt="pipe-valve"
                className="h-5 w-5 ml-1"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Plomería</h3>
            <p className="text-gray-600 mb-4">
              Soluciona problemas de tuberías, grifos, inodoros y más con nuestros expertos en plomería.
            </p>
            <Link
              href=""
              className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
            >
              Ver más
              <Image
                src={"icons/pipe-valve.svg"}
                width={20} height={20}
                alt="pipe-valve"
                className="h-5 w-5 ml-1"
              />
            </Link>
          </div>
        </div>

        {/* Servicio 2 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Image
                src={"icons/electricity-outline.svg"}
                width={20} height={20}
                alt="pipe-valve"
                className="h-5 w-5 ml-1"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Electricidad</h3>
            <p className="text-gray-600 mb-4">
              Instalaciones eléctricas, reparaciones y mantenimiento.
            </p>
            <Link
              href="/servicios/electricidad"
              className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
            >
              Ver más
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Servicio 3 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Image
                src={"icons/hammer.svg"}
                width={30} height={30}
                alt="pipe-valve"
                className="h-6 w-6 ml-1"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Carpintería</h3>
            <p className="text-gray-600 mb-4">
              Reparación de muebles, instalación y proyectos personalizados.
            </p>
            <Link
              href="/servicios/carpinteria"
              className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
            >
              Ver más
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link
          href="/servicios"
          className="bg-white border border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 px-6 py-3 rounded-lg inline-block font-medium transition-colors"
        >
          Ver todos los servicios
        </Link>
      </div>
    </div>
  )
}

export default ServicesSection