'use client';

import { Session } from 'next-auth';
import AdminLayout from './admin-layout';
import React, { useState } from 'react';

// Tipos para los servicios
interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  provider: {
    id: string;
    name: string;
    lastName: string;
    email: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

function AdminServicesModeration({ session }: { session: Session | null }) {
  // Estado para los servicios
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Reparación de Cañerias',
      description: 'Servicio de reparación e instalación de cañerias para todo tipo de viviendas.',
      price: '$30.000 - $150.000',
      category: 'Plomería',
      provider: {
        id: '101',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
      },
      status: 'PENDING',
      createdAt: '2025-06-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Instalación Eléctrica',
      description: 'Instalaciones eléctricas profesionales, reparación y mantenimiento de sistemas eléctricos.',
      price: '$45.000 - $200.000',
      category: 'Electricidad',
      provider: {
        id: '102',
        name: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@example.com',
      },
      status: 'PENDING',
      createdAt: '2025-06-14T15:45:00Z',
    },
    {
      id: '3',
      name: 'Pintura de Interiores',
      description: 'Servicio de pintura de interiores con acabados profesionales y materiales de alta calidad.',
      price: '$25.000 - $100.000',
      category: 'Pintura',
      provider: {
        id: '103',
        name: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@example.com',
      },
      status: 'PENDING',
      createdAt: '2025-06-13T09:15:00Z',
    },
  ]);

  // Estado para el servicio seleccionado en el modal
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Función para aprobar un servicio
  const approveService = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, status: 'APPROVED' } : service
    ));
    if (selectedService?.id === id) {
      setSelectedService({ ...selectedService, status: 'APPROVED' });
    }
  };

  // Función para rechazar un servicio
  const rejectService = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, status: 'REJECTED' } : service
    ));
    if (selectedService?.id === id) {
      setSelectedService({ ...selectedService, status: 'REJECTED' });
    }
  };

  // Función para abrir el modal con los detalles del servicio
  const openServiceDetails = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <AdminLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Moderación de Servicios</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Servicios pendientes de aprobación</h2>
            <div className="flex space-x-2">
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobados</option>
                <option value="rejected">Rechazados</option>
              </select>
              <input 
                type="text" 
                placeholder="Buscar servicio..." 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.provider.name} {service.provider.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(service.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${service.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                          service.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {service.status === 'APPROVED' ? 'Aprobado' : 
                         service.status === 'REJECTED' ? 'Rechazado' : 
                         'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => openServiceDetails(service)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Ver
                      </button>
                      {service.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => approveService(service.id)}
                            className="text-green-600 hover:text-green-800 mr-3"
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => rejectService(service.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{services.length}</span> servicios
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Anterior</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Siguiente</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles de servicio */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Detalles del Servicio</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nombre del Servicio</h4>
                  <p className="text-base text-gray-900">{selectedService.name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
                  <p className="text-base text-gray-900">{selectedService.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Categoría</h4>
                    <p className="text-base text-gray-900">{selectedService.category}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Precio estimado</h4>
                    <p className="text-base text-gray-900">{selectedService.price}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Proveedor</h4>
                  <p className="text-base text-gray-900">{selectedService.provider.name} {selectedService.provider.lastName}</p>
                  <p className="text-sm text-gray-600">{selectedService.provider.email}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fecha de creación</h4>
                  <p className="text-base text-gray-900">{formatDate(selectedService.createdAt)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${selectedService.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                      selectedService.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {selectedService.status === 'APPROVED' ? 'Aprobado' : 
                     selectedService.status === 'REJECTED' ? 'Rechazado' : 
                     'Pendiente'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                {selectedService.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => {
                        approveService(selectedService.id);
                        closeModal();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Aprobar
                    </button>
                    <button 
                      onClick={() => {
                        rejectService(selectedService.id);
                        closeModal();
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Rechazar
                    </button>
                  </>
                )}
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminServicesModeration;
