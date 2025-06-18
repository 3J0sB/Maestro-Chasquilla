'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import ConsumerSidebar from '@/components/layout/consumer-components/consumer-profile/consumer-sidebar'
import LoadingSpinner from '@/components/shared/loading-spinner'
import { toast } from 'react-hot-toast'

export default function ConsumerProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    // Load user data
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData()
    }
  }, [status, session, router])

  // Load user data
  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/consumer/user-info/${session?.user.id}`)

      if (!response.ok) {
        throw new Error('Error loading user data')
      }

      const data = await response.json()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Could not load your data')
    } finally {
      setLoading(false)
    }
  }

  // If loading, show spinner
  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row">        {/* Mobile sidebar */}
        <div className="md:hidden bg-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Mi Perfil</h1>
            <div className="flex space-x-4">
              <Link
                href="/services/consumer-profile/services"
                className={`p-2 ${pathname === '/services/consumer-profile/services' ? 'text-orange-500' : 'text-gray-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </Link>
              <Link
                href="/services/consumer-profile/messages"
                className={`p-2 ${pathname === '/services/consumer-profile/messages' ? 'text-orange-500' : 'text-gray-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </Link>
              <Link
                href="/services/consumer-profile/settings"
                className={`p-2 ${pathname === '/services/consumer-profile/settings' ? 'text-orange-500' : 'text-gray-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:block md:w-64">
          <ConsumerSidebar
            userName={session?.user?.name || ''}
            userLastName={session?.user?.lastName || ''}
            userImage={session?.user?.image || ''}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
