import React from 'react'

type service = {
    id: string;
    icon: string;
    title: string;
    description: string;
    price: number;
    status: string
    serviceTag: string;
}


function ServicesCard({ id, icon, title, status, description, price, serviceTag }: service) {
  return (
      <div key={id}
                className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden 
              hover:shadow-md transition-all duration-300 transform hover:-translate-y-1'>
                <div className='p-6'>
                  {/* Cabecera de la tarjeta */}
                  <div className='flex justify-between items-start mb-4'>
                    {/* Icono y título */}
                    <div className='flex items-center gap-4'>
                      <div className={`w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-xl ${status === 'Inactive' ? 'opacity-60' : ''}`}>
                        {icon}
                      </div>
                      <div>
                        <h3 className='font-bold text-lg text-gray-800'>{title}</h3>
                      </div>
                    </div>
                    {/* Etiqueta de servicio */}
                    <div className={`px-2 py-1 text-sm font-semibold rounded-full text-green-600 bg-green-100 ${status === 'Inactive' ? 'opacity-60' : ''}`}>
                      {serviceTag? serviceTag : 'Sin etiqueta'}
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className='text-gray-600 mb-4'>
                    {description}
                  </p>

                  {/* Precio y duración */}
                  <div className='flex justify-between items-center mb-4'>
                    <div className='text-xl font-bold text-orange-500'>
                      ${price.toFixed(2)}
                    </div>
                    <div className='text-sm text-gray-500'>

                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className='flex justify-between mt-4'>
                    <button className='p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button className='p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className='p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100 transition-colors'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
  )
}

export default ServicesCard