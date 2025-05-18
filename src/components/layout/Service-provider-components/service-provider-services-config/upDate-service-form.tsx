import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addServiceSchema } from '@/lib/zod'
import type { z } from 'zod'
import { useSession } from 'next-auth/react'
import { title } from 'process'

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
  }
}

interface Category {
  id: string;
  name: string;
}

function UpdateServiceForm({ onClose, onUpdate, serviceData }: UpdateServiceFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      console.log('Fetched categories:', data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    

    setValue('serviceName', serviceData.title);
    setValue('description', serviceData.description);
    setValue('price', serviceData.price.toString());
    setValue('category', serviceData.serviceTag || '');
  }, [serviceData, setValue]);


  const onSubmit = handleSubmit((data) => {
    setIsSubmitting(true);
    

    const updatedServiceData = {
      id: serviceData.id,
      title: data.serviceName,
      description: data.description,
      price: parseFloat(data.price),
      serviceTag: data.category,
      userId: session?.user.id,
    };

    console.log('Updated service data:', updatedServiceData);
    // Send the updated data to the server
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
        console.log('Service updated:', result);
        onUpdate();
        onClose();
      })
      .catch((error) => {
        console.error('Error updating service:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  });

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
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
          {/* Service Name */}
          <div className="mb-4">
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Servicio
            </label>
            <input
              id="serviceName"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.serviceName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter service name"
              {...register("serviceName")}
            />
            {errors.serviceName && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceName.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripcion
            </label>
            <textarea
              id="description"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe your service"
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Price and Duration */}
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
              Categoria
            </label>
            <select
              id="category"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              {...register("category")}
            >
              <option value="" disabled>Selecciona una Categoria</option>
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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
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