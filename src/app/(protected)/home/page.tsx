'use client'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/service-provider-sidebar';
import React from 'react';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/Access-denied/access-denied';


function Home() {
  const { data: session } = useSession();
  console.log("session", session)
  if (!session) {
    return <div>Loading...</div>;
  }
  if (session.user.role !== 'service-provider') {
    return <div><AccessDenied/></div>;
  }
  return (
    <div>
      <ServiceProviderSidebar />

      <div>

      </div>

    </div>
  )
}

export default Home