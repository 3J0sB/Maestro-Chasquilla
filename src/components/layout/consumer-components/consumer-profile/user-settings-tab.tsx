'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'

interface UserData {
  id: string
  name: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  image?: string
}

interface UserSettingsTabProps {
  userData: UserData | null
  onUpdate: () => void
}

export default function UserSettingsTab({ userData, onUpdate }: UserSettingsTabProps) {
  const { update } = useSession()
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    city: userData?.city || '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(userData?.image || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe exceder los 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error al subir la imagen')
      }

      const data = await response.json()
      setImageUrl(data.imageUrl)
      toast.success('Imagen subida correctamente')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/consumer/user-info/${userData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil')
      }

      // Actualizar sesión
      await update({
        ...formData,
        image: imageUrl,
      })

      onUpdate()
      toast.success('Perfil actualizado correctamente')
      setIsEditing(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar el perfil')
    }
  }

  const cancelEdit = () => {
    setFormData({
      name: userData?.name || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || '',
      city: userData?.city || '',
    })
    setImageUrl(userData?.image || '')
    setIsEditing(false)
  }

  if (!userData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No se pudieron cargar los datos del usuario</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imagen de perfil */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Foto de perfil"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 text-3xl font-bold">
                  {formData.name.charAt(0)}{formData.lastName.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-white text-sm"
                  disabled={isUploading}
                >
                  {isUploading ? 'Subiendo...' : 'Cambiar foto'}
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <p className="mt-2 text-xs text-gray-500">
              Haz clic en la imagen para cambiar tu foto
            </p>
          </div>

          {/* Campos de formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* Vista perfil mejorada */}
          <div className="relative">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-2xl h-32"></div>
            
            {/* Contenido del perfil */}
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header con gradiente */}
              <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
              
              {/* Información del usuario */}
              <div className="relative px-8 pb-8">
                {/* Foto de perfil */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-white p-2 shadow-lg">
                    {userData.image ? (
                      <Image
                        src={userData.image}
                        alt="Foto de perfil"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white text-3xl font-bold rounded-full shadow-inner">
                        {userData.name.charAt(0)}{userData.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Nombre y email */}
                <div className="pt-20 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {userData.name} {userData.lastName}
                  </h2>
                  <p className="text-gray-500 mb-4 flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teléfono */}
                <div className="group">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 hover:shadow-md">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 002-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</p>
                      <p className="text-gray-900 font-medium">
                        {userData.phone || (
                          <span className="text-gray-400 italic">No especificado</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div className="group">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 hover:shadow-md">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dirección</p>
                      <p className="text-gray-900 font-medium">
                        {userData.address || (
                          <span className="text-gray-400 italic">No especificada</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ciudad */}
                <div className="group md:col-span-2">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 hover:shadow-md">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ciudad</p>
                      <p className="text-gray-900 font-medium">
                        {userData.city || (
                          <span className="text-gray-400 italic">No especificada</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de editar mejorado */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsEditing(true)}
              className="group relative px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar perfil
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-200"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}