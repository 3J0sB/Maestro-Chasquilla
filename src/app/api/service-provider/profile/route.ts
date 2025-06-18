import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export async function GET(request: NextRequest) {
  try {


    // Obtener providerId de la query o usar el ID de la sesión
    const url = new URL(request.url)
    const providerId = url.searchParams.get('providerId') 
    
    // Validar que sea el mismo usuario o un administrador

    
    // Obtener datos del proveedor
    const provider = await prisma.serviceProviderUser.findUnique({
      where: {
        id: providerId || undefined,
        deletedAt: null,
      },
      include: {
        location: true,
      },
    })
    
    if (!provider) {
      return NextResponse.json({ error: 'Proveedor no encontrado' }, { status: 404 })
    }
    
    // Ocultar datos sensibles
    const {  ...providerData } = provider
    
    return NextResponse.json(providerData)
  } catch (error) {
    console.error('Error obteniendo perfil del proveedor:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {

    
    const body = await request.json()
    const { providerId, name, lastName, lastName2, about, description, image, location, areasOfExpertise } = body
    
    const updatedProvider = await prisma.$transaction(async (tx) => {
      // Primero actualizar el proveedor
      const provider = await tx.serviceProviderUser.update({
        where: {
          id: providerId,
        },
        data: {
          name,
          lastName,
          lastName2,
          about,
          description,
          areasOfExpertise,
          ...(image && { image }),
        },
        include: {
          location: true,
        },
      })
      
      // Si hay datos de ubicación, actualizar o crear
      if (location) {
        if (provider.locationId) {
          // Actualizar ubicación existente
          await tx.location.update({
            where: {
              id: provider.locationId,
            },
            data: {
              country: location.country,
              region: location.region,
              city: location.city,
              address: location.address,
              latitude: location.latitude || 0,
              longitude: location.longitude || 0,
            },
          })
        } else {
          // Crear nueva ubicación
          const newLocation = await tx.location.create({
            data: {
              country: location.country,
              region: location.region,
              city: location.city,
              address: location.address,
              latitude: location.latitude || 0,
              longitude: location.longitude || 0,
            },
          })
          
          // Conectar ubicación al proveedor
          await tx.serviceProviderUser.update({
            where: {
              id: providerId,
            },
            data: {
              locationId: newLocation.id,
            },
          })
        }
      }
      
      // Obtener datos actualizados
      return await tx.serviceProviderUser.findUnique({
        where: {
          id: providerId,
        },
        include: {
          location: true,
        },
      })
    })
    
    if (!updatedProvider) {
      return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
    }
    
    // Ocultar datos sensibles
    const {  ...providerData } = updatedProvider
    
    return NextResponse.json(providerData)
  } catch (error) {
    console.error('Error actualizando perfil del proveedor:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}