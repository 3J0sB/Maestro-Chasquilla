'use client';
import React from 'react';
import CategoryTabs from '@/components/layout/consumer-components/consumer-categories-tab';
import ConsumerHeader from '@/components/layout/consumer-components/consumer-header';
import SearchBar from '@/components/layout/consumer-components/consumer-searchbar';
import { useState, useEffect, useMemo } from 'react';
import { service } from '@/types';
import ServiceCard from '@/components/layout/consumer-components/consumer-service-cards';
import { useRouter } from 'next/navigation';
function ServicesHome() {
  const [category, setCategory] = useState<string>('all');
  const [services, setServices] = useState<service[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  
  const handleSearch = (query: string) => {
    console.log('Búsqueda realizada:', query);
    setSearchQuery(query);
  };

  const handleCategory = (category: string) => {
    if (category === 'Todas') {
      setCategory('all');
      return
    }
    setCategory(category);
    console.log('Categoría seleccionada:', category);

  }
  const handleClickService = (serviceId: string) => {
    console.log('Servicio seleccionado:', serviceId);
    router.push(`/services/${serviceId}`);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/consumer/services?category=${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Error al obtener los servicios');
      }
      const data = await response.json();
      setServices(data);
      setLoading(false);
      console.log('Datos de los servicios:', data);

    } catch (error) {
      console.error('Error fetching services:', error);

    }
  }

  useEffect(() => {
    fetchServices();
  }, [category])

  const searchInService = (service: service, query: string) => {
    const searchTerms = query.toLowerCase().trim();
    if (!searchTerms) return true;

    return (
      (service.title?.toLowerCase() || '').includes(searchTerms) ||
      (service.description?.toLowerCase() || '').includes(searchTerms)


    );
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Filtro por búsqueda
      if (!searchInService(service, searchQuery)) return false;

      // Filtro por categoría - solo si no es 'all'
      if (category !== 'all' && service.serviceTag !== category) return false;

      return true;
    });
  }, [services, searchQuery, category]);
  return (
    <div className='bg-gray-50 min-h-screen'>
      <ConsumerHeader />

      {/* Sección de búsqueda */}
      <div className="py-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Sección de categorías */}
      <div className='flex justify-center mt-4 mb-4'>
        <div className="max-w-7xl mx-auto">
          <CategoryTabs
            handleCategory={handleCategory}
          />
        </div>
      </div>

      {/* Spinner de carga centralizado */}
      {loading && (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
            <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-orange-500 border-t-transparent"></div>
          </div>
        </div>
      )}

      {/* Grid de servicios - solo visible cuando no está cargando */}
      {!loading && (
        <div className="flex justify-center mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full px-4">
            {filteredServices.length > 0 &&
              filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => handleClickService(service.id)}
                />
              ))
            }
          </div>
        </div>
      )}

      {/* Mensaje de "No se encontraron servicios" */}
      <div>
        <div className='max-w-3xl mx-auto mt-8'>
          {filteredServices.length === 0 && !loading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No se encontraron servicios
              </h2>
              <p className="text-gray-600 mb-6">
                Intenta con otra búsqueda o selecciona otra categoría.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServicesHome;