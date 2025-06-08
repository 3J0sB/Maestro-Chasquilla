import React from 'react';
// Eliminamos la importación de react-icons
// import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

interface TopServicesProps {
  services: {
    id: string;
    title: string;
    requestCount: number;
    rating: number;
    trend: number; // porcentaje de cambio (positivo o negativo)
  }[];
}

const TopServices: React.FC<TopServicesProps> = ({ services }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Servicios Más Solicitados
        </h2>
      </div>
      
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {services.map((service) => (
            <li key={service.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {service.title}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(service.rating) 
                              ? 'text-yellow-400' 
                              : 'text-gray-200'
                          }`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {service.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {service.requestCount} solicitudes
                  </span>
                  
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {services.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-500">
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>
  );
};

export default TopServices;