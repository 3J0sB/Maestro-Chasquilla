import React from 'react';

interface CompleteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
  serviceType: string;
}

const CompleteServiceModal: React.FC<CompleteServiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  serviceType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">¿Marcar servicio como completado?</h3>
        
        <div className="mb-4 text-gray-600">
          <p className="mb-3">
            Estás a punto de marcar como completado el servicio para:
          </p>
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-3">
            <p><span className="font-medium">Cliente:</span> {clientName}</p>
            <p><span className="font-medium">Servicio:</span> {serviceType}</p>
          </div>
          <p>
            Al completar el servicio, se notificará al cliente que el trabajo ha sido finalizado
            y se solicitará su confirmación y valoración.
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Completar Servicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteServiceModal;