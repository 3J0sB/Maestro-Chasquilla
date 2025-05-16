'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/Access-denied/access-denied';
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar';
import HomeCards from '@/components/layout/Service-provider-components/Service-provider-home/service-provider-home-cards';

function Home() {
  const { status, data: session } = useSession();

  console.log(session)

  

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return <AccessDenied
      message="Esta área es solo para proveedores de servicios"
    />;
  }

  return (
    <div className="flex h-screen">
      <ServiceProviderSidebar
        userName={session?.user.name || ''}
        userType={session?.user.role || ''}
        userLastName={session?.user.lastName || ''}
      />

      <div className="flex-1 p-8 overflow-y-auto px-4 md:px-10 lg:px-20 xl:px-40">
        <h1 className="text-2xl font-bold mb-2">Panel de emprendedor</h1>
        <p className="mb-6">Bienvenido, {session?.user.name}!</p>

        <div className="mb-8">
          <HomeCards />
        </div>

        
      </div>
    </div>
  );
}

export default Home;