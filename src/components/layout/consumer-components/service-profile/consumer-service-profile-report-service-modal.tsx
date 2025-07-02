'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

interface ReportServiceModalProps {
  isOpen: boolean
  onClose: () => void
  serviceId: string
  serviceName: string
}

const REPORT_REASONS = [
  'Contenido inapropiado',
  'Información falsa o engañosa',
  'Precios abusivos',
  'Servicio de baja calidad',
  'Comportamiento inadecuado del proveedor',
  'Spam o publicidad no deseada',
  'Violación de términos de servicio',
  'Otro'
]

export default function ReportServiceModal({ isOpen, onClose, serviceId, serviceName }: ReportServiceModalProps) {
  const { data: session } = useSession()
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      toast.error('Debes iniciar sesión para reportar')
      return
    }

    if (!reason.trim()) {
      toast.error('Por favor selecciona un motivo')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/consumer/reports/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          reason: reason.trim(),
          description: description.trim() || null,
          reporterId: session.user.id
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al enviar el reporte')
      }

      toast.success('Reporte enviado correctamente')
      handleClose()
    } catch (error) {
      console.error('Error al reportar servicio:', error)
      toast.error(error instanceof Error ? error.message : 'Error al enviar el reporte')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setReason('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Reportar servicio
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Service Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Servicio a reportar:</p>
            <p className="font-medium text-gray-900 truncate">{serviceName}</p>
          </div>

          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Motivo del reporte *
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reasonOption) => (
                <label key={reasonOption} className="flex items-center">
                  <input
                    type="radio"
                    name="reason"
                    value={reasonOption}
                    checked={reason === reasonOption}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-700">{reasonOption}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción adicional (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Proporciona más detalles sobre el problema..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 caracteres
            </p>
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  Importante
                </p>
                <p className="text-sm text-yellow-700">
                  Los reportes falsos o malintencionados pueden resultar en la suspensión de tu cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Enviar reporte'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}