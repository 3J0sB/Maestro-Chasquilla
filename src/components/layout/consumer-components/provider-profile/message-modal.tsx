import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
  providerImage?: string;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  providerId,
  providerName,
  providerImage
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('El mensaje no puede estar vacío');
      return;
    }
    
    if (!session?.user?.id) {
      toast.error('Debes iniciar sesión para enviar mensajes');
      return;
    }

    try {
      setIsLoading(true);

      // Primero, crear o buscar una conversación existente
      const conversationResponse = await fetch('/api/consumer/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: providerId,
          userId: session.user.id,
        }),
      });

      if (!conversationResponse.ok) {
        throw new Error('Error al crear la conversación');
      }

      const conversationData = await conversationResponse.json();
      
      // Luego, enviar el mensaje a esa conversación
      const messageResponse = await fetch('/api/consumer/conversations/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: conversationData.id,
          content: message,
          senderId: session.user.id,
          senderType: 'USER',
        }),
      });

      if (!messageResponse.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      toast.success('Mensaje enviado con éxito');
      onClose();
      
      // Opcional: redirigir al usuario a la página de conversaciones
      router.push('/services/conversations');
    } catch (error) {
      console.error('Error:', error);
      toast.error('No se pudo enviar el mensaje. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Encabezado del modal */}
        <div className="bg-orange-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">Nuevo mensaje</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Información del destinatario */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={providerImage || '/img/miau.jpg'}
                alt={providerName}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">Para: {providerName}</p>
              <p className="text-xs text-gray-500">Proveedor de servicios</p>
            </div>
          </div>
        </div>

        {/* Formulario de mensaje */}
        <form onSubmit={handleSendMessage}>
          <div className="p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              disabled={isLoading}
            ></textarea>
            
            <div className="text-xs text-gray-500 mt-1">
              Sé claro y específico sobre lo que necesitas para obtener una mejor respuesta.
            </div>
          </div>

          {/* Botones de acción */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                'Enviar mensaje'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;