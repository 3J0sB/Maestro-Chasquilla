'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/shared/loading-spinner'

export default function ConsumerProfilePage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    // Redirect to services subpage if authenticated
    if (status === 'authenticated') {
      router.push('/services/consumer-profile/services')
    }
  }, [status, router])

  // Show loading spinner while checking authentication or redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}