/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addServiceSchema } from '@/lib/zod'
import { z } from 'zod'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { max } from 'date-fns'

// Use the type from zod schema
type FormInputs = z.infer<typeof addServiceSchema>

interface AddServiceFormProps {
  onClose: () => void;
  onSave: (serviceData: any) => void;
}

interface Category {
  id: string;
  name: string;
}

function AddServiceForm({ onClose, onSave }: AddServiceFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      serviceName: '',
      description: '',
      smallDescription: '',
      price: '',
      category: '',
      maxServicePrice: '',
      minServicePrice: '',
    }
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/service-provider/service-categories');
      if (!response.ok) {
        throw new Error('Error fetching categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form submission handler
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsUploading(true);
      let imageUrl = null;

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir la imagen');
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.imageUrl;
      }

      // Create service data object
      const serviceData = {
        title: data.serviceName,
        description: data.description,
        price: parseFloat(data.price || '0'),
        maxServicePrice: parseFloat(data.maxServicePrice || '0'),
        minServicePrice: parseFloat(data.minServicePrice || '0'),
        serviceTag: data.category,
        smallDescription: data.smallDescription, 
        userId: session?.user.id,
        image: imageUrl,
      };

      // Create service
      const response = await fetch('/api/service-provider/services/add-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el servicio');
      }

      const result = await response.json();
      console.log('Service created:', result);
      onSave(result);
      onClose();
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Error al crear el servicio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  });

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Añadir Nuevo Servicio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6">
          {/* Service Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del Servicio
            </label>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xs">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Haz clic para subir una imagen</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF hasta 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Service Name */}
          <div className="mb-4">
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Servicio
            </label>
            <input
              id="serviceName"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.serviceName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej: Instalación de grifería"
              {...register("serviceName")}
            />
            {errors.serviceName && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceName.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="smallDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción Breve
            </label>
            <input
              id="smallDescription"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.smallDescription ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Breve resumen del servicio (máx. 100 caracteres)"
              maxLength={100}
              {...register("smallDescription")}
            />
            {errors.smallDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.smallDescription.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Una descripción corta que aparecerá en las tarjetas de servicios
            </p>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe detalladamente tu servicio"
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Price, Min Price, Max Price y Category (en fila en pantallas grandes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Precio base */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio base
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  className={`w-full pl-7 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0.00"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="category"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                {...register("category")}
              >
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Precio mínimo */}
            <div>
              <label htmlFor="minServicePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio mínimo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="minServicePrice"
                  min="0"
                  step="0.01"
                  className={`w-full pl-7 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.minServicePrice ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0.00"
                  {...register("minServicePrice")}
                />
                {errors.minServicePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.minServicePrice.message}</p>
                )}
              </div>
            </div>

            {/* Precio máximo */}
            <div>
              <label htmlFor="maxServicePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="maxServicePrice"
                  min="0"
                  step="0.01"
                  className={`w-full pl-7 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.maxServicePrice ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0.00"
                  {...register("maxServicePrice")}
                />
                {errors.maxServicePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxServicePrice.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                'Guardar Servicio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddServiceForm