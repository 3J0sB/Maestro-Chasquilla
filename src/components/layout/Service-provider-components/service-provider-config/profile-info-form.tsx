'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import LoadingSpinner from '@/components/shared/loading-spinner'

interface LocationData {
  id?: string
  country: string
  region: string
  city: string
  address: string
  latitude: number
  longitude: number
}

interface ProfileData {
  id: string
  name: string
  lastName: string
  lastName2: string
  email: string
  rut: string
  image: string | null
  about: string | null
  description: string | null
  location: LocationData | null
}

interface ProfileInfoFormProps {
  initialData: ProfileData
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    lastName: initialData.lastName || '',
    lastName2: initialData.lastName2 || '',
    about: initialData.about || '',
    description: initialData.description || '',
    location: {
      country: initialData.location?.country || 'Chile',
      region: initialData.location?.region || '',
      city: initialData.location?.city || '',
      address: initialData.location?.address || '',
      latitude: initialData.location?.latitude || 0,
      longitude: initialData.location?.longitude || 0,
    },
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.image)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validar tamaño y tipo de archivo
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB')
      return
    }
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido')
      return
    }
    
    setImageFile(file)
    
    // Crear preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Crear FormData si hay imagen
    if (imageFile) {
      const formDataWithImage = new FormData()
      formDataWithImage.append('image', imageFile)
      
      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataWithImage
        })
        
        if (!uploadResponse.ok) throw new Error('Error al subir la imagen')
        
        const { imageUrl } = await uploadResponse.json()
        
        // Enviar el resto de los datos con la URL de la imagen
        await onSubmit({
          ...formData,
          image: imageUrl
        })
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Error al subir la imagen. Inténtalo de nuevo.')
      }
    } else {
      // Enviar solo los datos del formulario sin imagen
      await onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Información personal</h2>
        
        {/* Foto de perfil */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {imagePreview ? (
                <Image 
                  src={imagePreview} 
                  alt="Foto de perfil" 
                  width={128} 
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow hover:bg-orange-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500">Formatos aceptados: JPG, PNG. Máximo 5MB.</p>
        </div>
        
        {/* Datos personales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
            <input
              type="text"
              name="lastName2"
              value={formData.lastName2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
            <input
              type="text"
              value={initialData.rut}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">El RUT no puede ser modificado</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={initialData.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">El correo no puede ser modificado</p>
          </div>
        </div>
      </div>
      
      {/* Información profesional */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Información profesional</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título profesional</label>
            <input
              type="text"
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Ej: Maestro Gasfíter con 10 años de experiencia"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción profesional</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe tu experiencia, habilidades y especialidades..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">Esta descripción será visible en tu perfil público</p>
          </div>
        </div>
      </div>
      
      {/* Información de ubicación */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ubicación</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input
              type="text"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
            <input
              type="text"
              name="location.region"
              value={formData.location.region}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Tu dirección exacta no será pública. Solo utilizamos esta información para mostrarte en búsquedas cercanas.
        </p>
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
          onClick={() => window.history.back()}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <LoadingSpinner size="sm" color="white" />
              <span className="ml-2">Guardando...</span>
            </span>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>
    </form>
  )
}

export default ProfileInfoForm