import React, { useState, useEffect, use } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addServiceSchema } from '@/lib/zod'
import { set, type z } from 'zod'
import { useSession } from 'next-auth/react'
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
  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormInputs>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      serviceName: '',
      description: '',
      price: '',
      category: '',
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
      console.log('Fetched categories:', data);
    } catch (error) {
      console.error('Error fetching categories:', error);

    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Form submission handler - now uses the Zod validated data
  const onSubmit = handleSubmit((data) => {
    // Create object with the service data
    const serviceData = {
      name: data.serviceName,
      description: data.description,
      price: parseFloat(data.price),
      serviceTag: data.category,
      userId: session?.user.id,
    };

    const res = fetch('/api/service-provider/services/add-service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Service created:', data);
        onSave(serviceData);
        onClose();
      })
      .catch((error) => {
        console.error('Error creating service:', error);
      });
    });
    





  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Service</h2>
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

          {/* Price and Duration (in row for larger screens) */}
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
          </div>

          {/* Category and Status (in row for larger screens) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Category */}
            <div>
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

            {/* Status */}

          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddServiceForm