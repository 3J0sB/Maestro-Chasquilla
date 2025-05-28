import React, { useState } from 'react';
import { formatDate } from '../../../../../utils';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  user: {
    name: string;
    image?: string;
  };
  createdAt: string;
  serviceName?: string;
}

interface ProviderReviewsProps {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews: any[] | undefined;
}

const ProviderReviews  = ({
  totalReviews,
  averageRating,
  ratingBreakdown,
  reviews
}: ProviderReviewsProps) => {
  const [filter, setFilter] = useState<'all' | number>('all');
  const [expanded, setExpanded] = useState(false);
  
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return "0%";
    return (count / totalReviews * 100).toFixed(0) + '%';
  };
  
  const getPercentageText = (count: number) => {
    if (totalReviews === 0) return "0%";
    return Math.round(count / totalReviews * 100) + "%";
  };

  const filteredReviews = reviews && reviews.length > 0 
    ? (filter === 'all' 
        ? reviews 
        : reviews.filter(review => review.rating === filter))
    : [];
  
  const displayedReviews = expanded 
    ? filteredReviews 
    : filteredReviews.slice(0, 3);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Opiniones y Valoraciones
          <span className="ml-2 bg-orange-100 text-orange-800 text-sm px-2 py-0.5 rounded-full">
            {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
          </span>
        </h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilter(rating)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center ${
                filter === rating 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {rating}
              <svg 
                className="w-4 h-4 ml-0.5 text-yellow-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resumen de valoración */}
        <div className="md:col-span-1 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-orange-600 mb-2">
            {totalReviews > 0 ? averageRating.toFixed(1) : "0.0"}
          </div>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(averageRating) 
                    ? "text-yellow-400" 
                    : star - 0.5 <= averageRating 
                      ? "text-yellow-300" 
                      : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-600 mb-4 text-center">
            {totalReviews > 0 
              ? `Basado en ${totalReviews} ${totalReviews === 1 ? 'opinión' : 'opiniones'}`
              : "Aún no hay valoraciones"}
          </p>
          
          {/* Desglose de valoraciones */}
          <div className="w-full space-y-2 mt-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center text-sm">
                <div className="flex items-center w-12">
                  <span className="font-medium text-gray-700">{rating}</span>
                  <svg className="w-4 h-4 ml-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-grow mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: getPercentage(ratingBreakdown[rating as keyof typeof ratingBreakdown]) }}
                  ></div>
                </div>
                <span className="w-10 text-right text-gray-600 text-xs font-medium">
                  {ratingBreakdown[rating as keyof typeof ratingBreakdown] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Área de reseñas */}
        <div className="md:col-span-2">
          {displayedReviews.length > 0 ? (
            <div className="space-y-6">
              {displayedReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center overflow-hidden border-2 border-white shadow">
                        {review.user?.image ? (
                          <img src={review.user.image} alt={review.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-medium text-orange-700">
                            {review.user?.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold text-gray-800">{review.user?.name || "Usuario anónimo"}</span>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg 
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-200"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 md:mt-0">
                          {formatDate(review.createdAt) || "Fecha no disponible"}
                        </div>
                      </div>
                      
                      {review.serviceName && (
                        <div className="inline-block mb-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {review.serviceName}
                        </div>
                      )}
                      
                      {review.comment ? (
                        <p className="text-gray-700 mt-2 text-sm md:text-base leading-relaxed">
                          "{review.comment}"
                        </p>
                      ) : (
                        <p className="text-gray-500 italic text-sm mt-2">
                          El usuario no dejó comentarios.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-10 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                {filter !== 'all' 
                  ? `No hay reseñas con ${filter} estrellas` 
                  : 'No hay reseñas disponibles'}
              </h3>
              <p className="text-gray-500">
                {filter !== 'all'
                  ? 'Prueba a seleccionar otro filtro para ver más reseñas.'
                  : 'Sé el primero en compartir tu experiencia con este proveedor.'}
              </p>
            </div>
          )}

          {/* Botón para mostrar más/menos */}
          {filteredReviews.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
              >
                {expanded ? (
                  <>
                    <span>Ver menos</span>
                    <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Ver todas ({filteredReviews.length})</span>
                    <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderReviews;