'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/Access-denied/access-denied';
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar';
import RequestCard from '@/components/layout/Service-provider-components/Service-provider-home/service-provider-request-card';
import { serviceRequest } from '@/types';
import { set } from 'zod';
import { formatDate } from '../../../../../utils';
import AcceptRequestModal from '@/components/layout/Service-provider-components/service-provider-services-config/accept-request-modal';
import DeclineRequestModal from '@/components/layout/Service-provider-components/service-provider-services-config/decline-request-modal';

function Home() {
  const { status, data: session } = useSession();
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceRequests, setServiceRequests] = useState<serviceRequest[]>([]);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<serviceRequest | null>(null);
  const providerId = session?.user.id || '';
  console.log(session)

  const fetchServiceRequests = async () => {
    try {
      const response = await fetch(`/api/service-provider/service-requests/${providerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Error al obtener las solicitudes de servicio');
      }
      const data = await response.json();
      setServiceRequests(data);
      console.log('Datos de las solicitudes de servicio:', data);

    } catch (error) {

    }
  }

  const serviceTypes = useMemo(() => {
    if (serviceRequests.length === 0) return ['all'];
    return ['all', ...new Set(serviceRequests
      .map(request => request.service.title)
      .filter(Boolean))];
  }, [serviceRequests]);
  // Buscar en los campos relevantes
  const searchInRequest = (request: serviceRequest, query: string) => {
    const searchTerms = query.toLowerCase().trim();
    if (!searchTerms) return true;

    return (
      (request.user?.name?.toLowerCase() || '').includes(searchTerms) ||
      (request.user?.lastName?.toLowerCase() || '').includes(searchTerms) ||
      (request.service?.title?.toLowerCase() || '').includes(searchTerms) ||
      (request.message?.toLowerCase() || '').includes(searchTerms)
    );
  };

  // Filtrar las solicitudes según los filtros seleccionados y búsqueda
  const filteredRequests = useMemo(() => {
    return serviceRequests.filter(request => {
      // Filtro por búsqueda
      if (!searchInRequest(request, searchQuery)) return false;

      // Filtro por estado - CORREGIDO
      if (statusFilter !== 'all' && request.status !== statusFilter) return false;

      // Filtro por tipo de servicio
      if (serviceTypeFilter !== 'all' && request.service.title !== serviceTypeFilter) return false;

      return true;
    });
  }, [serviceRequests, searchQuery, statusFilter, serviceTypeFilter]);

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return <AccessDenied
      message="Esta área es solo para proveedores de servicios"
    />;
  }

  const onAccept = (request: serviceRequest) => {
    console.log('Solicitud aceptada de la request', request.id);
    setCurrentRequest(request);
    setShowAcceptModal(true);

  }

  const onDecline = (request: serviceRequest) => {
    console.log('Solicitud rechazada de la request', request.id);
    setCurrentRequest(request);
    setShowDeclineModal(true);
  }
  const handleConfirmDecline = async () => {
    if (!currentRequest) return;
    
    try {
      console.log('Rechazando solicitud:', currentRequest);
      const response = await fetch(`/api/service-provider/service-requests/decline-service-request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({requestId: currentRequest.id,})
      });
      
      if (!response.ok) {
        throw new Error('Error al rechazar la solicitud');
      }
      
      // Actualizar el estado local o recargar los datos
      fetchServiceRequests();
      
    } catch (error) {
      console.error('Error:', error);
      // Mostrar mensaje de error
    }
  };
  const handleConfirmAccept = async () => {
  if (!currentRequest) return;
  
  try {
    console.log('Aceptando solicitud:', currentRequest);
    const response = await fetch(`/api/service-provider/service-requests/accept-service-request`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({requestId: currentRequest.id,})
    });
    
    if (!response.ok) {
      throw new Error('Error al aceptar la solicitud');
    }
    
    // Actualizar el estado local o recargar los datos
    fetchServiceRequests();
    
  } catch (error) {
    console.error('Error:', error);
    // Mostrar mensaje de error
  }
};

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  return (
    <div className="flex h-screen">
      <ServiceProviderSidebar
        userName={session?.user.name || ''}
        userType={session?.user.role || ''}
        userLastName={session?.user.lastName || ''}
      />

      <div className="flex-1 p-8 overflow-y-auto px-4 md:px-10 lg:px-20 xl:px-40">
        <div className="mb-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md">
            <div className="mb-6">

              <div className='flex justify-between items-center mb-4'>
                <h2 className="text-xl font-semibold mb-4">Solicitudes Recientes</h2>
                <div className="flex flex-col md:flex-row md:justify-end gap-3">
                  {/* Filtro de estado - CORREGIDO */}
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="PENDING">Pendientes</option>
                      <option value="ACCEPTED">Aceptadas</option>
                      <option value="REJECTED">Rechazadas</option>
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
                    providerId={session?.user.id || ''}
                    key={index}
                    status={request.status}
                    requestId={request.id}
                    onAccept={() => onAccept(request)}
                    onDecline={() => onDecline(request)}
                    onCancel={() => console.log('Cancel request', request.id)}
                    onComplete={() => console.log('Completar solicitud', request.id)}
                    onStartProgress={() => {console.log('Iniciar progreso de la solicitud', request.id);}}
                    clientId={request.user.id}
                    clientName={`${request.user.name} ${request.user.lastName}` || 'test'}
                    serviceType={request.service.title}
                    description={request.message || request.service.description}
                    requestDate={request.createdAt}
                    isNew={new Date(request.createdAt) < new Date(Date.now() - 24 * 60 * 60 * 1000)} isPriority={request.status === 'URGENT'}

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
                Mostrando {filteredRequests.length} de {serviceRequests.length} solicitudes
              </div>
            )}
            {showAcceptModal && (
              <AcceptRequestModal 
              isOpen = {showAcceptModal}
              onClose ={() => setShowAcceptModal(false)}
              onConfirm={handleConfirmAccept}
              clientName={currentRequest?.user.name || ''}
              serviceType={currentRequest?.service.title || ''}
              />
            )}
            {showDeclineModal && (
              <DeclineRequestModal
              isOpen = {showDeclineModal}
              onClose = {() => setShowDeclineModal(false)}
              onConfirm = {handleConfirmDecline}
              clientName = {currentRequest?.user.name || ''}
              serviceType = {currentRequest?.service.title || ''}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;