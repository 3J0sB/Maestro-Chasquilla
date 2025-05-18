import React from 'react'
import Image from 'next/image'
import { format } from 'path';
import { formatDate } from '../../../../../utils';

type RequestCardProps = {
  clientName: string;
  serviceType: string;
  description: string | null;
  requestDate: string;
  isNew?: boolean;
  isPriority?: boolean;
  clientAvatar?: string;

}

function RequestCard({
  clientName,
  serviceType,
  description,
  requestDate,
  isNew = false,
  isPriority = false,
  clientAvatar,


}: RequestCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
      {/* Header: Client info and status tags */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 overflow-hidden">
            {clientAvatar ? (
              <Image src={clientAvatar} alt={clientName} width={40} height={40} className="object-cover" />
            ) : (
              <span className="text-base sm:text-lg font-medium">{clientName.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-sm sm:text-base">{clientName}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{serviceType}</p>
          </div>
        </div>

        <div className="flex gap-2 self-start sm:self-center">
          {isNew && (
            <span className="px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
              Nuevo
            </span>
          )}
          {isPriority && (
            <span className="px-2 py-0.5 sm:py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium">
              Prioridad Alta
            </span>
          )}
        </div>
      </div>

      {/* Request description */}
      <p className="text-gray-700 mb-3 text-sm sm:text-base line-clamp-2">
        {description}
      </p>

      {/* Footer: Date and action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-2 border-t border-gray-100">
        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Recibido: {formatDate(requestDate)}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
        
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm cursor-pointer border border-gray-200 rounded-md hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
          >
            Rechazar
          </button>
          <button
      
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors flex-1 sm:flex-none"
          >
            Aceptar
          </button>
          <button
          
            className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            aria-label="Enviar mensaje al cliente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RequestCard