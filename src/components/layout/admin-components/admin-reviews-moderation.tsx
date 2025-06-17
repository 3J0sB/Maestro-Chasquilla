'use client';

import { Session } from 'next-auth';
import AdminLayout from './admin-layout';
import React, { useState } from 'react';
import Image from 'next/image';

// Tipo para las reviews
interface Review {
  id: string;
  rating: number;
  comment: string;
  service: {
    id: string;
    name: string;
    provider: {
      id: string;
      name: string;
      lastName: string;
    };
  };
  user: {
    id: string;
    name: string;
    lastName: string;
    image: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

function AdminReviewsModeration({ session }: { session: Session | null }) {
  // Estado para las reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      rating: 4,
      comment: 'El servicio fue bueno pero el maestro llegó tarde. En general, quedé satisfecha con el trabajo realizado.',
      service: {
        id: '101',
        name: 'Servicio de Pintura',
        provider: {
          id: '201',
          name: 'Roberto',
          lastName: 'Silva',
        },
      },
      user: {
        id: '301',
        name: 'Ana',
        lastName: 'Martínez',
        image: '/img/default-user-image.png',
      },
      status: 'PENDING',
      createdAt: '2025-06-14T11:25:00Z',
    },
    {
      id: '2',
      rating: 3,
      comment: 'El trabajo fue regular, esperaba mejor calidad por el precio pagado.',
      service: {
        id: '102',
        name: 'Reparación de Techos',
        provider: {
          id: '202',
          name: 'Fernando',
          lastName: 'Torres',
        },
      },
      user: {
        id: '302',
        name: 'Carlos',
        lastName: 'Soto',
        image: '/img/default-user-image.png',
      },
      status: 'PENDING',
      createdAt: '2025-06-13T09:40:00Z',
    },
    {
      id: '3',
      rating: 5,
      comment: 'Excelente servicio, muy profesional y puntual. Recomendado!',
      service: {
        id: '103',
        name: 'Instalación Eléctrica',
        provider: {
          id: '203',
          name: 'María',
          lastName: 'González',
        },
      },
      user: {
        id: '303',
        name: 'Pedro',
        lastName: 'Ramírez',
        image: '/img/default-user-image.png',
      },
      status: 'PENDING',
      createdAt: '2025-06-12T14:15:00Z',
    },
  ]);

  // Estado para la review seleccionada en el modal
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
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

  // Función para renderizar estrellas basado en el rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Función para aprobar una review
  const approveReview = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'APPROVED' } : review
    ));
    if (selectedReview?.id === id) {
      setSelectedReview({ ...selectedReview, status: 'APPROVED' });
    }
  };

  // Función para rechazar una review
  const rejectReview = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'REJECTED' } : review
    ));
    if (selectedReview?.id === id) {
      setSelectedReview({ ...selectedReview, status: 'REJECTED' });
    }
  };

  // Función para abrir el modal con los detalles de la review
  const openReviewDetails = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  return (
    <AdminLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Moderación de Reviews</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Reviews pendientes de moderación</h2>
            <div className="flex space-x-2">
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
              </select>
              <input 
                type="text" 
                placeholder="Buscar review..." 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={review.user.image || '/img/default-user-image.png'}
                        alt={`${review.user.name} ${review.user.lastName}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-800">{review.user.name} {review.user.lastName}</h3>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                      </div>
                      <div className="flex text-lg text-yellow-400 mt-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="mt-1 text-gray-600">{review.comment}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        Sobre: <span className="font-medium">{review.service.name}</span> por <span className="font-medium">{review.service.provider.name} {review.service.provider.lastName}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${review.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        review.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {review.status === 'APPROVED' ? 'Aprobada' : 
                       review.status === 'REJECTED' ? 'Rechazada' : 
                       'Pendiente'}
                    </span>
                    <div className="flex mt-2 space-x-2">
                      <button 
                        onClick={() => openReviewDetails(review)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Ver detalles
                      </button>
                      {review.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => approveReview(review.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => rejectReview(review.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{reviews.length}</span> reviews
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

      {/* Modal de detalles de review */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Detalles de la Review</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedReview.user.image || '/img/default-user-image.png'}
                      alt={`${selectedReview.user.name} ${selectedReview.user.lastName}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{selectedReview.user.name} {selectedReview.user.lastName}</h4>
                    <p className="text-sm text-gray-500">Usuario ID: {selectedReview.user.id}</p>
                    <div className="flex text-lg text-yellow-400 mt-1">
                      {renderStars(selectedReview.rating)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Comentario</h4>
                  <p className="text-base text-gray-900 mt-1">{selectedReview.comment}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Sobre el Servicio</h4>
                  <p className="text-base text-gray-900 mt-1">{selectedReview.service.name}</p>
                  <p className="text-sm text-gray-600">Proveedor: {selectedReview.service.provider.name} {selectedReview.service.provider.lastName}</p>
                  <p className="text-sm text-gray-600">ID Servicio: {selectedReview.service.id}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha de creación</h4>
                    <p className="text-base text-gray-900 mt-1">{formatDate(selectedReview.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                    <span className={`px-2 py-1 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedReview.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        selectedReview.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {selectedReview.status === 'APPROVED' ? 'Aprobada' : 
                       selectedReview.status === 'REJECTED' ? 'Rechazada' : 
                       'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                {selectedReview.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => {
                        approveReview(selectedReview.id);
                        closeModal();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Aprobar
                    </button>
                    <button 
                      onClick={() => {
                        rejectReview(selectedReview.id);
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

export default AdminReviewsModeration;
