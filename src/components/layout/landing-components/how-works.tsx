import React from 'react'
import Link from 'next/link'

function HowWorks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Conectar con un profesional calificado nunca había sido tan fácil. Sigue estos simples pasos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Paso 1 */}
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-2xl font-bold mx-auto mb-4">
            1
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Unete a nuestra red</h3>
          <p className="text-gray-600">
            Ingresa a la plataforma y busca por el servicio que deseas.
          </p>
        </div>

        {/* Paso 2 */}
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-2xl font-bold mx-auto mb-4">
            2
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Compara Opciones</h3>
          <p className="text-gray-600">
            Revisa perfiles, calificaciones y elige el emprendedor que mejor se adapte a tu necesidad.
          </p>
        </div>

        {/* Paso 3 */}
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-2xl font-bold mx-auto mb-4">
            3
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Conecta</h3>
          <p className="text-gray-600">
            Conecta con el emprendedor y coordina los detalles del servicio a traves de nuestra plataforma.
          </p>
        </div>

        {/* Paso 4 */}
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-2xl font-bold mx-auto mb-4">
            4
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Califica el servicio</h3>
          <p className="text-gray-600">
            Da tu opinion respecto al servicio solicitado.
          </p>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          href="/register"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-center font-medium shadow-md transition-colors"
        >
          Comenzar Ahora
        </Link>
      </div>
    </div>
  )
}

export default HowWorks