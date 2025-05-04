'use client'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/service-provider-sidebar';
import React from 'react';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/Access-denied/access-denied';

function Home() {
  const { status ,data: session } = useSession();
  console.log("before session")
  console.log(status);
  console.table(session);

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
       />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Panel de emprendedor</h1>
        <p>Bienvenido, {session?.user.name}!</p>

      </div>
    </div>
  );
}

export default Home;