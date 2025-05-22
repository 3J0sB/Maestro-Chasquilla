import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { service } from '@/types';

interface ServiceCardProps {
  service: service;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  // Determinar la imagen a mostrar
  const imageUrl = service.image || '/img/miau.jpg';

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      {/* Sección de imagen */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={service.title || 'Imagen de servicio'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
          // Manejo de errores de imagen
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Evita bucle infinito
            target.src = '/img/miau.jpg'; // Imagen de respaldo si falla la carga
          }}
        />
        {/* Badge para mostrar estado o etiqueta destacada */}
        {service.serviceTag && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            {service.serviceTag}
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        {/* Título */}
        <h3 className="text-lg font-semibold mb-1 text-gray-800 truncate">
          {service.title || 'Sin título'}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {service.description || 'Sin descripción disponible'}
        </p>

        {/* Información del proveedor si está disponible */}
        {service.user && (
          <div className="flex items-center mb-3">
            <div className="relative h-6 w-6 rounded-full overflow-hidden">
              <Image
                src={service.user.image || '/img/miau.jpg'}
                alt={service.user.name || 'Proveedor'}
                fill
                className="object-cover"
              />
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {service.user.name}
            </span>
          </div>
        )}

        {/* Precio y botón de acción */}
        <div className="flex justify-between items-center mt-2">
          <div className="font-medium text-orange-500">
            <span className='text-black'>Desde </span> 
            {service.price 
              ? `$${service.price}` 
              : 'Precio a consultar'
            }
          </div>
          <Link 
            href={`/services/${service.id}`} 
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1 rounded-full transition-colors"
          >
            Ver detalles
          </Link>
        </div>

        {/* Tags adicionales */}
        {(service.serviceTag2 || service.serviceTag3) && (
          <div className="flex flex-wrap gap-1 mt-3">
            {service.serviceTag2 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                {service.serviceTag2}
              </span>
            )}
            {service.serviceTag3 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                {service.serviceTag3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;