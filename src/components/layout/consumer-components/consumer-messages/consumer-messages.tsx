import React, { useState, useEffect, useRef } from 'react';
import { formatDate } from '../../../../../utils';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  senderId: string;
  senderType: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  provider: {
    id: string;
    name: string;
    lastName: string;
    image?: string;
  };
  messages: Message[];
}

interface ConsumerMessagesProps {
  userId: string | undefined;
}

const ConsumerMessagesComponent: React.FC<ConsumerMessagesProps> = ({ userId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // NUEVO: para mobile, mostrar/ocultar panel de conversaciones
  const [showConversations, setShowConversations] = useState(true);

useEffect(() => {
  const fetchConversations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/consumer/conversations/${userId}`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar las conversaciones');
      }
      const data = await response.json();
      setConversations(data);

      // Solo seleccionar la primera conversación por defecto en desktop
      if (
        data.length > 0 &&
        !selectedConversation &&
        (window.innerWidth >= 768) // md: breakpoint
      ) {
        setSelectedConversation(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error al cargar conversaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // NUEVO: cuando seleccionas una conversación, ocultar lista en mobile
  useEffect(() => {
    if (selectedConversation) setShowConversations(false);
  }, [selectedConversation]);

  // NUEVO: volver a mostrar lista en mobile
  const handleBackToConversations = () => setShowConversations(true);

  // ...resto de funciones (handleSendMessage, getProviderName, etc.)...

  // Enviar un nuevo mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation || !userId) {
      return;
    }

    try {
      setSendingMessage(true);

      const response = await fetch('/api/consumer/conversations/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage,
          senderId: userId,
          senderType: 'USER',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      const data = await response.json();

      setConversations(prevConversations =>
        prevConversations.map(conv => {
          if (conv.id === selectedConversation) {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: data.id,
                  senderId: userId,
                  senderType: 'USER',
                  content: newMessage,
                  createdAt: new Date().toISOString(),
                  isRead: false,
                },
              ],
            };
          }
          return conv;
        })
      );

      setNewMessage('');
      toast.success('Mensaje enviado');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      toast.error('No se pudo enviar el mensaje');
    } finally {
      setSendingMessage(false);
    }
  };

  // ...getProviderName, getLastMessage, getUnreadCount, getLastMessageDate, marcar leídos...

  const getProviderName = (conversation: Conversation) => {
    return `${conversation.provider.name} ${conversation.provider.lastName || ''}`.trim();
  };

  const getLastMessage = (conversation: Conversation) => {
    if (conversation.messages.length === 0) {
      return 'No hay mensajes';
    }
    return conversation.messages[conversation.messages.length - 1].content;
  };

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter(msg =>
      !msg.isRead && msg.senderType === 'SERVICE_PROVIDER'
    ).length;
  };

  const getLastMessageDate = (conversation: Conversation) => {
    if (conversation.messages.length === 0) {
      return '';
    }
    return formatDate(conversation.messages[conversation.messages.length - 1].createdAt);
  };

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!selectedConversation || !userId) return;

      try {
        const response = await fetch(`/api/consumer/conversations/messages/read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId: selectedConversation,
            userId: userId
          }),
        });

        if (!response.ok) {
          console.error('Error al marcar mensajes como leídos');
          return;
        }

        setConversations(prevConversations =>
          prevConversations.map(conv => {
            if (conv.id === selectedConversation) {
              return {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.senderType === 'SERVICE_PROVIDER' ? { ...msg, isRead: true } : msg
                ),
              };
            }
            return conv;
          })
        );
      } catch (err) {
        console.error('Error al marcar mensajes como leídos:', err);
      }
    };

    markMessagesAsRead();
  }, [selectedConversation, userId]);

  return (
    <div className="flex h-full flex-col md:flex-row bg-white  overflow-hidden">
      {/* Panel de conversaciones */}
      <div
        className={`
          w-full md:w-1/3 border-r border-gray-200 overflow-y-auto bg-white
          ${showConversations ? 'block' : 'hidden'}
          md:block
        `}
      >
        {loading && conversations.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {error}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tienes conversaciones activas.
          </div>
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                selectedConversation === conversation.id ? 'bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {conversation.provider.image ? (
                      <img src={conversation.provider.image} alt={conversation.provider.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-500 font-medium">
                        {conversation.provider.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {getUnreadCount(conversation) > 0 && (
                    <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getUnreadCount(conversation)}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium text-gray-800 truncate">
                      {getProviderName(conversation)}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {getLastMessageDate(conversation)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {getLastMessage(conversation)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Panel de mensajes */}
      <div
        className={`
          flex-1 flex flex-col w-full md:w-2/3
          ${showConversations ? 'hidden' : 'flex'}
          md:flex
        `}
      >
        {selectedConversation ? (
          <>
            {/* Header con botón volver en mobile */}
            <div className="p-4 border-b border-gray-200 flex items-center bg-white sticky top-0 z-10">
              <div className="md:hidden mr-3">
                <button
                  onClick={handleBackToConversations}
                  className="p-2 rounded-full hover:bg-orange-100 transition"
                  aria-label="Volver"
                >
                  <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              {conversations.find(c => c.id === selectedConversation) && (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                    {conversations.find(c => c.id === selectedConversation)?.provider.image ? (
                      <img
                        src={conversations.find(c => c.id === selectedConversation)?.provider.image}
                        alt={conversations.find(c => c.id === selectedConversation)?.provider.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-500 font-medium">
                        {conversations.find(c => c.id === selectedConversation)?.provider.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {getProviderName(conversations.find(c => c.id === selectedConversation)!)}
                    </h3>
                  </div>
                </>
              )}
            </div>

            {/* Mensajes */}
            <div className="flex-1 h-screen p-4 overflow-y-auto bg-gray-50">
              {conversations.find(c => c.id === selectedConversation)?.messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No hay mensajes en esta conversación.</p>
                </div>
              ) : (
                <div className="space-y-3 h-[300px]">
                  {conversations.find(c => c.id === selectedConversation)?.messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'USER' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${
                          message.senderType === 'USER'
                            ? 'bg-orange-100 text-gray-800'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">
                            {message.senderType === 'USER' ? 'Tú' : getProviderName(conversations.find(c => c.id === selectedConversation)!)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Área de entrada de mensaje */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border border-gray-200 rounded-l-lg p-2 focus:outline-none focus:border-orange-500"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  className={`bg-orange-500 border border-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-lg transition-colors ${
                    sendingMessage ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={sendingMessage || !newMessage.trim()}
                >
                  {sendingMessage ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <span>Enviar</span>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center p-8">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-1">Mis mensajes</h3>
              <p className="text-gray-500">
                Selecciona una conversación para ver los mensajes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerMessagesComponent;