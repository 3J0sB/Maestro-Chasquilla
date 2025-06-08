'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import UserSettingsTab from '@/components/layout/consumer-components/consumer-profile/user-settings-tab'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '@/components/shared/loading-spinner'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
    }
  }, [session])

  // Load user data
  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/consumer/user-info/${session?.user.id}`)

      if (!response.ok) {
        throw new Error('Error loading user data')
      }

      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Could not load your data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Configuración de Perfil
      </h1>

      {/* Content */}
      <UserSettingsTab userData={userData} onUpdate={fetchUserData} />
    </>
  )
}
