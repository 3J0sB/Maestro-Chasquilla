'use client'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar'
import React from 'react'
import { useSession } from 'next-auth/react'
import ProviderMessagesComponent from '@/components/layout/Service-provider-components/service-provider-messages/provider-messages';


function ProviderMessages() {
    const { status, data: session } = useSession();
    
  return (
    <div className='flex h-screen'>
        <ServiceProviderSidebar
            userName={session?.user.name || ''}
            userType={session?.user.role || ''}
            userLastName={session?.user.lastName || ''}
        />
        <div>
            <ProviderMessagesComponent/>
        </div>
    </div>
  )
}

export default ProviderMessages