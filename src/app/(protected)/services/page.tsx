'use client';
import React from 'react';
import CategoryTabs from '@/components/layout/consumer-components/consumer-categories-tab';
import ConsumerHeader from '@/components/layout/consumer-components/consumer-header';
import LogoutButton from '@/components/logoutButton';
import SearchBar from '@/components/layout/consumer-components/consumer-searchbar';

function ServicesHome() {
  const handleSearch = (query: string) => {
    console.log('Búsqueda realizada:', query);
    // Aquí puedes implementar la lógica de búsqueda
  };

  return (
    <div>
      <ConsumerHeader />
      
      {/* Sección de búsqueda */}
      <div className="py-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      
      {/* Sección de categorías */}
      <div className='flex justify-center mt-4'>
        <div className="max-w-7xl mx-auto">
          <CategoryTabs />
        </div>
      </div>
      
    </div>
  )
}

export default ServicesHome;