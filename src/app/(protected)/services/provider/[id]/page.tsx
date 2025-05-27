'use client'

import React, { use, useState, useEffect } from 'react'
import { serviceProvider } from '@/types'
import ConsumerHeader from '@/components/layout/consumer-components/consumer-header'

import Link from 'next/link'
import ProviderProfileHeader from '@/components/layout/consumer-components/provider-profile/provider-profile-header'
import ProviderServices from '@/components/layout/consumer-components/provider-profile/provider-profile-services'
import ProviderReviews from '@/components/layout/consumer-components/provider-profile/provider-profile-reviews'
import ProviderProfileAbout from '@/components/layout/consumer-components/provider-profile/provider-profile-about'

type ProviderProfileParams = {
  params: Promise<{ id: string }>
}

function ProviderProfile({ params }: ProviderProfileParams) {
  const [provider, setProvider] = useState<serviceProvider | null>(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    if (id) {
      fetchProvider(id)
    }
  }, [id])

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

  // Calcular promedio de ratings de todos los servicios
  const allReviews = provider.services?.flatMap(service => service.reviews || []) || []
  const averageRating = allReviews.length > 0
    ? allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length
    : 0

  // Para los ratings detallados
  const ratingBreakdown = {
    5: allReviews.filter(r => r.rating === 5).length,
    4: allReviews.filter(r => r.rating === 4).length,
    3: allReviews.filter(r => r.rating === 3).length,
    2: allReviews.filter(r => r.rating === 2).length,
    1: allReviews.filter(r => r.rating === 1).length,
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
          name={provider.name || ''}
          lastName={provider.lastName}
          lastName2={provider.lastName2}
          image={provider.image}
          profession="Profesional de servicios"
          rating={averageRating}
          reviewCount={allReviews.length}
          location="Talca, Chile"
          isVerified={true}
        />
        <ProviderProfileAbout
          description={provider.description || 'texto de ejemplo para la descripción del proveedor.'}
          tags={provider.tags || ['Servicio de calidad', 'Atención al cliente', 'Rápido y confiable']}
        />

        <ProviderServices services={provider.services || []} />

        <ProviderReviews
          totalReviews={allReviews.length}
          averageRating={averageRating}
          ratingBreakdown={ratingBreakdown}
          categoryRatings={{
            quality: 4.9,
            timeliness: 4.7,
            communication: 4.8,
            value: 4.6
          }}
          reviews={allReviews.map(review => ({
            ...review,
            reviewer: { name: "Cliente" }
          }))}
        />
      </div>
    </div>
  )
}

export default ProviderProfile