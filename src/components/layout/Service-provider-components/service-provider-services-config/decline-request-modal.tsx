import React, { useState } from 'react';

interface DeclineRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
  serviceType: string;
}

function DeclineRequestModal({ isOpen, onClose, onConfirm, clientName, serviceType }: DeclineRequestModalProps) {
  const [isDeclining, setIsDeclining] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeclining(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error declining request:', error);
    } finally {
      setIsDeclining(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/25 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* Warning icon */}
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Declinar Solicitud
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Estás a punto de declinar la solicitud de <span className="font-semibold text-gray-700">{clientName}</span> para el servicio "<span className="font-semibold text-gray-700">{serviceType}</span>".
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Al declinar esta solicitud, se notificará al cliente que no podrás brindar el servicio solicitado.
                  </p>
                  
                  {/* Razón opcional para declinar */}
                  <div className="mt-4">
                    <label htmlFor="declineReason" className="block text-sm font-medium text-gray-700">
                      Motivo (opcional)
                    </label>
                    <textarea
                      id="declineReason"
                      name="declineReason"
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                      placeholder="Explica por qué no puedes brindar este servicio..."
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={isDeclining}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                isDeclining ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'
              } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={handleConfirm}
            >
              {isDeclining ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                'Declinar Solicitud'
              )}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={isDeclining}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeclineRequestModal;