/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/

'use client';

import { Session } from 'next-auth';
import AdminLayout from '@/components/layout/admin-components/admin-layout';
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

const DashboardCard = ({ title, value, icon, color, isLoading = false }: DashboardCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <p className="text-3xl font-bold mt-2">{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

function AdminDashboard({ session }: { session: Session | null }) {
  // Estado para los datos del dashboard
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pendingServices: 0,
    pendingReviews: 0,
    totalUsers: 0,
    activeServiceProviders: 0,
    totalCategories: 0,
    totalPendingReports: 0
  });
  const [recentServices, setRecentServices] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  // Cargar datos del dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos del dashboard');
        }
        
        const data = await response.json();
        
        // Actualizar estados con los datos reales
        setStats({
          pendingServices: data.stats.pendingServicesCount || 0,
          pendingReviews: data.stats.reviewsCount || 0,
          totalUsers: data.stats.totalUsers || 0,
          activeServiceProviders: data.stats.serviceProvidersCount || 0,
          totalCategories: data.stats.categoriesCount || 0,
          totalPendingReports: data.stats.totalPendingReports || 0, // Este dato no está en el endpoint, se deja en 0
        });
        
        setRecentServices(data.recentPendingServices || []);
        setRecentReviews(data.recentReviews || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('No se pudieron cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  // Función para truncar texto
  const truncateText = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  return (
    <AdminLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administración</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Servicios Pendientes" 
            value={stats.pendingServices} 
            color="text-blue-600"
            isLoading={loading}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />

          <DashboardCard 
            title="Reviews Pendientes" 
            value={stats.pendingReviews} 
            color="text-amber-500"
            isLoading={loading}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-amber-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
          />

          <DashboardCard 
            title="Total Usuarios" 
            value={stats.totalUsers} 
            color="text-green-600"
            isLoading={loading}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />

          <DashboardCard 
            title="Proveedores Activos" 
            value={stats.activeServiceProviders} 
            color="text-purple-600"
            isLoading={loading}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />

          <DashboardCard 
            title="Categorías" 
            value={stats.totalCategories} 
            color="text-indigo-600"
            isLoading={loading}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />

          <DashboardCard 
            title="Reportes Recientes" 
            value={stats.totalPendingReports} 
            color="text-red-600"
            isLoading={loading}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Servicios pendientes de aprobación */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Servicios pendientes de aprobación</h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recentServices.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay servicios pendientes</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentServices.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.user.name} {service.user.lastName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDistanceToNow(new Date(service.createdAt), { addSuffix: true, locale: es })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a href="/admin/services" className="text-blue-600 hover:text-blue-800 mr-3">Ver</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Reviews pendientes de moderación */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reviews pendientes de moderación</h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recentReviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay reviews pendientes</p>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={review.user.image || '/img/default-user-image.png'}
                          alt={`${review.user.name} ${review.user.lastName}`}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{review.user.name} {review.user.lastName}</p>
                            <div className="flex items-center mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                              ))}
                              <span className="ml-2 text-xs text-gray-500">
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: es })}
                              </span>
                            </div>
                          </div>
                          <a href="/admin/reviews" className="text-blue-600 hover:text-blue-800 text-sm">Ver</a>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{truncateText(review.comment, 100)}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          <span className="font-medium">Servicio:</span> {review.service.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
