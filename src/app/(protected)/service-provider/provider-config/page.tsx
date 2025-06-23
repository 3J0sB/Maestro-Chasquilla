/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/
'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar'
import ProfileInfoForm from '@/components/layout/Service-provider-components/service-provider-config/profile-info-form'
import LoadingSpinner from '@/components/shared/loading-spinner'
import { toast } from 'react-hot-toast'

function ProviderConfiguration() {
    const { data: session, status, update } = useSession()
    console.log('Session data:', session)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [providerData, setProviderData] = useState(null)

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            fetchProviderData()
        } else if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, session])

    const fetchProviderData = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/service-provider/profile?providerId=${session?.user.id}`)
            if (!response.ok) throw new Error('Error al cargar los datos del perfil')

            const data = await response.json()
            console.log('Provider data:', data)
            setProviderData(data)
        } catch (error) {
            console.error('Error fetching provider data:', error)
            toast.error('No pudimos cargar tu información de perfil')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateProfile = async (formData: any) => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/service-provider/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId: session?.user.id,
                    ...formData
                }),
            })

            if (!response.ok) throw new Error('Error al actualizar el perfil')

            const updatedData = await response.json()
            setProviderData(updatedData)

            // Actualizar la sesión con los nuevos datos
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: formData.name,
                    lastName: formData.lastName,
                    lastName2: formData.lastName2,
                    image: updatedData.image,
                }
            })

            toast.success('Perfil actualizado correctamente')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('No pudimos actualizar tu perfil')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : providerData ? (
                            <div className="bg-white shadow rounded-lg p-6">
                                <ProfileInfoForm
                                    initialData={providerData}
                                    onSubmit={handleUpdateProfile}
                                    isLoading={isLoading}
                                />
                            </div>
                        ) : (
                            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-yellow-700">
                                No pudimos cargar tu información. Por favor, intenta de nuevo más tarde.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProviderConfiguration