'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '@/components/shared/loading-spinner'
import { useSession } from 'next-auth/react'
import { serviceRequest } from '@/types'
import { formatDate, formatShortDate } from '../../../../../utils'
import MessageModal from '@/components/layout/consumer-components/consumer-messages/message-modal'

interface RequestedServicesTabProps {
    userId: string | undefined
}

export default function RequestedServicesTab({ userId }: RequestedServicesTabProps) {
    const { data: session } = useSession()
    const [requests, setRequests] = useState<serviceRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')
    const router = useRouter()
    
    // Estados para el modal de mensaje
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<serviceRequest | null>(null)

    useEffect(() => {
        if (userId) {
            fetchRequests()
        }
    }, [userId])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/consumer/requested-services/${session?.user.id}`)

            if (!response.ok) {
                throw new Error('Error al cargar los servicios solicitados')
            }

            const data = await response.json()
            console.log('Fetched requests:', data)
            setRequests(data)
        } catch (error) {
            console.error('Error:', error)
            toast.error('No se pudieron cargar tus servicios solicitados')
        } finally {
            setLoading(false)
        }
    }

    // Abrir modal de mensaje
    const openMessageModal = (request: serviceRequest) => {
        setSelectedRequest(request)
        setIsModalOpen(true)
    }

    // Filtrar solicitudes por estado
    const filteredRequests = statusFilter === 'all'
        ? requests
        : requests.filter(req => req.status === statusFilter)

    // Cancelar solicitud
    const cancelRequest = async (requestId: string) => {
        if (!confirm('¿Estás seguro de que quieres cancelar esta solicitud?')) {
            return
        }

        try {
            const response = await fetch(`/api/service-provider/service-requests/cancel-service-request`, {
                method: 'PUT',
                body: JSON.stringify({
                    requestId,
                    cancelReason: 'El usuario ha cancelado la solicitud'
                }),
            })

            if (!response.ok) {
                console.error('Error al cancelar la solicitud:', response.statusText)
                throw new Error('Error al cancelar la solicitud')
            }

            // Actualizar la lista de solicitudes
            fetchRequests()
            toast.success('Solicitud cancelada correctamente')
        } catch (error) {
            console.error('Error:', error)
            toast.error('No se pudo cancelar la solicitud')
        }
    }

    // Obtener texto y color según el estado
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'PENDING':
                return { text: 'Pendiente', color: 'bg-blue-100 text-blue-700', progress: 25 }
            case 'ACCEPTED':
                return { text: 'Aceptada', color: 'bg-green-100 text-green-700', progress: 50 }
            case 'IN_PROGRESS':
                return { text: 'En Progreso', color: 'bg-yellow-100 text-yellow-800', progress: 75 }
            case 'COMPLETED':
                return { text: 'Completado', color: 'bg-green-500 text-white', progress: 100 }
            case 'CANCELLED':
                return { text: 'Cancelada', color: 'bg-red-100 text-red-700', progress: 0 }
            case 'REJECTED':
                return { text: 'Rechazada', color: 'bg-gray-100 text-gray-700', progress: 0 }
            default:
                return { text: 'Desconocido', color: 'bg-gray-100 text-gray-700', progress: 0 }
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            {/* Filtros */}
            <div className="flex flex-wrap gap-3 mb-6">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        statusFilter === 'all'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Todos los estados
                </button>
                <button
                    onClick={() => setStatusFilter('PENDING')}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        statusFilter === 'PENDING'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Pendientes
                </button>
                <button
                    onClick={() => setStatusFilter('ACCEPTED')}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        statusFilter === 'ACCEPTED'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Aceptados
                </button>
                <button
                    onClick={() => setStatusFilter('IN_PROGRESS')}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        statusFilter === 'IN_PROGRESS'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    En Progreso
                </button>
                <button
                    onClick={() => setStatusFilter('COMPLETED')}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        statusFilter === 'COMPLETED'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Completados
                </button>
                <button
                    onClick={() => setStatusFilter('CANCELLED')}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        statusFilter === 'CANCELLED'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Cancelados
                </button>
            </div>

            {/* Listado de servicios */}
            {filteredRequests.length === 0 ? (
                <div className="text-center py-10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    <p className="mt-4 text-gray-600">No hay servicios solicitados {statusFilter !== 'all' ? 'con este estado' : ''}</p>
                    <button
                        onClick={() => router.push('/services')}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                        Explorar Servicios
                    </button>
                </div>
            ) : (
                // Diseño en grid responsivo con 3 columnas
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map((request) => {
                        const statusInfo = getStatusInfo(request.status);

                        return (
                            <div key={request.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-all duration-300">
                                {/* Cabecera con información del usuario y estado */}
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">
                                                {request.service.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {request.service.user?.name || 'Usuario'} {request.service.user?.lastName || ''}
                                                </p>
                                                <p className="text-xs text-gray-500">{request.service?.title || 'Sin título'}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                            {statusInfo.text}
                                        </span>
                                    </div>

                                    {/* Barra de progreso */}
                                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mt-4 mb-2">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
                                            style={{ width: `${statusInfo.progress}%` }}
                                        ></div>
                                    </div>

                                    {/* Fecha de solicitud */}
                                    <div className="flex items-center text-xs text-gray-500 mt-2">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Recibido: {formatDate(request.createdAt)}
                                    </div>
                                </div>

                                {/* Cuerpo de la tarjeta */}
                                <div className="p-4">
                                    {/* Descripción breve o detalles del servicio */}
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {request.message || `Servicio de ${request.service?.title} solicitado a ${request.service.user?.name} ${request.service.user?.lastName}`}
                                    </p>

                                    {/* Precio */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-500">Precio del servicio:</span>
                                        <span className="text-lg font-bold text-gray-900">
                                            ${(request.service?.price ?? 0).toLocaleString('es-CL')}
                                        </span>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex flex-col gap-2">
                                        {/* Para el estado PENDING */}
                                        {request.status === 'PENDING' && (
                                            <button
                                                onClick={() => cancelRequest(request.id)}
                                                className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        )}

                                        {/* Para el estado ACCEPTED */}
                                        {request.status === 'ACCEPTED' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openMessageModal(request)}
                                                    className="flex-1 text-center px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    Mensaje
                                                </button>
                                                <button
                                                    onClick={() => cancelRequest(request.id)}
                                                    className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}

                                        {/* Para el estado IN_PROGRESS */}
                                        {request.status === 'IN_PROGRESS' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openMessageModal(request)}
                                                    className="flex-1 text-center px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    Mensaje
                                                </button>
                                                <button
                                                    onClick={() => cancelRequest(request.id)}
                                                    className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}

                                        {/* Para el estado COMPLETED */}
                                        {request.status === 'COMPLETED' && (
                                            <Link href={`/services/${request.service?.id}`}
                                                className="w-full text-center px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors">
                                                Dejar Reseña
                                            </Link>
                                        )}

                                        {/* Para los estados CANCELLED o REJECTED */}
                                        {(request.status === 'CANCELLED' || request.status === 'REJECTED') && (
                                            <Link href={`/services/${request.service?.id}`}
                                                className="w-full text-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                                Ver Detalles
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modal de mensajes */}
            {selectedRequest && (
                <MessageModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    providerId={selectedRequest.service.user?.id || ''}
                    userId={session?.user.id || ''}
                    providerName={`${selectedRequest.service.user?.name || ''} ${selectedRequest.service.user?.lastName || ''}`}
                    providerImage={selectedRequest.service.user?.image || undefined}
                    serviceTitle={selectedRequest.service?.title || ''}
                    requestId={selectedRequest.id}
                />
            )}
        </div>
    )
}