'use client'

import { useSession } from 'next-auth/react'
import RequestedServicesTab from '@/components/layout/consumer-components/consumer-profile/requested-services-tab'

export default function ServicesPage() {
  const { data: session } = useSession()

  return (
    <>
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Mis Servicios Solicitados
      </h1>

      {/* Content */}
      <RequestedServicesTab userId={session?.user?.id} />
    </>
  )
}
