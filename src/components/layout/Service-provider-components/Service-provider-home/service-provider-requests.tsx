import React from 'react'
import RequestCard from './service-provider-request-card'

function ServiceRequests() {
  // Datos de ejemplo - esto vendría de una API real
  const requests = [
    {
      id: '1',
      clientName: 'Ana María López',
      serviceType: 'Destapar tuberias',
      description: 'Necesito ayuda urgente con el desagüe de la cocina, no está drenando.',
      requestDate: '3 Mayo, 2025 - 14:30',
      isNew: true,
      isPriority: true
    },
    {
      id: '2',
      clientName: 'Carlos Méndez',
      serviceType: 'Plomería',
      description: 'Reparación de fuga en el baño principal, agua goteando.',
      requestDate: '3 Mayo, 2025 - 10:15',
      isNew: true,
      isPriority: false
    },
    {
      id: '3',
      clientName: 'María González',
      serviceType: 'Cañería',
      description: 'Instalación de grifo nuevo en la cocina.',
      requestDate: '5 Mayo, 2025 - 16:45',
      isNew: false,
      isPriority: false
    },
        {
      id: '4',
      clientName: 'María González',
      serviceType: 'Cañería',
      description: 'Instalación de grifo nuevo en la cocina.',
      requestDate: '5 Mayo, 2025 - 16:45',
      isNew: false,
      isPriority: false
    },
        {
      id: '5',
      clientName: 'María González',
      serviceType: 'Cañería',
      description: 'Instalación de grifo nuevo en la cocina.',
      requestDate: '5 Mayo, 2025 - 16:45',
      isNew: false,
      isPriority: false
    },
        {
      id: '6',
      clientName: 'María González',
      serviceType: 'Cañería',
      description: 'Instalación de grifo nuevo en la cocina.',
      requestDate: '5 Mayo, 2025 - 16:45',
      isNew: false,
      isPriority: false
    }
  ];


  const handleAccept = (id: string) => {
    console.log(`Accept request ${id}`);

  }

  const handleDecline = (id: string) => {
    console.log(`Decline request ${id}`);

  }

  const handleMessage = (id: string) => {
    console.log(`Message client for request ${id}`);
 
  }

  return (
    <div className='bg-gray-50 rounded-lg shadow p-6' >
      {/* Encabezado con título y controles */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <h1 className='text-xl font-bold text-gray-800'>Solicitudes recientes</h1>
        
        {/* Controles de búsqueda y filtros */}
        <div className='flex items-center gap-2 w-full md:w-auto'>
          <div className='relative flex-grow md:flex-grow-0 md:w-64'>
            <input 
              type="text" 
              placeholder="Buscar solicitudes..." 
              className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Botones de filtro */}
          <button className='p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          
          <button className='p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Lista de solicitudes */}
      <div className='space-y-4'>
        {requests.length > 0 ? (
          requests.map(request => (
            <RequestCard
              key={request.id}
              clientName={request.clientName}
              serviceType={request.serviceType}
              description={request.description}
              requestDate={request.requestDate}
              isNew={request.isNew}
              isPriority={request.isPriority}
              onAccept={() => handleAccept(request.id)}
              onDecline={() => handleDecline(request.id)}
              onMessage={() => handleMessage(request.id)}
            />
          ))
        ) : (
          <div className='text-center py-8'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className='mt-2 text-gray-500'>No tienes solicitudes recientes</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServiceRequests