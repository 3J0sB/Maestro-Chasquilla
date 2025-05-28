import React, { useState } from 'react';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewer?: {
    name: string;
    image?: string;
  };
  date?: string;
  serviceType?: string;
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

const ProviderReviews: React.FC<ProviderReviewsProps> = ({
  totalReviews,
  averageRating,
  ratingBreakdown,
  reviews
}) => {
  const [filter, setFilter] = useState('all');
  

  const getPercentage = (count: number) => {
    if (totalReviews === 0) return "0%";
    return (count / totalReviews * 100).toFixed(0) + '%';
  };
  
  
  const getPercentageText = (count: number) => {
    if (totalReviews === 0) return "0%";
    return Math.round(count / totalReviews * 100) + "%";
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Calificaciones y Reseñas</h2>
        <span className="text-gray-500">{totalReviews} reseñas</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating summary */}
        <div>
          <div className="flex items-center mb-4">
            <div className="text-4xl font-bold text-gray-800 mr-4">
              {totalReviews > 0 ? averageRating.toFixed(1) : "0.0"}
            </div>
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-500">Calificación General</p>
            </div>
          </div>
          
          {/* Rating breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-2 text-gray-600">{rating}</span>
                <div className="flex-grow mx-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: getPercentage(ratingBreakdown[rating as keyof typeof ratingBreakdown]) }}
                  ></div>
                </div>
                <span className="w-8 text-right text-gray-500 text-sm">
                  {getPercentageText(ratingBreakdown[rating as keyof typeof ratingBreakdown])}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h3 className="font-bold mb-4">Reseñas recientes</h3>
        
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 mb-4 last:border-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {review.reviewer?.image ? (
                      <img src={review.reviewer.image} alt={review.reviewer.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{review.reviewer?.name || "Usuario anónimo"}</span>
                    <span className="text-sm text-gray-500">{review.date || "Fecha no disponible"}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    
                    {review.serviceType && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                        {review.serviceType}
                      </span>
                    )}
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-700 mt-1">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No hay reseñas disponibles para este proveedor.
          </div>
        )}
        
        {reviews && reviews.length > 3 && (
          <div className="text-center mt-4">
            <button className="text-orange-500 font-medium hover:text-orange-600">
              Ver todas las reseñas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderReviews;