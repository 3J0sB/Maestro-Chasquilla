'use client'

import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

type RequestFormInputs = {
  message: string
  termsAccepted: boolean
}

type RequestModalProps = {
  isOpen: boolean
  onClose: () => void
  serviceId: string
  providerId: string
  serviceTitle: string
}

function RequestModal({ isOpen, onClose, serviceId, providerId, serviceTitle }: RequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestFormInputs>()

  if (!isOpen) return null

  const onSubmit: SubmitHandler<RequestFormInputs> = async (data) => {
    if (!session?.user) {
      toast.error('Debes iniciar sesión para solicitar servicios')
      return
    }

    try {
      setIsSubmitting(true)
      
      const requestData = {
        message: data.message,
        serviceId,
        providerId,
        consumerId: session.user.id, // Asegúrate de tener el ID del usuario en la sesión
        status: 'PENDING' // Estado inicial de la solicitud
      }
      
      const response = await fetch('/api/consumer/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      
      if (!response.ok) {
        throw new Error('Error al enviar la solicitud')
      }
      
      toast.success('Solicitud enviada con éxito')
      reset()
      onClose()
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      toast.error('No se pudo enviar la solicitud. Inténtalo de nuevo más tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay de fondo oscuro */}
      <div 
        className="fixed inset-0 bg-black/25 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-xl font-semibold text-gray-800">Solicitar servicio</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
          
          {/* Contenido */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-2">
                Solicitud para: <span className="font-bold">{serviceTitle}</span>
              </h3>
              <p className="text-gray-600 text-sm">
                Completa los detalles de tu solicitud para enviarla al proveedor.
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-1">
                  Mensaje al proveedor <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  className={`w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 min-h-[120px]`}
                  placeholder="Describe lo que necesitas, incluye detalles relevantes como ubicación, fecha deseada, y cualquier requisito específico..."
                  {...register('message', { 
                    required: 'Este campo es obligatorio',
                    minLength: { value: 20, message: 'Escribe al menos 20 caracteres' }  
                  })}
                  disabled={isSubmitting}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="termsAccepted"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded"
                      {...register('termsAccepted', { required: 'Debes aceptar los términos' })}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="termsAccepted" className="text-sm text-gray-600">
                      Acepto los <a href="#" className="text-orange-500 hover:underline">términos y condiciones</a> y la <a href="#" className="text-orange-500 hover:underline">política de privacidad</a>. <span className="text-red-500">*</span>
                    </label>
                    {errors.termsAccepted && (
                      <p className="text-red-500 text-xs mt-1">{errors.termsAccepted.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 border-t pt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.93A8.003 8.003 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-3.008z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar solicitud'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestModal