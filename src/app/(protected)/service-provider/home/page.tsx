'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/Access-denied/access-denied';
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar';
import HomeCards from '@/components/layout/Service-provider-components/Service-provider-home/service-provider-home-cards';
import RequestCard from '@/components/layout/Service-provider-components/Service-provider-home/service-provider-request-card';

function Home() {
  const { status, data: session } = useSession();
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const requestsTestData = [
    {
      clientName: "Carlos Méndez",
      serviceType: "Plomería",
      description: "Reparación de fuga en el baño principal, agua goteando constantemente del lavamanos. Es urgente ya que está causando daños en el piso.",
      requestDate: "3 Mayo, 2025 - 10:15",
      isNew: true,
      isPriority: true,
      onAccept: () => console.log("Solicitud de Carlos aceptada"),
      onDecline: () => console.log("Solicitud de Carlos rechazada"),
      onMessage: () => console.log("Enviando mensaje a Carlos")
    },
    {
      clientName: "María González",
      serviceType: "Cañería",
      description: "Instalación de grifo nuevo en la cocina. El actual está oxidado y gotea.",
      requestDate: "5 Mayo, 2025 - 16:45",
      isNew: false,
      isPriority: false,
      clientAvatar: "",
      onAccept: () => console.log("Solicitud de María aceptada"),
      onDecline: () => console.log("Solicitud de María rechazada"),
      onMessage: () => console.log("Enviando mensaje a María")
    },
    {
      clientName: "Roberto Sánchez",
      serviceType: "Electricidad",
      description: "Problema con la instalación eléctrica, los interruptores saltan constantemente cuando enciendo más de dos aparatos. Necesito revisión urgente.",
      requestDate: "4 Mayo, 2025 - 09:30",
      isNew: true,
      isPriority: true,
      onAccept: () => console.log("Solicitud de Roberto aceptada"),
      onDecline: () => console.log("Solicitud de Roberto rechazada"),
      onMessage: () => console.log("Enviando mensaje a Roberto")
    },
    {
      clientName: "Ana López",
      serviceType: "Carpintería",
      description: "Reparación de puerta de armario que no cierra correctamente. La bisagra parece estar suelta.",
      requestDate: "6 Mayo, 2025 - 11:20",
      isNew: false,
      isPriority: false,
      onAccept: () => console.log("Solicitud de Ana aceptada"),
      onDecline: () => console.log("Solicitud de Ana rechazada"),
      onMessage: () => console.log("Enviando mensaje a Ana")
    },
    {
      clientName: "Juan Pérez",
      serviceType: "Plomería",
      description: "Cambio de grifería en baño principal. Los actuales están desgastados.",
      requestDate: "5 Mayo, 2025 - 14:30",
      isNew: true,
      isPriority: false,
      onAccept: () => console.log("Solicitud de Juan aceptada"),
      onDecline: () => console.log("Solicitud de Juan rechazada"),
      onMessage: () => console.log("Enviando mensaje a Juan")
    },
    {
      clientName: "Luisa Martínez",
      serviceType: "Electricidad",
      description: "Revisión de circuito eléctrico, algunas luces parpadean constantemente.",
      requestDate: "7 Mayo, 2025 - 09:45",
      isNew: false,
      isPriority: true,
      onAccept: () => console.log("Solicitud de Luisa aceptada"),
      onDecline: () => console.log("Solicitud de Luisa rechazada"),
      onMessage: () => console.log("Enviando mensaje a Luisa")
    }
  ];
  console.log(session)
  // Extraer todos los tipos de servicio únicos para el filtro
  const serviceTypes = ['all', ...new Set(requestsTestData.map(request => request.serviceType))];

  // Buscar en los campos relevantes
  const searchInRequest = (request: any, query: string) => {
    const searchTerms = query.toLowerCase().trim();
    if (!searchTerms) return true;

    return (
      request.clientName.toLowerCase().includes(searchTerms) ||
      request.serviceType.toLowerCase().includes(searchTerms) ||
      request.description.toLowerCase().includes(searchTerms)
    );
  };

  // Filtrar las solicitudes según los filtros seleccionados y búsqueda
  const filteredRequests = requestsTestData.filter(request => {
    // Filtro por búsqueda
    if (!searchInRequest(request, searchQuery)) return false;

    // Filtro por estado
    if (statusFilter === 'new' && !request.isNew) return false;
    if (statusFilter === 'priority' && !request.isPriority) return false;
    if (statusFilter === 'regular' && (request.isNew || request.isPriority)) return false;

    // Filtro por tipo de servicio
    if (serviceTypeFilter !== 'all' && request.serviceType !== serviceTypeFilter) return false;

    return true;
  });

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return <AccessDenied
      message="Esta área es solo para proveedores de servicios"
    />;
  }

  return (
    <div className="flex h-screen">
      <ServiceProviderSidebar
        userName={session?.user.name || ''}
        userType={session?.user.role || ''}
        userLastName={session?.user.lastName || ''}
      />

      <div className="flex-1 p-8 overflow-y-auto px-4 md:px-10 lg:px-20 xl:px-40">
        <h1 className="text-2xl font-bold mb-2">Panel de emprendedor</h1>
        <p className="mb-6">Bienvenido, {session?.user.name}!</p>

        <div className="mb-8">
          <HomeCards />
        </div>

        <div className="mb-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md">
            <div className="mb-6">

              <div className='flex justify-between items-center mb-4'>
                <h2 className="text-xl font-semibold mb-4">Solicitudes Recientes</h2>
                <div className="flex flex-col md:flex-row md:justify-end gap-3">
                  {/* Filtro de estado */}
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="new">Nuevas</option>
                      <option value="priority">Prioridad alta</option>
                      <option value="regular">Regulares</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>

                  {/* Filtro de tipo de servicio */}
                  <div className="relative">
                    <select
                      value={serviceTypeFilter}
                      onChange={(e) => setServiceTypeFilter(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="all">Todos los servicios</option>
                      {serviceTypes.filter(type => type !== 'all').map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Busca por cliente, tipo de servicio o descripción..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* Filtros */}

            </div>

            <div className="space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request, index) => (
                  <RequestCard
                    key={index}
                    clientName={request.clientName}
                    serviceType={request.serviceType}
                    description={request.description}
                    requestDate={request.requestDate}
                    isNew={request.isNew}
                    isPriority={request.isPriority}
                    clientAvatar={request.clientAvatar}
                    onAccept={request.onAccept}
                    onDecline={request.onDecline}
                    onMessage={request.onMessage}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2 text-gray-500">No hay solicitudes que coincidan con los criterios de búsqueda</p>
                </div>
              )}
            </div>

            {/* Contador de resultados */}
            {filteredRequests.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 text-right">
                Mostrando {filteredRequests.length} de {requestsTestData.length} solicitudes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;