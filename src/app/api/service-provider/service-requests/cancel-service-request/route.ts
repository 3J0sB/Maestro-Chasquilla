import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderNotification } from '@/utils/notifications';
import { sendServiceCancelledEmail } from '@/lib/mail';
import { id } from 'date-fns/locale';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, cancelReason, cancelby } = body;

    if (!requestId) {
      return NextResponse.json({ error: 'ID de solicitud requerido' }, { status: 400 });
    }

    if (!cancelReason || cancelReason.trim() === '') {
      return NextResponse.json({ error: 'Se requiere una razón para cancelar' }, { status: 400 });
    }

    // Verificar la solicitud
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },

      include: {
        service: {
          select: {
            userId: true,
            title: true,
            user: {
              select: {
                email: true,
                name: true,
                lastName: true,
              }
            }
          },
        },
        user: {
          select: {
            name: true,
            lastName: true,
            image: true,
            email: true,
          }
        }
      },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }

    // Verificar que la solicitud no esté ya completada o cancelada
    if (['COMPLETED', 'CANCELLED', 'REJECTED'].includes(serviceRequest.status)) {
      return NextResponse.json({ error: 'No se puede cancelar una solicitud que ya está completada, cancelada o rechazada' }, { status: 400 });
    }

    // Actualizar el estado de la solicitud
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });

    // Crear notificación para el proveedor
    await createProviderNotification({
      providerId: serviceRequest.providerId,
      type: 'REQUEST_CANCELLED',
      title: 'Servicio cancelado',
      message: `Has cancelado el servicio "${serviceRequest.service.title}" para ${serviceRequest.user.name}`,
      relatedId: serviceRequest.id,
      linkPath: `/service-provider/request?id=${serviceRequest.id}`,
      metadata: {
        userName: serviceRequest.user.name,
        userImage: serviceRequest.user.image,
        serviceTitle: serviceRequest.service.title,
        status: 'CANCELLED',
        reason: cancelReason
      }
    });

    if (cancelby === 'consumer') {
      await sendServiceCancelledEmail(
        serviceRequest.service.user.email,
        (serviceRequest.service.user.name||"") + ' ' + (serviceRequest.service.user.lastName || ""),
        serviceRequest.service.title,
        (serviceRequest.user.name||"") + ' ' + (serviceRequest.user.lastName || ""),
        cancelReason,
        cancelby,
      );
    }else{
      await sendServiceCancelledEmail(
        serviceRequest.user.email,
        (serviceRequest.user.name||"") + ' ' + (serviceRequest.user.lastName || ""),
        serviceRequest.service.title,
        (serviceRequest.service.user.name||"") + ' ' + (serviceRequest.service.user.lastName || ""),
        cancelReason,
        cancelby,
      );
    }

    return NextResponse.json({
      message: 'Servicio cancelado correctamente',
      request: updatedRequest,
    });

  } catch (error) {
    console.error('Error al cancelar el servicio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}