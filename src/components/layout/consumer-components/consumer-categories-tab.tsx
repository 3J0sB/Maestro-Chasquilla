/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/

'use client';
import React, { useState } from 'react';
import Link from 'next/link';


interface CategoryTabsProps {
  activeCategory?: string;
  handleCategory?: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory = 'all', handleCategory }) => {
  const [active, setActive] = useState('all');
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const categories = [
    {
      id: 'all',
      name: 'Todas',
      displayName: 'Todas',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'Hogar y mantenimiento',
      name: 'Test Tag1',
      displayName: 'Hogar y mantenimiento',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'Confección y moda',
      name: 'Moda',
      displayName: 'Confección y moda',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 'Automotrices',
      name: 'Automotrices',
      displayName: 'Automotrices',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'Creativos y personalizados',
      name: 'Creativos y personalizados',
      displayName: 'Creativos y personalizados',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      id: 'Alimentos y catering',
      name: 'Alimentos y catering',
      displayName: 'Alimentos y catering',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'Servicios personales y de bienestar',
      name: 'Servicios personales y de bienestar',
      displayName: 'Servicios personales y de bienestar',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'Educación y apoyo escolar',
      name: 'Educación',
      displayName: 'Educación y apoyo escolar',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
    {
      id: 'artesanias-y-productos-hechos-a-mano',
      name: 'Artesanías',
      displayName: 'Artesanías y productos hechos a mano',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      )
    },
    {
      id: 'servicios-tecnicos-y-digitales',
      name: 'Servicios técnicos',
      displayName: 'Servicios técnicos y digitales',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActive(categoryId);

    // Llama a la función handleCategory si está disponible
    if (handleCategory) {
      handleCategory(categoryId);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile: botón para mostrar categorías */}
      <div className="block sm:hidden px-2 mb-2">
        <button
          className="w-full p-2 bg-orange-500 text-white font-semibold py-2 rounded-lg shadow mb-2"
          onClick={() => setShowMobileCategories((prev) => !prev)}
        >
          {showMobileCategories ? 'Ocultar categorías' : 'Seleccionar categoría'}
        </button>
        {showMobileCategories && (
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  handleCategoryClick(category.id);
                  setShowMobileCategories(false);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition ${
                  active === category.id
                    ? 'bg-gray-50 border-orange-500 border'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div
                  className={`flex justify-center items-center w-10 h-10 rounded-full mb-1 ${
                    active === category.id
                      ? 'bg-orange-500'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className={`${active === category.id ? 'text-white' : 'text-gray-500'}`}>
                    {category.icon}
                  </div>
                </div>
                <span
                  className={`text-xs text-center line-clamp-2 ${
                    active === category.id ? 'text-orange-500 font-medium' : 'text-gray-600'
                  }`}
                >
                  {category.displayName || category.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Desktop: horizontal scroll */}
      <div className="hidden sm:block overflow-x-auto w-full">
        <div className="flex space-x-4 pb-2 pt-1 px-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center w-20 focus:outline-none"
            >
              <div
                className={`flex justify-center items-center w-14 h-14 rounded-full mb-1 ${
                  active === category.id
                    ? 'bg-orange-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className={`${active === category.id ? 'text-white' : 'text-gray-500'}`}>
                  {category.icon}
                </div>
              </div>
              <span
                className={`text-xs text-center line-clamp-2 ${
                  active === category.id ? 'text-orange-500 font-medium' : 'text-gray-600'
                }`}
              >
                {category.displayName || category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;