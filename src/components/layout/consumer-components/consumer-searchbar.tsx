'use client';

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

function SearchBar({ onSearch, placeholder = "Buscar servicios, profesionales..." }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Icono de búsqueda */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-400" 
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
          
          {/* Campo de entrada */}
          <input
            type="text"
            value={query}
            onChange={handleChange}
            className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-full shadow-sm focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-sm"
            placeholder={placeholder}
          />
          
          {/* Botón de búsqueda */}
          <div className="absolute inset-y-0 right-1 flex items-center">
            <button 
              type="submit"
              className="inline-flex items-center px-4 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;