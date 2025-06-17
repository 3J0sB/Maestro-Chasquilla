'use client';

import { Session } from 'next-auth';
import AdminLayout from './admin-layout';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Tipo para las reviews
interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  user: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    image: string | null;
  };
  service: {
    id: string;
    title: string;
    user: {
      id: string;
      name: string;
      lastName: string;
      email: string;
    };
  };
}

function AdminReviewsModeration({ session }: { session: Session | null }) {
  // Estado para las reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos de reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/reviews');
        
        if (!response.ok) {
          throw new Error('Error al cargar las reviews');
        }
        
        const data = await response.json();
        setReviews(data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('No se pudieron cargar las reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
  const approveReview = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: true }),
      });

      if (!response.ok) {
        throw new Error('Error al aprobar la review');
      }

      // Actualizar estado local
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, status: 'APPROVED', deletedAt: null } : review
      ));
      
      if (selectedReview?.id === id) {
        setSelectedReview({ ...selectedReview, status: 'APPROVED', deletedAt: null });
      }
    } catch (error) {
      console.error('Error al aprobar review:', error);
      setError('Error al aprobar la review');
    }
  };

  // Función para rechazar una review
  const rejectReview = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al rechazar la review');
      }

      // Actualizar estado local
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, status: 'REJECTED', deletedAt: new Date().toISOString() } : review
      ));
      
      if (selectedReview?.id === id) {
        setSelectedReview({ ...selectedReview, status: 'REJECTED', deletedAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error al rechazar review:', error);
      setError('Error al rechazar la review');
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

  // Filtrar reviews basado en el estado y término de búsqueda
  const filteredReviews = reviews.filter(review => {
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) || 
      review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.service.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Moderación de Reviews</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Reviews pendientes de moderación</h2>
            <div className="flex space-x-2">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="PENDING">Pendientes</option>
                <option value="APPROVED">Aprobadas</option>
                <option value="REJECTED">Rechazadas</option>
              </select>
              <input 
                type="text" 
                placeholder="Buscar review..." 
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
            <div className="grid grid-cols-1 gap-4">
              {filteredReviews.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No se encontraron reviews
                </div>
              ) : (
                filteredReviews.map((review) => (
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
                          <div className="flex items-center">
                            <p className="font-medium text-gray-900">{review.user.name} {review.user.lastName}</p>
                            <span className="mx-2 text-gray-300">•</span>
                            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                          </div>
                          <div className="flex items-center mt-1">
                            {renderStars(review.rating)}
                          </div>
                          <p className="mt-2 text-gray-700">{review.comment}</p>
                          <p className="mt-2 text-sm text-gray-500">
                            <span className="font-medium">Servicio:</span> {review.service.title} - 
                            <span className="font-medium"> Proveedor:</span> {review.service.user.name} {review.service.user.lastName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 min-w-[100px]">
                        <span className={`py-1 text-xs leading-5 font-semibold rounded-full text-center
                          ${review.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                            review.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {review.status === 'APPROVED' ? 'Aprobada' : 
                           review.status === 'REJECTED' ? 'Rechazada' : 
                           'Pendiente'}
                        </span>
                        
                        <button 
                          onClick={() => openReviewDetails(review)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Ver detalles
                        </button>
                        
                        {review.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => approveReview(review.id)}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Aprobar
                            </button>
                            <button 
                              onClick={() => rejectReview(review.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles de la review */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Detalles de la Review</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
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
                  <h4 className="text-lg font-medium text-gray-900">{selectedReview.user.name} {selectedReview.user.lastName}</h4>
                  <p className="text-sm text-gray-600">{selectedReview.user.email}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Servicio</h4>
                <p className="text-base text-gray-900">{selectedReview.service.title}</p>
                <p className="text-sm text-gray-600">Proveedor: {selectedReview.service.user.name} {selectedReview.service.user.lastName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Comentario</h4>
                <p className="text-base text-gray-700">{selectedReview.comment}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</h4>
                  <p className="text-base text-gray-900">{formatDate(selectedReview.createdAt)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Estado</h4>
                  <span className={`px-2 inline-flex  text-xs leading-5 font-semibold rounded-full 
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
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
              {selectedReview.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => approveReview(selectedReview.id)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Aprobar
                  </button>
                  <button 
                    onClick={() => rejectReview(selectedReview.id)}
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

export default AdminReviewsModeration;
