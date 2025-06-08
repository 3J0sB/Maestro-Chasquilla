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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
        <div className="space-y-6">
          {/* Vista perfil */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              {userData.image ? (
                <Image
                  src={userData.image}
                  alt="Foto de perfil"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 text-3xl font-bold">
                  {userData.name.charAt(0)}{userData.lastName.charAt(0)}
                </div>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-800">{userData.name} {userData.lastName}</h2>
            <p className="text-gray-500">{userData.email}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="text-gray-800">{userData.phone || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="text-gray-800">{userData.address || 'No especificada'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ciudad</p>
              <p className="text-gray-800">{userData.city || 'No especificada'}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Editar perfil
            </button>
          </div>
        </div>
      )}
    </div>
  )
}