'use client';

import { Session } from 'next-auth';
import AdminLayout from '@/components/layout/admin-components/admin-layout';
import React, { useState } from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard = ({ title, value, icon, color }: DashboardCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

function AdminDashboard({ session }: { session: Session | null }) {
  // Datos de ejemplo para el dashboard
  const [stats] = useState({
    pendingServices: 15,
    pendingReviews: 8,
    totalUsers: 245,
    activeServiceProviders: 32,
    totalCategories: 18,
    recentReports: 3
  });

  return (
    <AdminLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administración</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Servicios Pendientes" 
            value={stats.pendingServices} 
            color="text-blue-600"
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
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />

          <DashboardCard 
            title="Reportes Recientes" 
            value={stats.recentReports} 
            color="text-red-600"
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
                  {/* Datos de ejemplo */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Reparación de Cañerias</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Juan Pérez</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/06/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Ver</button>
                      <button className="text-green-600 hover:text-green-800 mr-3">Aprobar</button>
                      <button className="text-red-600 hover:text-red-800">Rechazar</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Instalación Eléctrica</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">María González</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14/06/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Ver</button>
                      <button className="text-green-600 hover:text-green-800 mr-3">Aprobar</button>
                      <button className="text-red-600 hover:text-red-800">Rechazar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver todos →</button>
            </div>
          </div>

          {/* Reviews pendientes de moderación */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reviews pendientes de moderación</h2>
            <div className="space-y-4">
              {/* Datos de ejemplo */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Ana Martínez</p>
                    <p className="text-sm text-gray-500">Sobre: Servicio de Pintura</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-amber-500">★★★★☆</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">El servicio fue bueno pero el maestro llegó tarde. En general, quedé satisfecha con el trabajo realizado.</p>
                <div className="mt-2 flex justify-end space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Ver</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Aprobar</button>
                  <button className="text-red-600 hover:text-red-800 text-sm">Rechazar</button>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Carlos Soto</p>
                    <p className="text-sm text-gray-500">Sobre: Reparación de Techos</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-amber-500">★★★☆☆</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">El trabajo fue regular, esperaba mejor calidad por el precio pagado.</p>
                <div className="mt-2 flex justify-end space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Ver</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Aprobar</button>
                  <button className="text-red-600 hover:text-red-800 text-sm">Rechazar</button>
                </div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver todas →</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
