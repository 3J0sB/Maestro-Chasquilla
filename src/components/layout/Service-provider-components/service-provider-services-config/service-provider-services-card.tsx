import React, { useState } from 'react'
import Image from 'next/image'
import UpdateServiceForm from './upDate-service-form'
import DeleteServiceModal from './delete-service-modal';
import { useRouter } from 'next/navigation';

type service = {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: number;
  status: string;
  serviceTag: string;
  image?: string; // Imagen del servicio (opcional)
}

function ServicesCard({ id, title, status, description, price, serviceTag, image }: service) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    id: string;
    title: string;
    description: string;
    price: number;
    serviceTag?: string;
    image?: string;
  } | null>(null);

  const router = useRouter();
  const onDelete = () => {
    setShowDeleteModal(true);
  };

  const onUpdate = () => {
    const serviceData = {
      id: id,
      title: title,
      description: description,
      price: price,
      serviceTag: serviceTag,
      image: image
    };

    setSelectedService(serviceData);
    setShowUpdateForm(true);
  };

  const handleServiceUpdate = () => {
    setShowUpdateForm(false);
    window.location.reload();
  };

  const onView = () => {
    console.log('View service with id:', id);
    router.push(`/services/${id}`);
  }

  const handleDeleteConfirm = async () => {
    try {
      console.log('Deleting service with id:', id);
      
      // Make API call to delete the service
      const response = await fetch(`/api/service-provider/services/delete-service`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('Service deleted successfully');
      
      window.location.reload();
      
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete the service. Please try again.');
    }
  };

  return (
    <>
      <div key={id}
        className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden 
                hover:shadow-md transition-all duration-300 transform hover:-translate-y-1'>
        

          <div className="w-full h-48 relative overflow-hidden">
            <Image 
              src={image || 'https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png'} 
              alt={title} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {status}
              </span>
            </div>
          </div>


        <div className='p-6'>
          {/* Cabecera de la tarjeta */}
          <div className='flex justify-between items-start mb-4'>
            {/* Icono y título */}
            <div className='flex items-center gap-4'>
              <div>
                <h3 className='font-bold text-lg text-gray-800'>{title}</h3>
              </div>
            </div>
            {/* Etiqueta de servicio */}
            <div className={`px-2 py-1 text-sm font-semibold rounded-full text-green-600 bg-green-100 ${status === 'Inactive' ? 'opacity-60' : ''}`}>
              {serviceTag ? serviceTag : 'Sin etiqueta'}
            </div>
          </div>

          {/* Descripción */}
          <p className='text-gray-600 mb-4 line-clamp-3'>
            {description}
          </p>

          {/* Precio y duración */}
          <div className='flex justify-between items-center mb-4'>
            <div className='text-xl font-bold text-orange-500'>
              ${price.toFixed(2)}
            </div>
            {!image && ( // Solo mostrar el estado aquí si no hay imagen (ya que lo mostramos en la imagen)
              <div className='text-sm text-gray-500'>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  status === 'REJECTED' ? 'bg-red-100 text-red-800' : status === 'APPROVED' ? 'bg-green-100 text-green-800': 'bg-yellow-100 text-yellow-800'
                }`}>
                  {status}
                </span>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className='flex justify-between mt-4'>
            <button onClick={onView} className='p-2 cursor-pointer text-gray-500 hover:text-gray-700 rounded-md hover:bg-orange-100 transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button onClick={onUpdate} className='p-2 cursor-pointer text-gray-500 hover:text-gray-700 rounded-md hover:bg-orange-100 transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button onClick={onDelete} className='p-2 cursor-pointer text-gray-500 hover:text-gray-700 rounded-md hover:bg-orange-100 transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario de actualización */}
      {showUpdateForm && selectedService && (
        <UpdateServiceForm
          onClose={() => setShowUpdateForm(false)}
          onUpdate={handleServiceUpdate}
          serviceData={selectedService}
        />
      )}
      <DeleteServiceModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        serviceName={title}
      />
    </>
  )
}

export default ServicesCard