"use client"

import React, { useState, useEffect } from 'react'
import { service } from '@/types'
import ConsumerHeader from '@/components/layout/consumer-components/consumer-header'
import ServiceProfileHeader from '@/components/layout/consumer-components/service-profile/consumer-service-profile-header'
import ServiceMainInfo from '@/components/layout/consumer-components/service-profile/consumer-service-profile-mainInfo'
import ServiceDetailDescription from '@/components/layout/consumer-components/service-profile/consumer-service-profile-description'
import Link from 'next/link'


type ServiceProfileParams = {
    params: Promise<{ id: string }>
}

function ServiceProfile({ params }: ServiceProfileParams) {
    const [service, setService] = useState<service | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { id } = React.use(params)

    useEffect(() => {
        async function fetchServiceDetails() {
            try {
                setLoading(true)
                const response = await fetch(`/api/consumer/single-service?id=${id}`)

                if (!response.ok) {
                    throw new Error('No se pudo obtener la información del servicio')
                }

                const data = await response.json()
                const serviceData = Array.isArray(data) ? data[0] : data

                if (!serviceData) {
                    throw new Error('Servicio no encontrado')
                }

                setService(serviceData)
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error desconocido')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchServiceDetails()
        }
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <ConsumerHeader />
                <div className="max-w-5xl mx-auto py-16 px-4">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-gray-50">
                <ConsumerHeader />
                <div className="max-w-5xl mx-auto py-16 px-4">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {error || 'Servicio no encontrado'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Lo sentimos, no pudimos encontrar el servicio que estás buscando.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ConsumerHeader />
            <div className="max-w-5xl mx-auto py-8 px-4">
                {/* Breadcrums */}
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
                        <li className="text-orange-500 truncate max-w-xs" title={service.title}>
                            {service.title}
                        </li>
                    </ol>
                </nav>
                <ServiceProfileHeader  
                    providerId={service.user.id}
                    providerName = {service.user.name}
                    providerLastName = {service.user.lastName}
                    providerLastName2 = {service.user.lastName2}

                />
                <ServiceMainInfo 
                    title={service.title}
                    serviceDescription={service.description}
                    servicePrice={service.price}
                    serviceTag1={service.serviceTag}
                    serviceTag2={service.serviceTag2}
                    serviceTag3={service.serviceTag3}
                    userImage={service.user.image}
                />
                <ServiceDetailDescription />
            </div>
        </div>
    )
}

export default ServiceProfile