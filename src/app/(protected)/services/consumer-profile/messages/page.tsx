'use client'

import { useSession } from 'next-auth/react'
import ConsumerMessagesComponent from '@/components/layout/consumer-components/consumer-messages/consumer-messages'

export default function MessagesPage() {
  const { data: session } = useSession()

  return (
    <>
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Mis Mensajes
      </h1>

      {/* Content */}
      <ConsumerMessagesComponent userId={session?.user?.id} />
    </>
  )
}
