// Este archivo muestra cómo integrar las notificaciones en diferentes APIs existentes
import prisma from '@/lib/prisma';
import { createProviderNotification } from '@/utils/notifications';

/**
 * Ejemplo de cómo integrar las notificaciones al crear una nueva solicitud de servicio
 */
export async function createServiceRequestWithNotification(serviceRequestData: any) {
  try {
    // Aquí iría tu código actual para crear la solicitud de servicio
    const serviceRequest = await prisma.serviceRequest.create({
      data: serviceRequestData,
      include: {
        service: true,
        user: true,
      }
    });

    // Crear notificación para el proveedor
    await createProviderNotification({
      providerId: serviceRequest.providerId,
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

    return serviceRequest;
  } catch (error) {
    console.error('Error creando solicitud con notificación:', error);
    throw error;
  }
}

/**
 * Ejemplo de cómo integrar notificaciones al recibir una nueva reseña
 */
export async function createReviewWithNotification(reviewData: any) {
  try {
    // Código para crear la reseña
    const review = await prisma.reviews.create({
      data: reviewData,
      include: {
        service: {
          include: {
            user: true
          }
        },
        user: true
      }
    });

    // Notificar al proveedor
    await createProviderNotification({
      providerId: review.service.userId,
      type: 'REVIEW_NEW',
      title: 'Nueva reseña recibida',
      message: `${review.user.name} ha dejado una reseña de ${review.rating} estrellas para tu servicio "${review.service.title}"`,
      relatedId: review.id,
      linkPath: `/service-provider/profile`,
      metadata: {
        rating: review.rating,
        userName: review.user.name,
        serviceTitle: review.service.title
      }
    });

    return review;
  } catch (error) {
    console.error('Error creando reseña con notificación:', error);
    throw error;
  }
}

/**
 * Ejemplo de cómo integrar notificaciones al recibir un nuevo mensaje
 */
export async function createMessageWithNotification(messageData: any) {
  try {
    // Código para crear el mensaje
    const message = await prisma.messages.create({
      data: messageData,
      include: {
        conversation: {
          include: {
            user: true
          }
        }
      }
    });

    // Solo notificar si el remitente es el cliente (no el proveedor)
    if (messageData.senderType === 'USER') {
      await createProviderNotification({
        providerId: message.conversation.providerId,
        type: 'NEW_MESSAGE',
        title: 'Nuevo mensaje recibido',
        message: `${message.conversation.user.name} te ha enviado un nuevo mensaje`,
        relatedId: message.conversationId,
        linkPath: `/service-provider/messages?conversation=${message.conversationId}`,
        metadata: {
          userName: message.conversation.user.name,
          preview: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
        }
      });
    }

    return message;
  } catch (error) {
    console.error('Error creando mensaje con notificación:', error);
    throw error;
  }
}

/**
 * Ejemplo de cómo integrar notificaciones al cancelar una solicitud
 */
export async function cancelServiceRequestWithNotification(requestId: string, cancelledByUser: boolean) {
  try {
    // Código para cancelar la solicitud
    const serviceRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
      include: {
        service: true,
        user: true,
      }
    });

    if (cancelledByUser) {
      // Notificar al proveedor que el usuario canceló
      await createProviderNotification({
        providerId: serviceRequest.providerId,
        type: 'REQUEST_CANCELLED',
        title: 'Solicitud de servicio cancelada',
        message: `${serviceRequest.user.name} ha cancelado la solicitud para tu servicio "${serviceRequest.service.title}"`,
        relatedId: serviceRequest.id,
        linkPath: `/service-provider/request?id=${serviceRequest.id}`,
        metadata: {
          userName: serviceRequest.user.name,
          serviceTitle: serviceRequest.service.title
        }
      });
    }

    return serviceRequest;
  } catch (error) {
    console.error('Error cancelando solicitud con notificación:', error);
    throw error;
  }
}
