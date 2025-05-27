import React from 'react';
import Image from 'next/image';

interface ProviderProfileHeaderProps {
  name: string;
  lastName?: string;
  lastName2?: string;
  image?: string;
  profession: string;
  rating: number;
  reviewCount: number;
  location?: string;
  isVerified?: boolean;
  role: string | undefined;
}

const ProviderProfileHeader: React.FC<ProviderProfileHeaderProps> = ({
  name,
  lastName,
  lastName2,
  image,
  profession,
  rating,
  reviewCount,
  location,
  role,
  isVerified = false
}) => {
  const fullName = [name, lastName, lastName2].filter(Boolean).join(' ');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0 border-4 border-white shadow">
          <Image
            src={image || '/img/miau.jpg'}
            alt={fullName}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Información principal */}
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl font-bold text-gray-800">{fullName}</h1>
          <p className="text-gray-600 mb-2">{profession}</p>

          {/* Rating */}
          <div className="flex items-center justify-center md:justify-start mb-2">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-700 font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-500 ml-1">({reviewCount} reseñas)</span>

            {isVerified && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verificado
              </span>
            )}
          </div>

          {/* Ubicación y tiempo de respuesta */}
          <div className="flex flex-wrap justify-center md:justify-start text-sm text-gray-500">
            {location && (
              <div className="flex items-center mr-4 mb-2">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
              </div>
            )}


          </div>
        </div>

        {/* Botones de acción */}
        {
          role === 'USER' && (
            <div className="mt-4 md:mt-0 flex flex-col gap-2">
              <button className="bg-white border cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-500 hover:text-orange-500 font-medium rounded-lg px-4 py-2 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Mensaje
              </button>
            </div>

          )
        }

      </div>
    </div>
  );
};

export default ProviderProfileHeader;