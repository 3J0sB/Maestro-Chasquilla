import React, { useEffect, useRef } from 'react';
// Eliminamos la importación de FiMapPin
// import { FiMapPin } from 'react-icons/fi';

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  requestCount: number;
}

interface CustomerMapProps {
  locations: Location[];
}

// Componente SVG para el pin de mapa
const MapPinIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5 text-orange-500" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
      clipRule="evenodd" 
    />
  </svg>
);

const CustomerMap: React.FC<CustomerMapProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Esta es una implementación simulada para el mapa
    // En una aplicación real, usarías una biblioteca como Google Maps o Mapbox
    
    if (mapRef.current) {
      // Simular la carga del mapa
      const mapElement = mapRef.current;
      mapElement.innerHTML = '';
      
      // Crear un elemento que simule un mapa
      const mapImg = document.createElement('div');
      mapImg.className = 'bg-blue-50 w-full h-full rounded-lg flex items-center justify-center';
      mapImg.innerHTML = `
        <div class="text-center p-4">
          <div class="text-blue-500 flex justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-700">Mapa de distribución de clientes</h3>
          <p class="mt-1 text-xs text-gray-500">Aquí se mostrará un mapa interactivo con la ubicación de tus clientes.</p>
          <p class="mt-3 text-xs text-gray-500">Total: ${locations.length} ubicaciones registradas</p>
        </div>
      `;
      
      mapElement.appendChild(mapImg);
    }
    
  }, [locations]);
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Distribución Geográfica
        </h2>
      </div>
      
      <div ref={mapRef} className="w-full h-64 rounded-lg overflow-hidden"></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
        {locations.slice(0, 6).map((location) => (
          <div key={location.id} className="flex items-center bg-gray-50 rounded-lg p-3">
            <div className="flex-shrink-0">
              <MapPinIcon />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-700">
                {location.city}
              </h3>
              <p className="text-xs text-gray-500">
                {location.requestCount} solicitudes
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {locations.length > 6 && (
        <div className="text-center mt-3">
          <button className="text-sm font-medium text-orange-600 hover:text-orange-700">
            Ver todas las ubicaciones
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerMap;