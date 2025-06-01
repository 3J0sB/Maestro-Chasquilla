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
    const [hasAlreadyRequested, setHasAlreadyRequested] = useState(false);
    const { id } = React.use(params)
    const { data: session, status } = useSession()

    // Función declarada fuera del useEffect
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

            // Establecer el providerId si existe
            if (serviceData && serviceData.user && serviceData.user.id) {
                setProviderId(serviceData.user.id)
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    // Función para obtener todas las reseñas del proveedor
    const fetchServiceReviews = async (pid: string) => {
        if (!pid) return; // No hacer la llamada si no hay ID

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

    // Nueva función para obtener las reseñas específicas del servicio actual
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

    // useEffect para cargar los detalles del servicio
    useEffect(() => {
        if (id) {
            fetchServiceDetails()
            fetchServiceSpecificReviews(id) // Obtener reseñas específicas del servicio
        }
    }, [id])

    // useEffect separado para las reseñas del proveedor, que depende del providerId
    useEffect(() => {
        if (providerId) {
            fetchServiceReviews(providerId)
        }
    }, [providerId])

    // Añadir esta función para comprobar si el usuario ya ha solicitado este servicio
    const checkIfUserHasRequested = async () => {
        if (!session?.user?.id || !id) return;
        
        try {
            const response = await fetch(`/api/consumer/request/hasRequested/${id}?userId=${session.user.id}`);
            const data = await response.json();
            setHasAlreadyRequested(data.hasRequested);
        } catch (error) {
            console.error('Error al verificar solicitud:', error);
        }
    };

    // Añadir este useEffect para verificar si el usuario ha solicitado el servicio
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
                />
                <div className='bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-start'>
                    <ServiceMainInfo
                        title={service.title}
                        serviceDescription={service.description}
                        servicePrice={service.price}
                        serviceTag1={service.serviceTag}
                        serviceTag2={service.serviceTag2}
                        serviceTag3={service.serviceTag3}
                        userImage={service.user.image}
                    />
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
                    </div>
                </div>

                <ServiceDetailDescription />

                {/* Modal de solicitud */}
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

                {/* Al final del componente, añadir el modal de reseña */}
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
            </div>
        </div>
    )
}

export default ServiceProfile