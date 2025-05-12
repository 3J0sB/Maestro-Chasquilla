'use client'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar'
import React from 'react'
import { useSession } from 'next-auth/react'
import AccessDenied from '@/components/Access-denied/access-denied'

function ServiceConfig() {
    const { status, data: session } = useSession()

    if (!session || session.user.role !== 'SERVICE_PROVIDER') {
        return <AccessDenied
            message="Esta área es solo para proveedores de servicios"
        />;
    }
    return (
        <div className='flex h-screen'>
            <ServiceProviderSidebar
                userName={session?.user.name || ''}
                userType={session?.user.role || ''}
            />

        </div>
    )
}

export default ServiceConfig