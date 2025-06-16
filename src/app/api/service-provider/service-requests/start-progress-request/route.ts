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
        service: true,
        user: true,
      },
    });
    
    if (!serviceRequest) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }
    
    // Verificar que la solicitud esté en estado ACCEPTED
    if (serviceRequest.status !== 'ACCEPTED') {
      return NextResponse.json({ error: 'La solicitud debe estar aceptada para iniciar el trabajo' }, { status: 400 });
    }
    
    // Actualizar el estado de la solicitud
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: 'IN_PROGRESS',
        updatedAt: new Date(),
      },
      include: {
        service: true,
        user: true,
      }
    });
    
    // Crear notificación para el proveedor
    await createProviderNotification({
      providerId: updatedRequest.providerId,
      type: 'REQUEST_IN_PROGRESS',
      title: 'Servicio iniciado',
      message: `Has iniciado el trabajo para ${updatedRequest.user.name} en tu servicio "${updatedRequest.service.title}"`,
      relatedId: updatedRequest.id,
      linkPath: `/service-provider/request?id=${updatedRequest.id}`,
      metadata: {
        userName: updatedRequest.user.name,
        userImage: updatedRequest.user.image,
        serviceTitle: updatedRequest.service.title,
        status: 'IN_PROGRESS'
      }
    });

    
    return NextResponse.json({
      message: 'Servicio iniciado correctamente',
      request: updatedRequest,
    });
    
  } catch (error) {
    console.error('Error al iniciar el servicio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}