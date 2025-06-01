'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar';
import { serviceProvider } from '@/types';
import ProviderProfileHeader from '@/components/layout/consumer-components/provider-profile/provider-profile-header';
import ProviderAbout from '@/components/layout/consumer-components/provider-profile/provider-profile-about';
import ProviderServices from '@/components/layout/consumer-components/provider-profile/provider-profile-services';
import ProviderReviews from '@/components/layout/consumer-components/provider-profile/provider-profile-reviews';

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

function ServiceProviderProfile() {
    const { status, data: session } = useSession();
    const [reviewsData, setReviewsData] = useState<ProviderReviewsResponse | null>(null)
    const [provider, setProvider] = useState<serviceProvider>();
    const [loading, setLoading] = useState(true);
    const id = session?.user.id || '';

    const fetchProvider = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/consumer/single-provider/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener el perfil del proveedor');
            }

            const data = await response.json();
            setProvider(data);
            console.log('Datos del proveedor:', data);
        } catch (error) {
            console.error('Error fetching provider profile:', error);
        } finally {
            setLoading(false);
        }
    }
    const fetchProviderReviews = async () => {
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
        if (status === 'authenticated') {
            fetchProvider();
            fetchProviderReviews();
        }
    }, [status]);



    return (
        <div className='flex h-screen'>
            <ServiceProviderSidebar
                userName={session?.user.name || ''}
                userType={session?.user.role || ''}
                userLastName={session?.user.lastName || ''}
            />
            <div className='flex-1 overflow-y-auto bg-gray-50'>
                <div className='max-w-5xl mx-auto py-8 px-4'>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <div>
                            <ProviderProfileHeader
                                providerId={provider?.id || ''}
                                name={provider?.name || ''}
                                lastName={provider?.lastName || ''}
                                lastName2={provider?.lastName2 || ''}
                                image={provider?.image || '/img/miau.jpg'}
                                profession={'Proveedor de servicios'}
                                rating={reviewsData?.averageRating || 0}
                                reviewCount={reviewsData?.totalReviews || 0}
                                location={provider?.location?.city || ''}
                                isVerified={provider?.emailVerified || false}
                                role={session?.user.role || ''} // Assuming role is part of session.user
                            />
                            <ProviderAbout
                                description={provider?.description || ''}
                                providerName = {provider?.name || ''}
                            />
                            <ProviderServices
                                services={provider?.services || []}
 
                            />
                            <ProviderReviews
                                reviews={reviewsData?.reviews || []}
                                totalReviews={reviewsData?.totalReviews || 0}
                                averageRating={reviewsData?.averageRating || 0}
                                ratingBreakdown={reviewsData?.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
                            />
                        </div>

                    )}
                </div>
            </div>
        </div>
    )
}

export default ServiceProviderProfile