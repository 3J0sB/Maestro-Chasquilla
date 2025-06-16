import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderNotification } from '@/utils/notifications';

export async function POST(request: NextRequest) {
  try {

    const data = await request.json();
    const { message, serviceId, providerId, consumerId } = data; 
    console.log('Datos recibidos:', data);
    
    // Validaciones básicas
    if (!message || !serviceId || !providerId || !consumerId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    // Verificar que el servicio existe
    const service = await prisma.services.findUnique({
      where: { id: serviceId }
    });
    
    if (!service) {
      return NextResponse.json(
        { error: 'El servicio no existe' },
        { status: 404 }
      );
    }
    
    // Verificar que el proveedor existe
    const provider = await prisma.serviceProviderUser.findUnique({
      where: { id: providerId }
    });
    
    if (!provider) {
      return NextResponse.json(
        { error: 'El proveedor no existe' },
        { status: 404 }
      );
    }
      // Crear la solicitud de servicio
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        message,
        status: 'PENDING', // Estado inicial
        consumerId,
        providerId,
        serviceId,
      },
      include: {
        service: true,
        user: true
      }
    });

    // Crear notificación para el proveedor
    await createProviderNotification({
      providerId,
      type: 'REQUEST_NEW',
      title: 'Nueva solicitud de servicio',
      message: `${serviceRequest.user.name} ha solicitado tu servicio "${serviceRequest.service.title}"`,
      relatedId: serviceRequest.id,
      linkPath: `/service-provider/request?id=${serviceRequest.id}`,
      metadata: {
        userName: serviceRequest.user.name,
        userImage: serviceRequest.user.image,
        serviceTitle: serviceRequest.service.title
      }
    });
    
    return NextResponse.json({
      message: 'Solicitud enviada con éxito',
      serviceRequest
    });
    
  } catch (error) {
    console.error('Error al crear solicitud de servicio:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}