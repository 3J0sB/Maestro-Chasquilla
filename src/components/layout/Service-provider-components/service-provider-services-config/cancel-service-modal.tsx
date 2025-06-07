import React, { useState } from 'react';

interface CancelServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  clientName: string;
  serviceType: string;
}

const CancelServiceModal: React.FC<CancelServiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  serviceType,
}) => {
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">¿Cancelar este servicio?</h3>
        
        <div className="mb-4 text-gray-600">
          <p className="mb-3">
            Estás a punto de cancelar el servicio para:
          </p>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-3">
            <p><span className="font-medium">Cliente:</span> {clientName}</p>
            <p><span className="font-medium">Servicio:</span> {serviceType}</p>
          </div>
          <p className="mb-3">
            Por favor, explica el motivo de la cancelación:
          </p>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={3}
            placeholder="Ej: No disponibilidad de horario, problema técnico, etc."
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
          <button
            onClick={() => {
              onConfirm(cancelReason);
              onClose();
            }}
            disabled={!cancelReason.trim()}
            className={`px-4 py-2 text-white rounded-md transition-colors ${!cancelReason.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            Confirmar Cancelación
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelServiceModal;