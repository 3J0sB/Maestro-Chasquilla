/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/layout/Service-provider-components/service-provider-dashboard/dashboard-header';
import StatCards from '@/components/layout/Service-provider-components/service-provider-dashboard/dashboard-stat-card';
import RequestsChart from '@/components/layout/Service-provider-components/service-provider-dashboard/dashboard-request-chart';
import RatingsDistribution from '@/components/layout/Service-provider-components/service-provider-dashboard/dashboard-rating-distribution';
import TopServices from '@/components/layout/Service-provider-components/service-provider-dashboard/dashboard-top-services';
import RequestStatusChart from '@/components/layout/Service-provider-components/service-provider-dashboard/dashboard-request-status-chart';
import RecentReviews from '@/components/layout/Service-provider-components/service-provider-dashboard/dashboard-recent-reviews';
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar';


export default function ProviderDashboard() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session, timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/service-provider/dashboard?timeRange=${timeRange}&providerId=${session?.user.id}`);
      const data = await response.json();
      // console.log('Dashboard data:', data);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {/* <LoadingSpinner size="lg" /> */}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Acceso denegado. Debes iniciar sesión como proveedor de servicios.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - ahora está incluida en el contenedor flex principal */}
      <ServiceProviderSidebar
        userName={session?.user.name || ''}
        userType={session?.user.role || ''}
        userLastName={session?.user.lastName || ''}
        userImage={session?.user.image || ''}
      />

      {/* Contenido principal - flex-1 para que ocupe el espacio restante */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          providerName={session.user.name || 'Proveedor'}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Control</h1>

          {dashboardData ? (
            <>
              <StatCards stats={dashboardData.stats} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <RequestsChart data={dashboardData.requestsTrend} />
                <RatingsDistribution data={dashboardData.ratingsDistribution} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-1">
                  <TopServices services={dashboardData.topServices} />
                </div>
                <div className="lg:col-span-2">
                  <RequestStatusChart data={dashboardData.requestsByStatus} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
                <RecentReviews reviews={dashboardData.recentReviews} />
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p>No se pudieron cargar los datos del dashboard.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}