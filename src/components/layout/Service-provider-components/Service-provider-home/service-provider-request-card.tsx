import React, { useState } from 'react'
import Image from 'next/image'
import { formatDate } from '../../../../../utils';
import MessageModal from '@/components/layout/Service-provider-components/Service-provider-home/message-modal-privder';

type RequestCardProps = {
  requestId: string;
  status: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  description: string | null;
  requestDate: string;
  isNew?: boolean;
  isPriority?: boolean;
  clientAvatar?: string;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  onComplete: (requestId: string) => void;
  onStartProgress: (requestId: string) => void;
  onCancel: (requestId: string) => void;
  providerId: string;
}

// Orden de los estados en la línea de tiempo
const STATUS_ORDER = [
  'PENDING',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED'
];

// Estados alternativos que pueden ocurrir
const ALTERNATIVE_STATES = ['CANCELLED', 'REJECTED'];

function RequestCard({
  requestId,
  status,
  clientId,
  clientName,
  serviceType,
  description,
  requestDate,
  isNew = false,
  isPriority = false,
  clientAvatar,
  onAccept,
  onDecline,
  onComplete,
  onStartProgress,
  onCancel,
  providerId,
}: RequestCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("cliente avatar:",clientAvatar)
  // Handlers para los diferentes botones (sin cambios)
  const handleAccept = () => {
    try {
      onAccept(requestId);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  }

  const handleDecline = () => {
    try {
      onDecline(requestId);
    } catch (error) {
      console.error("Error declining request:", error);
    }
  }

  const handleStartProgress = () => {
    try {
      onStartProgress(requestId);
    } catch (error) {
      console.error("Error starting progress:", error);
    }
  }

  const handleComplete = () => {
    try {
      onComplete(requestId);
    } catch (error) {
      console.error("Error completing request:", error);
    }
  }

  const handleCancel = () => {
    try {
      onCancel(requestId);
    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  }

  const handleMessageClick = () => {
    setIsModalOpen(true);
  }

  // Función para renderizar la línea de tiempo
  const renderTimeline = () => {
    // Si es un estado alternativo, mostramos una línea de tiempo especial
    if (ALTERNATIVE_STATES.includes(status)) {
      return (
        <div className="flex items-center w-full mt-4 mb-2">
          <div className="w-full flex items-center">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center 
              ${status === 'CANCELLED' ? 'bg-orange-100 text-orange-500' : 'bg-red-100 text-red-500'}`}>
              {status === 'CANCELLED' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="mx-2 h-1 w-full bg-gray-200"></div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full
              ${status === 'CANCELLED' ? 'bg-orange-100 text-orange-500' : 'bg-red-100 text-red-500'}`}>
              {status === 'CANCELLED' ? 'Cancelado' : 'Rechazado'}
            </span>
          </div>
        </div>
      );
    }

    // Para los estados normales, mostramos la progresión
    const currentStatusIndex = STATUS_ORDER.indexOf(status);

    return (
      <div
        className="w-full mt-4 mb-2 cursor-pointer"

      >
        <div className="flex items-center justify-between">
          {STATUS_ORDER.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isActive = index === currentStatusIndex;

            return (
              <React.Fragment key={step}>
                {/* Nodo de estado */}
                <div
                  className={`relative flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 
                    ${isActive ? 'bg-blue-500 border-blue-500 text-white' :
                      isCompleted ? 'bg-green-500 border-green-500 text-white' :
                        'bg-white border-gray-300'}`}
                >
                  {isCompleted && index < currentStatusIndex && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-6 whitespace-nowrap text-xs font-medium text-blue-600">
                      {getStatusText(step)}
                    </div>
                  )}
                </div>

                {/* Línea conectora (excepto para el último elemento) */}
                {index < STATUS_ORDER.length - 1 && (
                  <div className={`flex-1 h-1 ${index < currentStatusIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    );
  };

  // Función para obtener el texto de estado en español
  const getStatusText = (statusCode: string) => {
    switch (statusCode) {
      case 'PENDING': return 'Pendiente';
      case 'ACCEPTED': return 'Aceptado';
      case 'IN_PROGRESS': return 'En Progreso';
      case 'COMPLETED': return 'Completado';
      case 'CANCELLED': return 'Cancelado';
      case 'REJECTED': return 'Rechazado';
      default: return statusCode;
    }
  };

  // Función para renderizar las acciones según el estado actual
  const renderActionButtons = () => {
    switch (status) {
      case 'PENDING':
        return (
          <>
            <button
              onClick={() => handleDecline()}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm cursor-pointer border border-gray-200 rounded-md hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
            >
              Rechazar
            </button>
            <button
              onClick={() => handleAccept()}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors flex-1 sm:flex-none"
            >
              Aceptar
            </button>
          </>
        );
      case 'ACCEPTED':
        return (
          <>
            <button
              onClick={() => handleStartProgress()}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex-1 sm:flex-none"
            >
              Iniciar Trabajo
            </button>
            <button
              onClick={() => handleCancel()}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm cursor-pointer border border-gray-200 rounded-md hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
            >
              Cancelar
            </button>
          </>
        );
      case 'IN_PROGRESS':
        return (
          <>
            <button
              onClick={() => handleComplete()}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm cursor-pointer bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex-1 sm:flex-none"
            >
              Completar
            </button>
            <button
              onClick={() => handleCancel()}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm cursor-pointer border border-gray-200 rounded-md hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
            >
              Cancelar
            </button>
          </>
        );
      case 'COMPLETED':
      case 'CANCELLED':
      case 'REJECTED':
        return (
          <button
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-md opacity-50 cursor-not-allowed flex-1 sm:flex-none"
            disabled
          >
            {status === 'COMPLETED' ? 'Completado' : status === 'CANCELLED' ? 'Cancelado' : 'Rechazado'}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
      {/* Header: Client info and status tags */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 overflow-hidden">
            {clientAvatar ? (
              <Image src={clientAvatar || "/img/miau.jpg"} alt={clientName} width={40} height={40} className="object-cover" />
            ) : (
              <span className="text-base sm:text-lg font-medium">{clientName?.charAt(0) || "?"}</span>
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

      {/* Timeline visualization */}
      {renderTimeline()}

      {/* Footer: Date and action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-2 border-t border-gray-100">
        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Recibido: {formatDate(requestDate)}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {renderActionButtons()}
          <button
            onClick={handleMessageClick}
            className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            aria-label="Enviar mensaje al cliente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal de mensaje */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        providerId={providerId}
        userId={clientId}
        userName={clientName}
        userImage={clientAvatar}
        serviceType={serviceType}
        requestId={requestId}
      />
    </div>
  )
}

export default RequestCard