/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  readAt: string | null;
  linkPath: string | null;
  metadata: any | null;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const query = filter === 'unread' ? '?unread=true' : '';
      console.log('endpoint:', `/api/service-provider/notifications${query}`);
      const response = await fetch(`/api/service-provider/notifications${query}`);
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session, filter]);

  const markAsRead = async (notificationId?: string) => {
    try {
      console.log('Marcar como leída:', notificationId, 'allNotifications:', !notificationId);
      const response = await fetch('/api/service-provider/notifications/mark-as-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId,
          allNotifications: !notificationId
        }),
      });
      
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error al marcar notificación:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener el ícono según el tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REQUEST_NEW':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'REVIEW_NEW':
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        );
      case 'REQUEST_CANCELLED':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'NEW_MESSAGE':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <ServiceProviderSidebar
        userName={session?.user?.name || ''}
        userType={session?.user?.role || ''}
        userLastName={session?.user?.lastName || ''}
        userImage={session?.user?.image || ''}
      />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    filter === 'all' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'unread' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border-t border-b border-gray-300`}
                >
                  No leídas
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    filter === 'read' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300`}
                >
                  Leídas
                </button>
              </div>
              
              <button
                onClick={() => markAsRead()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Marcar todas como leídas
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow px-6 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="mt-4 text-lg text-gray-600">No tienes notificaciones {filter !== 'all' ? (filter === 'unread' ? 'no leídas' : 'leídas') : ''}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {notifications.map(notification => {
                  const isUnread = !notification.readAt;
                  return (
                    <li key={notification.id} className={`${isUnread ? 'bg-blue-50' : ''}`}>
                      <div className="px-6 py-5 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium text-gray-900 ${isUnread ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="text-xs text-gray-500">
                                  {formatDate(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {notification.message}
                            </p>
                            <div className="mt-2 flex">
                              {notification.linkPath && (
                                <Link 
                                  href={notification.linkPath}
                                  onClick={() => !notification.readAt && markAsRead(notification.id)}
                                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                >
                                  Ver detalles
                                </Link>
                              )}
                              {isUnread && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="ml-4 text-xs font-medium text-gray-500 hover:text-gray-700"
                                >
                                  Marcar como leída
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
