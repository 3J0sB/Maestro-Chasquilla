'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Session } from 'next-auth'
import AdminLayout from './admin-layout'

interface ServiceReport {
    id: string
    reason: string
    description: string
    status: 'PENDING' | 'REVIEWED' | 'DISMISSED'
    createdAt: string
    reporter: {
        id: string
        email: string
    }
    service: {
        id: string
        title: string
        description: string
        user: {
            id: string
            email: string
            name: string
            lastName: string
        }
    }
}

interface ServiceProviderReport {
    id: string
    reason: string
    description: string
    status: 'PENDING' | 'REVIEWED' | 'DISMISSED'
    createdAt: string
    reporter: {
        id: string
        email: string
    }
    provider: {
        id: string
        email: string
        name: string
        lastName: string
    }
}

interface Props {
    session: Session
}

const AdminReportsModeration: React.FC<Props> = ({ session }) => {
    const [serviceReports, setServiceReports] = useState<ServiceReport[]>([])
    const [providerReports, setProviderReports] = useState<ServiceProviderReport[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState<ServiceReport | ServiceProviderReport | null>(null)
    const [reportType, setReportType] = useState<'service' | 'provider' | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'services' | 'providers'>('services')

    const fetchReports = async () => {
        try {
            setLoading(true)
            const [serviceReportsRes, providerReportsRes] = await Promise.all([
                fetch('/api/admin/reports/services'),
                fetch('/api/admin/reports/providers')
            ])

            if (serviceReportsRes.ok) {
                const serviceReportsData = await serviceReportsRes.json()
                setServiceReports(serviceReportsData.reports || [])
            }

            if (providerReportsRes.ok) {
                const providerReportsData = await providerReportsRes.json()
                setProviderReports(providerReportsData.reports || [])
            }
        } catch (error) {
            console.error('Error fetching reports:', error)
            toast.error('Error al cargar los reportes')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    const handleViewReport = (report: ServiceReport | ServiceProviderReport, type: 'service' | 'provider') => {
        setSelectedReport(report)
        setReportType(type)
        setIsModalOpen(true)
    }

    const handleDismissReport = async (reportId: string, type: 'service' | 'provider') => {
        try {
            const response = await fetch(`/api/admin/reports/${type}s/${reportId}/dismiss`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                toast.success('Reporte desestimado exitosamente')
                fetchReports() // Refresh the list
                setIsModalOpen(false)
            } else {
                toast.error('Error al desestimar el reporte')
            }
        } catch (error) {
            console.error('Error dismissing report:', error)
            toast.error('Error al desestimar el reporte')
        }
    }

    const handleRejectService = async (serviceId: string, reportId: string) => {
        try {
            const response = await fetch(`/api/admin/reports/services/${reportId}/reject-service`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                toast.success('Servicio rechazado exitosamente')
                fetchReports() // Refresh the list
                setIsModalOpen(false)
            } else {
                toast.error('Error al rechazar el servicio')
            }
        } catch (error) {
            console.error('Error rejecting service:', error)
            toast.error('Error al rechazar el servicio')
        }
    }

    const handleDeactivateProvider = async (providerId: string, reportId: string) => {
        try {
            const response = await fetch(`/api/admin/reports/providers/${reportId}/deactivate-provider`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                toast.success('Proveedor desactivado exitosamente')
                fetchReports() // Refresh the list
                setIsModalOpen(false)
            } else {
                toast.error('Error al desactivar el proveedor')
            }
        } catch (error) {
            console.error('Error deactivating provider:', error)
            toast.error('Error al desactivar el proveedor')
        }
    }

    const getReasonLabel = (reason: string) => {
        const reasonMap: { [key: string]: string } = {
            'INAPPROPRIATE_CONTENT': 'Contenido inapropiado',
            'SCAM': 'Estafa',
            'POOR_SERVICE': 'Servicio deficiente',
            'SPAM': 'Spam',
            'FAKE_PROFILE': 'Perfil falso',
            'OTHER': 'Otro'
        }
        return reasonMap[reason] || reason
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Cargando reportes...</div>
            </div>
        )
    }

    return (
        <AdminLayout session={session}>
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Moderación de Reportes</h1>
                    <p className="text-gray-600">Gestiona los reportes de servicios y proveedores</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'services'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Reportes de Servicios ({serviceReports.filter(r => r.status === 'PENDING').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('providers')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'providers'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Reportes de Proveedores ({providerReports.filter(r => r.status === 'PENDING').length})
                        </button>
                    </nav>
                </div>

                {/* Service Reports Tab */}
                {activeTab === 'services' && (
                    <div className="space-y-4">
                        {serviceReports.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="p-6 text-center">
                                    <p className="text-gray-500">No hay reportes de servicios</p>
                                </div>
                            </div>
                        ) : (
                            serviceReports.map((report) => (
                                <div key={report.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{report.service.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Proveedor: {report.service.user.name} {report.service.user.lastName}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        report.status === 'REVIEWED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {report.status === 'PENDING' ? 'Pendiente' :
                                                    report.status === 'REVIEWED' ? 'Revisado' : 'Desestimado'}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <p><strong>Motivo:</strong> {getReasonLabel(report.reason)}</p>
                                            <p><strong>Reportado por:</strong> {report.reporter.email}</p>
                                            <p><strong>Fecha:</strong> {formatDistanceToNow(new Date(report.createdAt), {
                                                addSuffix: true,
                                                locale: es
                                            })}</p>
                                            {report.description && (
                                                <p><strong>Descripción:</strong> {report.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                onClick={() => handleViewReport(report, 'service')}
                                            >
                                                Ver Detalles
                                            </button>
                                            {report.status === 'PENDING' && (
                                                <button
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    onClick={() => handleDismissReport(report.id, 'service')}
                                                >
                                                    Desestimar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Provider Reports Tab */}
                {activeTab === 'providers' && (
                    <div className="space-y-4">
                        {providerReports.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="p-6 text-center">
                                    <p className="text-gray-500">No hay reportes de proveedores</p>
                                </div>
                            </div>
                        ) : (
                            providerReports.map((report) => (
                                <div key={report.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {report.provider.name} {report.provider.lastName}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Email: {report.provider.email}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        report.status === 'REVIEWED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {report.status === 'PENDING' ? 'Pendiente' :
                                                    report.status === 'REVIEWED' ? 'Revisado' : 'Desestimado'}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <p><strong>Motivo:</strong> {getReasonLabel(report.reason)}</p>
                                            <p><strong>Reportado por:</strong> {report.reporter.email}</p>
                                            <p><strong>Fecha:</strong> {formatDistanceToNow(new Date(report.createdAt), {
                                                addSuffix: true,
                                                locale: es
                                            })}</p>
                                            {report.description && (
                                                <p><strong>Descripción:</strong> {report.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                onClick={() => handleViewReport(report, 'provider')}
                                            >
                                                Ver Detalles
                                            </button>
                                            {report.status === 'PENDING' && (
                                                <button
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    onClick={() => handleDismissReport(report.id, 'provider')}
                                                >
                                                    Desestimar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Report Details Modal */}
                {isModalOpen && selectedReport && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Detalles del Reporte {reportType === 'service' ? 'de Servicio' : 'de Proveedor'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong>Estado:</strong>
                                        <span
                                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedReport.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    selectedReport.status === 'REVIEWED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {selectedReport.status === 'PENDING' ? 'Pendiente' :
                                                selectedReport.status === 'REVIEWED' ? 'Revisado' : 'Desestimado'}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Motivo:</strong> {getReasonLabel(selectedReport.reason)}
                                    </div>
                                    <div>
                                        <strong>Reportado por:</strong> {selectedReport.reporter.email}
                                    </div>
                                    <div>
                                        <strong>Fecha:</strong> {formatDistanceToNow(new Date(selectedReport.createdAt), {
                                            addSuffix: true,
                                            locale: es
                                        })}
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {reportType === 'service' && 'service' in selectedReport && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Información del Servicio</h4>
                                        <div className="space-y-2">
                                            <p><strong>Título:</strong> {selectedReport.service.title}</p>
                                            <p><strong>Descripción:</strong> {selectedReport.service.description}</p>
                                            <p><strong>Proveedor:</strong> {selectedReport.service.user.name} {selectedReport.service.user.lastName}</p>
                                            <p><strong>Email del Proveedor:</strong> {selectedReport.service.user.email}</p>
                                        </div>
                                    </div>
                                )}

                                {reportType === 'provider' && 'provider' in selectedReport && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Información del Proveedor</h4>
                                        <div className="space-y-2">
                                            <p><strong>Nombre:</strong> {selectedReport.provider.name} {selectedReport.provider.lastName}</p>
                                            <p><strong>Email:</strong> {selectedReport.provider.email}</p>
                                        </div>
                                    </div>
                                )}

                                <hr className="border-gray-200" />

                                <div>
                                    <h4 className="font-semibold mb-2">Descripción del Reporte</h4>
                                    <p className="text-gray-700">{selectedReport.description || 'Sin descripción adicional'}</p>
                                </div>

                                {selectedReport.status === 'PENDING' && (
                                    <>
                                        <hr className="border-gray-200" />
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                onClick={() => handleDismissReport(selectedReport.id, reportType!)}
                                            >
                                                Desestimar Reporte
                                            </button>

                                            {reportType === 'service' && 'service' in selectedReport && (
                                                <button
                                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    onClick={() => handleRejectService(selectedReport.service.id, selectedReport.id)}
                                                >
                                                    Rechazar Servicio
                                                </button>
                                            )}

                                            {reportType === 'provider' && 'provider' in selectedReport && (
                                                <button
                                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    onClick={() => handleDeactivateProvider(selectedReport.provider.id, selectedReport.id)}
                                                >
                                                    Desactivar Proveedor
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminReportsModeration
