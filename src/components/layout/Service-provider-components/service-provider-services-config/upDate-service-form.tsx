import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addServiceSchema } from '@/lib/zod'
import type { z } from 'zod'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

// Use the same schema as add-service-form for now
type FormInputs = z.infer<typeof addServiceSchema>

interface UpdateServiceFormProps {
  onClose: () => void;
  onUpdate: () => void;
  serviceData: {
    id: string;
    title: string;
    description: string;
    price: number;
    serviceTag?: string;
    image?: string;
    smallDescription?: string;
  }
}

interface Category {
  id: string;
  name: string;
}

function UpdateServiceForm({ onClose, onUpdate, serviceData }: UpdateServiceFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(serviceData.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const { data: session } = useSession();

  // Initialize form with the existing service data
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormInputs>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      serviceName: serviceData.title,
      description: serviceData.description,
      smallDescription: serviceData.smallDescription || '',
      price: serviceData.price.toString(),
      category: serviceData.serviceTag || '',
    }
  });

  // Fetch categories
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
  };

  useEffect(() => {
    fetchCategories();
    
    setValue('serviceName', serviceData.title);
    setValue('smallDescription', serviceData.smallDescription || '');
    setValue('description', serviceData.description);
    setValue('price', serviceData.price.toString());
    setValue('category', serviceData.serviceTag || '');
    setImageUrl(serviceData.image || '');
  }, [serviceData, setValue]);

  // Función para subir imagen utilizando el endpoint api/upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe exceder los 5MB');
      toast.error('La imagen no debe exceder los 5MB');
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setUploadError('El archivo debe ser una imagen');
      toast.error('El archivo debe ser una imagen');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Crear FormData y adjuntar la imagen
      const formData = new FormData();
      formData.append('image', file);

      // Enviar al endpoint de API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Error al subir la imagen. Inténtalo de nuevo.');
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    toast.success('Imagen eliminada');
  };

  const onSubmit = handleSubmit((data) => {
    setIsSubmitting(true);
    
    const updatedServiceData = {
      id: serviceData.id,
      title: data.serviceName,
      smallDescription: data.smallDescription,
      description: data.description,
      price: parseFloat(data.price),
      serviceTag: data.category,
      userId: session?.user.id,
      image: imageUrl, // Incluir la URL de la imagen
    };
    console.log('Updated Service Data:', updatedServiceData);
    // Enviar datos actualizados al servidor
    fetch(`/api/service-provider/services/update-service`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedServiceData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((result) => {
        toast.success('Servicio actualizado correctamente');
        onUpdate();
        onClose();
      })
      .catch((error) => {
        console.error('Error updating service:', error);
        toast.error('Error al actualizar el servicio');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  });

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Actualizar Servicio</h2>
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
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del Servicio
            </label>
            
            {/* Área de carga de imagen */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all hover:border-orange-400">
              {imageUrl ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-md overflow-hidden">
                    <Image 
                      src={imageUrl} 
                      alt="Vista previa" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    aria-label="Eliminar imagen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-500">
                    Haz clic para seleccionar una imagen
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WEBP hasta 5MB
                  </p>
                </div>
              )}
            </div>
            
            {/* Input de archivo oculto */}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploading}
            />
            
            {/* Estado de carga y botón */}
            <div className="mt-3 flex items-center justify-between">
              {isUploading ? (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="animate-spin h-4 w-4 text-orange-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subiendo imagen...
                </div>
              ) : (
                <div>
                  {imageUrl ? (
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Cambiar imagen
                      </div>
                    </label>
                  ) : (
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-md hover:bg-orange-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Subir imagen
                      </div>
                    </label>
                  )}
                </div>
              )}
            </div>
            
            {/* Error message */}
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
          </div>

          {/* Service Name */}
          <div className="mb-4">
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Servicio
            </label>
            <input
              id="serviceName"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.serviceName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ingresa el nombre del servicio"
              {...register("serviceName")}
            />
            {errors.serviceName && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceName.message}</p>
            )}
          </div>

          {/* Small Description */}
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
              placeholder="Describe tu servicio"
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Price and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio
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
            
            {/* Status - Optional additional field */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 border-gray-300"
              >
                <option value="Active">Activo</option>
                <option value="Inactive">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              id="category"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              {...register("category")}
            >
              <option value="" disabled>Selecciona una Categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </>
              ) : (
                'Actualizar Servicio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateServiceForm;