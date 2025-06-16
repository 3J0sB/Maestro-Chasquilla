import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderNotification } from '@/utils/notifications';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId } = body;
    
    if (!requestId) {
      return NextResponse.json({ error: 'ID de solicitud requerido' }, { status: 400 });
    }
    
    // Verificar la solicitud
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        service: {
          select: {
            userId: true,
            title: true,
          },
        },
        user: {
          select: {
            name: true,
            lastName: true,
            image: true,
          }
        }
      },
    });
    
    if (!serviceRequest) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }
    
    // Verificar que la solicitud esté en estado IN_PROGRESS
    if (serviceRequest.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'La solicitud debe estar en progreso para completarla' }, { status: 400 });
    }
    
    // Actualizar el estado de la solicitud
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date(),
      },
    });
    
    // Crear notificación para el proveedor
    await createProviderNotification({
      providerId: serviceRequest.providerId,
      type: 'REQUEST_COMPLETED',
      title: 'Servicio completado',
      message: `Has completado el servicio "${serviceRequest.service.title}" para ${serviceRequest.user.name}`,
      relatedId: serviceRequest.id,
      linkPath: `/service-provider/request?id=${serviceRequest.id}`,
      metadata: {
        userName: serviceRequest.user.name,
        userImage: serviceRequest.user.image,
        serviceTitle: serviceRequest.service.title,
        status: 'COMPLETED'
      }
    });
    
    return NextResponse.json({
      message: 'Servicio completado correctamente',
      request: updatedRequest,
    });
    
  } catch (error) {
    console.error('Error al completar el servicio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}