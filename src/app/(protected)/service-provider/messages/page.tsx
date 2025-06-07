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
                userImage={session?.user.image || ''}
            />
            <div className="flex-1 overflow-hidden">
                {status === 'authenticated' && (
                    <ProviderMessagesComponent providerId={session.user.id} />
                )}
                {status === 'loading' && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                )}
                {status === 'unauthenticated' && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-red-500">Debes iniciar sesión para ver los mensajes</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProviderMessages