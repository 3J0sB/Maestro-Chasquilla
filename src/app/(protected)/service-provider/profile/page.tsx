'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar';
import { serviceProvider } from '@/types';
import ProviderProfileHeader from '@/components/layout/consumer-components/provider-profile/provider-profile-header';

function ServiceProviderProfile() {
    const { status, data: session } = useSession();
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

    useEffect(() => {
        if (status === 'authenticated') {
            fetchProvider();
        }
    }, [status]);

    const allReviews = provider?.services?.flatMap(service => service.reviews || []) || []
    const averageRating = allReviews.length > 0
        ? allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length
        : 0
    console.log(allReviews)
    // Para los ratings detallados
    const ratingBreakdown = {
        5: allReviews.filter(r => r.rating === 5).length,
        4: allReviews.filter(r => r.rating === 4).length,
        3: allReviews.filter(r => r.rating === 3).length,
        2: allReviews.filter(r => r.rating === 2).length,
        1: allReviews.filter(r => r.rating === 1).length,
    }


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
                        <ProviderProfileHeader
                            name={provider?.name || ''}
                            lastName={provider?.lastName || ''}
                            lastName2={provider?.lastName2 || ''}
                            image={provider?.image || '/img/miau.jpg'}
                            profession={'Proveedor de servicios'}
                            rating={averageRating}
                            reviewCount={allReviews.length}
                            location="Talca, Chile"
                            isVerified={provider?.emailVerified || false}
                            role={session?.user.role || ''} // Assuming role is part of session.user
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ServiceProviderProfile