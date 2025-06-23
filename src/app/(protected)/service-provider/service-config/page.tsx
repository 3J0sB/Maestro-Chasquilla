/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/

'use client'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar'
import React, { useState, useEffect, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import AccessDenied from '@/components/Access-denied/access-denied'
import AddServiceForm from '@/components/layout/Service-provider-components/service-provider-services-config/add-service-form'
import ServicesCard from '@/components/layout/Service-provider-components/service-provider-services-config/service-provider-services-card'

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
  image: string
}

function ServiceConfig() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isPending, startTransition] = useTransition()
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  const fetchServices = async (pageNumber = 1) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/service-provider/services/${session?.user.id}?page=${pageNumber}&limit=${pageSize}`);
        if (!response.ok) throw new Error('Error fetching services response == !ok');
        const data = await response.json();
        setServices(data.services);
        setTotalPages(Math.ceil(data.total / pageSize));
      } catch (error) {
        console.log('Error fetching services:', error);
      }
    });
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchServices(page);
    }
  }, [session?.user.id, page]);

  const onClose = () => {
    setShowForm(false)
    console.log('Modal closed')
  }
  const onSave = (serviceData: any) => {
    console.log('Service data saved:', serviceData)
    setShowForm(false)
    window.location.reload()
  }

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return <AccessDenied message="Esta no deberías estar aquí 🥸" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr ">

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:px-20 xl:px-40 overflow-y-auto">
        <div className="flex flex-col space-y-4 w-full max-w-6xl mx-auto">
          {/* Header and Add button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-orange-600">Mis Servicios</h1>
            <button
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow"
              onClick={() => setShowForm(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Agregar servicio
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Busca tus servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Loader */}
          {isPending && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                image={service.image}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex flex-wrap items-center gap-1 bg-white rounded-lg shadow px-2 py-2 border border-gray-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-2 md:px-3 py-1 rounded transition-colors font-medium text-sm md:text-base ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (num) =>
                    num === 1 ||
                    num === totalPages ||
                    (num >= page - 2 && num <= page + 2)
                )
                .map((num, idx, arr) => {
                  // Mostrar puntos suspensivos si hay saltos
                  if (
                    idx > 0 &&
                    num - arr[idx - 1] > 1
                  ) {
                    return (
                      <span key={`ellipsis-${num}`} className="px-2 text-gray-400 select-none">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`px-2 md:px-3 py-1 rounded font-medium transition-colors text-sm md:text-base ${
                        num === page
                          ? 'bg-orange-500 text-white border-2 border-orange-500'
                          : 'bg-white text-orange-500 border border-orange-200 hover:bg-orange-100'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-2 md:px-3 py-1 rounded transition-colors font-medium text-sm md:text-base ${
                  page === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                Siguiente
              </button>
            </nav>
          </div>

          {/* Empty state */}
          {!isPending && filteredServices.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 mb-2">Aún no tienes servicios</p>
              {searchQuery && (
                <p className="text-gray-400 text-sm">
                  No se encontraron resultados para &quot;<span className="font-semibold">{searchQuery}</span>&quot;
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
      </main>
      {showForm && (
        <AddServiceForm
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </div>
  )
}

export default ServiceConfig