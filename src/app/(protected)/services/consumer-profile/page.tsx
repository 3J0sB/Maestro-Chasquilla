'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ConsumerSidebar from '@/components/layout/consumer-components/consumer-profile/consumer-sidebar'
import RequestedServicesTab from '@/components/layout/consumer-components/consumer-profile/requested-services-tab'
import UserSettingsTab from '@/components/layout/consumer-components/consumer-profile/user-settings-tab'
import LoadingSpinner from '@/components/shared/loading-spinner'
import { toast } from 'react-hot-toast'
import ConsumerMessagesComponent from '@/components/layout/consumer-components/consumer-messages/consumer-messages'

export default function ConsumerProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('services')
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Redireccionar si no está autenticado
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    // Cargar datos del usuario
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData()
    }
  }, [status, session, router])

  // Cargar datos del usuario
  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/consumer/user-info/${session?.user.id}`)

      if (!response.ok) {
        throw new Error('Error al cargar datos del usuario')
      }

      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('No se pudieron cargar tus datos')
    } finally {
      setLoading(false)
    }
  }

  // Renderiza el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return <RequestedServicesTab userId={session?.user?.id} />
      case 'messages':
        return <ConsumerMessagesComponent userId={session?.user?.id} />
      case 'settings':
        return <UserSettingsTab userData={userData} onUpdate={fetchUserData} />
      default:
        return <RequestedServicesTab userId={session?.user?.id} />
    }
  }

  // Si está cargando, muestra el spinner
  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar para dispositivos móviles */}
        <div className="md:hidden bg-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Mi Perfil</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('services')}
                className={`p-2 ${activeTab === 'services' ? 'text-orange-500' : 'text-gray-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`p-2 ${activeTab === 'messages' ? 'text-orange-500' : 'text-gray-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-2 ${activeTab === 'settings' ? 'text-orange-500' : 'text-gray-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar para escritorio */}
        <div className="hidden md:block md:w-64">
          <ConsumerSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userName={session?.user?.name || ''}
            userLastName={session?.user?.lastName || ''}
            userImage={session?.user?.image || ''}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Encabezado */}
            <h1 className="text-2xl font-bold text-gray-800 mb-6 hidden md:block">
              {activeTab === 'services' && 'Mis Servicios Solicitados'}
              {activeTab === 'messages' && 'Mis Mensajes'}
              {activeTab === 'settings' && 'Configuración de Perfil'}
            </h1>

            {/* Contenido dinámico según la pestaña seleccionada */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}