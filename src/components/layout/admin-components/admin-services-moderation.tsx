'use client';

import { Session } from 'next-auth';
import AdminLayout from './admin-layout';
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/format';

// Tipos para los servicios
interface Service {
  id: string;
  title: string;
  smallDescription: string;
  description: string;
  price?: string;
  minServicePrice?: number;
  maxServicePrice?: number;
  image?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    name: string;
    lastName: string;
    email: string;
  };
}

export function AdminServicesModeration({ session }: { session: Session | null }) {
  // Estado para los servicios
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos de servicios
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/services');

        if (!response.ok) {
          throw new Error('Error al cargar los servicios');
        }

        const data = await response.json();
        console.log('Datos de servicios recibidos:', data);
        const mappedServices = data.services.map((service: any) => {
          // Mantener el estado original si no está en deletedAt
          // Si deletedAt tiene valor, marcar como REJECTED independientemente del estado actual
          const standardStatus = service.deletedAt ? 'REJECTED' : service.status;

          return {
            ...service,
            status: standardStatus
          };
        });


        setServices(mappedServices);
        console.log('Servicios cargados:', mappedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('No se pudieron cargar los servicios');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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

  // Función para mostrar el rango de precios
  const formatPriceRange = (service: Service) => {
    if (service.minServicePrice && service.maxServicePrice) {
      return `${formatCurrency(service.minServicePrice)} - ${formatCurrency(service.maxServicePrice)}`;
    } else if (service.price) {
      return service.price;
    }
    return 'Precio no especificado';
  };

  // Función para aprobar un servicio
  const approveService = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      if (!response.ok) {
        throw new Error('Error al aprobar el servicio');
      }

      // Actualizar estado local
      setServices(services.map(service =>
        service.id === id ? { ...service, status: 'APPROVED', deletedAt: null } : service
      ));

      if (selectedService?.id === id) {
        setSelectedService({ ...selectedService, status: 'APPROVED', deletedAt: null });
      }
    } catch (error) {
      console.error('Error al aprobar servicio:', error);
      setError('Error al aprobar el servicio');
    }
  };

  // Función para rechazar un servicio
  const rejectService = async (id: string) => {
    try {
      console.log('Rechazando servicio con ID:', id);
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });

      if (!response.ok) {
        throw new Error('Error al rechazar el servicio');
      }

      // Actualizar estado local
      setServices(services.map(service =>
        service.id === id ? { ...service, status: 'REJECTED', deletedAt: new Date().toISOString() } : service
      ));

      if (selectedService?.id === id) {
        setSelectedService({ ...selectedService, status: 'REJECTED', deletedAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error al rechazar servicio:', error);
      setError('Error al rechazar el servicio');
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

  // Filtrar servicios basado en el estado y término de búsqueda
  const filteredServices = services.filter(service => {
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.smallDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.user.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Moderación de Servicios</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Servicios pendientes de aprobación</h2>
            <div className="flex space-x-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="PENDING">Pendientes</option>
                <option value="APPROVED">Aprobados</option>
                <option value="REJECTED">Rechazados</option>
              </select>
              <input
                type="text"
                placeholder="Buscar servicio..."
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron servicios
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPriceRange(service)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.user.name} {service.user.lastName}</td>
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
                        <td className="py-4 whitespace-nowrap text-sm text-gray-500 ">
                          <button
                            onClick={() => openServiceDetails(service)}
                            className="text-blue-600 hover:text-blue-800 mr-3 bg-blue-100 px-2 py-1 rounded-md text-sm font-medium"
                          >
                            Ver
                          </button>
                          {service.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => approveService(service.id)}
                                className="text-green-600 hover:text-green-800 mr-3 bg-green-100 px-2 py-1 rounded-md text-sm font-medium"
                              >
                                Aprobar
                              </button>
                              <button
                                onClick={() => rejectService(service.id)}
                                className="text-red-600 hover:text-red-800 bg-red-100 px-2 py-1 rounded-md text-sm font-medium"
                              >
                                Rechazar
                              </button>
                            </>
                          )}

                          {service.status === 'REJECTED' && (
                            <>
                              <button
                                onClick={() => approveService(service.id)}
                                className="text-green-600 hover:text-green-800 mr-3 bg-green-100 px-2 py-1 rounded-md text-sm font-medium"
                              >
                                Aprobar
                              </button>
  
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles del servicio */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Servicio</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>


            {selectedService.image && (
              <div className="mb-6">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-120 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Nombre del Servicio</h4>
                  <p className="text-base text-gray-900">{selectedService.title}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Descripción</h4>
                  <p className="text-sm text-gray-700">{selectedService.description || selectedService.smallDescription}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Precio</h4>
                  <p className="text-base text-gray-900">{formatPriceRange(selectedService)}</p>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Proveedor</h4>
                  <p className="text-base text-gray-900">{selectedService.user.name} {selectedService.user.lastName}</p>
                  <p className="text-sm text-gray-600">{selectedService.user.email}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</h4>
                  <p className="text-base text-gray-900">{formatDate(selectedService.createdAt)}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Estado</h4>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${selectedService.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      selectedService.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                    {selectedService.status === 'APPROVED' ? 'Aprobado' :
                      selectedService.status === 'REJECTED' ? 'Rechazado' :
                        'Pendiente'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
              {selectedService.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => approveService(selectedService.id)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => rejectService(selectedService.id)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Rechazar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminServicesModeration;
