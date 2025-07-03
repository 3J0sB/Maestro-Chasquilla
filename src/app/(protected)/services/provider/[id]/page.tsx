/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import React, { use, useState, useEffect } from 'react'
import { serviceProvider } from '@/types'
import ConsumerHeader from '@/components/layout/consumer-components/consumer-header'

import Link from 'next/link'
import ProviderProfileHeader from '@/components/layout/consumer-components/provider-profile/provider-profile-header'
import ProviderServices from '@/components/layout/consumer-components/provider-profile/provider-profile-services'
import ProviderReviews from '@/components/layout/consumer-components/provider-profile/provider-profile-reviews'
import ProviderProfileAbout from '@/components/layout/consumer-components/provider-profile/provider-profile-about'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import ReportProviderModal from '@/components/layout/consumer-components/provider-profile/provider-profile-report-provider'

type ProviderProfileParams = {
  params: Promise<{ id: string }>
}

type ProviderReviewsResponse = {
  providerId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews: any[];
}

function ProviderProfile({ params }: ProviderProfileParams) {
  const [provider, setProvider] = useState<serviceProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewsData, setReviewsData] = useState<ProviderReviewsResponse | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const { data: session, status } = useSession() // Agregué status
  const { id } = use(params)

  const fetchProvider = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/consumer/single-provider/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener el proveedor')
      }

      const data = await response.json()
      setProvider(data)
      console.log('Datos del proveedor:', data)
    } catch (error) {
      console.error('Error fetching provider:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProviderReviews = async (id: string) => {
    try {
      const response = await fetch(`/api/consumer/provider-reviews/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (!response.ok) {
        throw new Error('Error al obtener las reseñas del proveedor')
      }
      const data = await response.json()
      console.log('Datos de las reseñas del proveedor:', data)
      setReviewsData(data)
    } catch (error) {
      console.error('Error fetching provider reviews:', error)

    }
  }
  useEffect(() => {
    if (id) {
      fetchProvider(id)
      fetchProviderReviews(id)
    }
  }, [id])

  const handleReportClick = () => {
    if (status === 'unauthenticated') {
      toast.error('Debes iniciar sesión para reportar proveedores')
      return
    }

    setIsReportModalOpen(true)
  }

  if (loading) {
    return (
      <div className='bg-gray-50 min-h-screen'>
        <ConsumerHeader />
        <div className="max-w-5xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className='bg-gray-50 min-h-screen'>
        <ConsumerHeader />
        <div className="max-w-5xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Proveedor no encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              Lo sentimos, no pudimos encontrar el proveedor que estás buscando.
            </p>
            <Link href="/services" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded">
              Volver a servicios
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ConsumerHeader />
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/services" className="hover:text-orange-500 transition-colors">
                Servicios
              </Link>
              <svg className="mx-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-700">
              {provider.name} {provider.lastName} {provider.lastName2}
            </li>
          </ol>
        </nav>

        <ProviderProfileHeader
          providerId={provider.id}
          name={provider.name || ''}
          lastName={provider.lastName}
          lastName2={provider.lastName2}
          image={provider.image}
          profession="Profesional de servicios"
          rating={reviewsData?.averageRating || 0}
          reviewCount={reviewsData?.totalReviews || 0}
          location={provider.location?.city || 'Ciudad no especificada'}
          isVerified={true}
          role={session?.user.role || ''}
          onReport={handleReportClick} // Cambié de () => setIsReportModalOpen(true) a handleReportClick
        />
        
        <ProviderProfileAbout
          description={provider.description || 'texto de ejemplo para la descripción del proveedor.'}
        />

        <ProviderServices services={provider.services || []} />

        <ProviderReviews
          totalReviews={reviewsData?.totalReviews || 0}
          averageRating={reviewsData?.averageRating || 0}
          ratingBreakdown={reviewsData?.ratingDistribution || {5: 0,4: 0,3: 0,2: 0,1: 0}}
          reviews={reviewsData?.reviews.map(review => ({
            ...review,
            reviewer: { name: review.user.name, image: review.user.image || 'https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png' },
            date: review.createdAt ? new Date(review.createdAt).toLocaleDateString('es-ES') : 'Fecha no disponible',
          }))}
        />

        {/* Modal de reporte - solo se renderiza si el usuario está autenticado */}
        {session && (
          <ReportProviderModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            providerId={provider.id}
            providerName={`${provider.name} ${provider.lastName} ${provider.lastName2}`.trim()}
          />
        )}
      </div>
    </div>
  )
}

export default ProviderProfile