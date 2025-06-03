import React from 'react';
import Link from 'next/link';
import { formatRelativeTime } from '../../../../../utils';

interface Review {
  id: string;
  serviceId: string;
  serviceName: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface RecentReviewsProps {
  reviews: Review[];
}

const RecentReviews: React.FC<RecentReviewsProps> = ({ reviews }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Reseñas Recientes
        </h2>
        
        <Link 
          href="/provider/reviews" 
          className="text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          Ver todas
        </Link>
      </div>
      
      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '360px' }}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {review.userImage ? (
                      <img 
                        src={review.userImage} 
                        alt={review.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {review.userName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(review.createdAt)}
                    </p>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-0.5">
                    Servicio: {review.serviceName}
                  </p>
                  
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating 
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
                  </div>
                  
                  {review.comment && (
                    <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-gray-500">
            No hay reseñas recientes
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentReviews;