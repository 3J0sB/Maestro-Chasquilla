'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar'


function ProviderConfiguration() {
    const { data: session, status } = useSession()
    return (
        <div className="flex h-screen bg-gray-50">
            <ServiceProviderSidebar
                userName={session?.user.name || ''}
                userType={session?.user.role || ''}
                userLastName={session?.user.lastName || ''}
            />
        </div>
    )
}

export default ProviderConfiguration