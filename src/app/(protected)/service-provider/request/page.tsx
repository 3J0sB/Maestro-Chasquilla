'use client'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar'
import React from 'react'
import { useSession } from 'next-auth/react'

function RequestPage() {
  const { status, data: session } = useSession()

  return (
    <div className='flex h-screen'>
      <ServiceProviderSidebar
        userName={session?.user.name || ''}
        userType={session?.user.role || ''}
      />
    <div className="flex-1 p-8 overflow-y-auto px-4 md:px-10 lg:px-20 xl:px-40">
      <h1>REQUEST PAGE</h1>
    </div >


    </div>
  )
}

export default RequestPage