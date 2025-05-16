'use client'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar'
import React, { useState, useEffect, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import AccessDenied from '@/components/Access-denied/access-denied'
import Image from 'next/image'
import AddServiceForm from '@/components/layout/Service-provider-components/service-provider-services-config/add-service-form'
import ServicesCard from '@/components/layout/Service-provider-components/service-provider-services-config/service-provider-services-card'
import { set } from 'zod'

// Tipos para los servicios
type ServiceStatus = 'Active' | 'Inactive';

interface Service {
  id: string;
  title: string;
  price: number;
  minPriceService: number;
  maxPriceService: number;
  description: string;
  serviceTag: string;
  serviceTag2: string;
  serviceTag3: string;
  status: ServiceStatus;
  userId: string;
  icon: string;
}

function ServiceConfig() {
  const { status, data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null);
  // Datos de ejemplo para servicios


  const fetchServices = async () => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/service-provider/services/' + session?.user.id);

        if (!response.ok) {
          throw new Error('Error fetching services response == !ok');
        }

        const data = await response.json();
        setServices(data);
        console.log('Fetched services:', data);
      } catch (error) {
        console.log('Error fetching services:', error);
  
      }
    });
  };

  useEffect(() => {
    fetchServices();

  }, []);
  const onClose = () => {
    setShowForm(false)
    console.log('Modal closed')
  }
  const onSave = (serviceData: any) => {
    console.log('Service data saved:', serviceData)
    setShowForm(false)
    window.location.reload()
  }

  // Filtrar servicios según la búsqueda
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filteredServices)

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return <AccessDenied
      message="Esta no deberias estar aqui 🥸"
    />;
  }

  return (
    <div className='flex h-screen'>
      <ServiceProviderSidebar
        userName={session?.user.name || ''}
        userType={session?.user.role || ''}
        userLastName={session?.user.lastName || ''}
      />
      <div className='flex-1 p-8 overflow-y-auto px-4 md:px-10 lg:px-20 xl:px-40'>
        <div className='flex flex-col space-y-4 w-full'>
          {/* Encabezado y botón de agregar */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4'>
            <h1 className='text-2xl font-bold'>Mis Servicios</h1>
            <button className='flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors'
              onClick={() => setShowForm(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New Service
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className='relative w-full mb-6'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <svg className='w-5 h-5 text-gray-400' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Busca tus servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            />
          </div>
          {isPending && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}
          {/* Grid de servicios */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

            {/* Mapeo de servicios */}
            {filteredServices.map((service) => (
              <ServicesCard
                key={service.id}
                id={service.id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                price={service.price}
                status={service.status}
                serviceTag={service.serviceTag}
              />
            ))}
          </div>

          {/* Mensaje si no hay servicios */}
          {!isPending && filteredServices.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              
              <p className="text-gray-500 mb-2">Aun no tienes servicios</p>
              {searchQuery && (
                <p className="text-gray-400 text-sm">
                  No se encontraron resultados para "<span className="font-semibold">{searchQuery}</span>"
                </p>
              )}
              {!searchQuery && (
                <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Agrega tu primer servicio
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {
        showForm &&
        <AddServiceForm
          onClose={onClose}
          onSave={onSave}

        />
      }
    </div>
  )
}

export default ServiceConfig