'use client';
import React from 'react';
import CategoryTabs from '@/components/layout/consumer-components/consumer-categories-tab';
import ConsumerHeader from '@/components/layout/consumer-components/consumer-header';
import SearchBar from '@/components/layout/consumer-components/consumer-searchbar';
import { useState, useEffect, useMemo } from 'react';
import { service } from '@/types';
import { set } from 'zod';
import ServiceCard from '@/components/layout/consumer-components/consumer-service-cards';
function ServicesHome() {
  const [category, setCategory] = useState<string>('all');
  const [services, setServices] = useState<service[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');


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

  const fetchServices = async () => {
    try {
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
      console.log('Datos de los servicios:', data);

    } catch (error) {

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
      <div className="flex justify-center mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full px-4">
          {filteredServices.length > 0 &&
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => console.log(`Servicio seleccionado: ${service.id}`)}
              />
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default ServicesHome;