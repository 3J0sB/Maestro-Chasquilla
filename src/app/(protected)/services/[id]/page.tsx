/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/

'use client'
import React, { useState, useEffect } from 'react'
import { service } from '@/types'
import ConsumerHeader from '@/components/layout/consumer-components/consumer-header'
import ServiceProfileHeader from '@/components/layout/consumer-components/service-profile/consumer-service-profile-header'
import ServiceMainInfo from '@/components/layout/consumer-components/service-profile/consumer-service-profile-mainInfo'
import ServiceDetailDescription from '@/components/layout/consumer-components/service-profile/consumer-service-profile-description'
import RequestModal from '@/components/layout/consumer-components/request-modal/request-modal'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import ProviderReviews from '@/components/layout/consumer-components/provider-profile/provider-profile-reviews'
import AddReviewModal from '@/components/layout/consumer-components/service-profile/consumer-service-profile-add-review'
import ReportServiceModal from '@/components/layout/consumer-components/service-profile/consumer-service-profile-report-service-modal'


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

type ServiceReviewsResponse = {
    serviceId: string;
    serviceName: string;
    providerId: string;
    providerName: string;
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

type ServiceProfileParams = {
    params: Promise<{ id: string }>
}

function ServiceProfile({ params }: ServiceProfileParams) {
    const [service, setService] = useState<service | null>(null)
    const [reviewsData, setReviewsData] = useState<ProviderReviewsResponse | null>(null)
    const [serviceReviewsData, setServiceReviewsData] = useState<ServiceReviewsResponse | null>(null)
    const [providerId, setProviderId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [hasAlreadyRequested, setHasAlreadyRequested] = useState(false);
    const { id } = React.use(params)
    const { data: session, status } = useSession()


    const fetchServiceDetails = async () => {
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

            console.log('Datos del servicio:', serviceData)
            setService(serviceData)


            if (serviceData && serviceData.user && serviceData.user.id) {
                setProviderId(serviceData.user.id)
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    
    const fetchServiceReviews = async (pid: string) => {
        if (!pid) return; 

        try {
            const response = await fetch(`/api/consumer/provider-reviews/${pid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error('No se pudieron obtener las reseñas del proveedor')
            }

            const reviews = await response.json()
            setReviewsData(reviews)
            console.log('Reseñas del proveedor:', reviews)

        } catch (error) {
            console.error('Error al obtener reseñas del proveedor:', error)
        }
    }


    const fetchServiceSpecificReviews = async (serviceId: string) => {
        if (!serviceId) return;

        try {
            const response = await fetch(`/api/consumer/provider-reviews/service/${serviceId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('No se pudieron obtener las reseñas específicas del servicio');
            }

            const serviceReviews = await response.json();
            setServiceReviewsData(serviceReviews);
            console.log('Reseñas específicas del servicio:', serviceReviews);

        } catch (error) {
            console.error('Error al obtener reseñas específicas del servicio:', error);
        }
    }


    useEffect(() => {
        if (id) {
            fetchServiceDetails()
            fetchServiceSpecificReviews(id) 
        }
    }, [id])

 
    useEffect(() => {
        if (providerId) {
            fetchServiceReviews(providerId)
        }
    }, [providerId])


    const checkIfUserHasRequested = async () => {
        if (!session?.user?.id || !id) return;
        
        try {
            const response = await fetch(`/api/consumer/request/hasRequested/${id}?userId=${session.user.id}`);
            const data = await response.json();
            console.log('Respuesta de verificación de solicitud:', data);
            setHasAlreadyRequested(data.hasRequested);
        } catch (error) {
            console.error('Error al verificar solicitud:', error);
        }
    };


    useEffect(() => {
        if (session?.user?.id && id) {
            checkIfUserHasRequested();
        }
    }, [session, id]);

    const handleRequestClick = () => {
        if (status === 'unauthenticated') {
            toast.error('Debes iniciar sesión para solicitar servicios')
            return
        }

        setIsModalOpen(true)
    }

        const handleReportClick = () => {
        if (status === 'unauthenticated') {
            toast.error('Debes iniciar sesión para reportar servicios')
            return
        }

        setIsReportModalOpen(true)
    }

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
                    providerName={service.user.name}
                    providerLastName={service.user.lastName}
                    providerLastName2={service.user.lastName2}
                    providerRating={reviewsData?.averageRating || 0}
                    providerRatingCount={reviewsData?.totalReviews || 0}
                    providerImage={service.user.image || 'https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png'}
                    areaOfExpertise={service.user.areasOfExpertise}
                />
                <div className='bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-start'>
                    <ServiceMainInfo
                        title={service.title}
                        serviceSmallDescription={service.smallDescription}
                        servicePrice={service.price}
                        serviceTag1={service.serviceTag}
                        serviceTag2={service.serviceTag2}
                        serviceTag3={service.serviceTag3}
                        userImage={service.user.image}
                    />

                    {session && session.user.role == 'USER' && (
                        <div className="flex flex-col gap-2">
                        <button
                            onClick={handleRequestClick}
                            className="mt-4 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            Solicitar servicio
                        </button>
                        
                        {hasAlreadyRequested && (
                          <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 font-medium py-2 px-4 rounded transition-colors"
                          >
                            Dejar reseña
                          </button>
                        )}

                        {/* Botón de reportar */}
                        <button
                            onClick={handleReportClick}
                            className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Reportar
                        </button>
                    </div>

                    )}
                    
                </div>

                <ServiceDetailDescription
                    description = {service.description}
                    serviceImage={service.image ? service.image : 'https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png'}
                />

     
                <RequestModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    serviceId={service.id}
                    providerId={service.user.id}
                    serviceTitle={service.title}
                />

                <ProviderReviews
 
                    reviews={serviceReviewsData?.reviews || []}
                    averageRating={serviceReviewsData?.averageRating || 0}
                    totalReviews={serviceReviewsData?.totalReviews || 0}
                    ratingBreakdown={serviceReviewsData?.ratingDistribution || {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}}
                />

                <AddReviewModal
                  isOpen={isReviewModalOpen}
                  onClose={() => setIsReviewModalOpen(false)}
                  serviceId={service.id}
                  serviceName={service.title}
                  onReviewAdded={() => {
                    // Recargar las reseñas después de añadir una nueva
                    fetchServiceSpecificReviews(id);
                  }}
                />

                {/* Modal de reporte */}
                <ReportServiceModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    serviceId={service.id}
                    serviceName={service.title}
                />
            </div>
        </div>
    )
}

export default ServiceProfile