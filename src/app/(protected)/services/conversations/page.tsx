'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import ConsumerHeader from '@/components/layout/consumer-components/consumer-header'
import ConsumerMessagesComponent from '@/components/layout/consumer-components/consumer-messages/consumer-messages';

function ConsumerMessages() {
    const { status, data: session } = useSession();
    
    return (
        <div className='flex flex-col h-screen'>
            <ConsumerHeader />
            <div className="flex-1 overflow-hidden">
                {status === 'authenticated' && (
                    <ConsumerMessagesComponent userId={session.user.id} />
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

export default ConsumerMessages