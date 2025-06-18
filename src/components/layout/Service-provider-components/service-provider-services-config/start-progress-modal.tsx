import React from 'react';

interface StartProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
  serviceType: string;
}

const StartProgressModal: React.FC<StartProgressModalProps> = ({
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">¿Comenzar trabajo?</h3>
        
        <div className="mb-4 text-gray-600">
          <p className="mb-3">
            Estás a punto de comenzar el trabajo para:
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
            <p><span className="font-medium">Cliente:</span> {clientName}</p>
            <p><span className="font-medium">Servicio:</span> {serviceType}</p>
          </div>
          <p>
            Al iniciar el trabajo, notificarás al cliente que has comenzado y el estado 
            del servicio cambiará a &quot;En Progreso&quot;.
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Iniciar Trabajo
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartProgressModal;