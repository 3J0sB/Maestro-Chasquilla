import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderNotification } from '@/utils/notifications';

export async function GET(request: NextRequest ){
    try {
        const serviceAndReviews = await prisma.services.findMany({
            include: {
                reviews: {
                    include: {
                        user: true
                    }
                },

            }
        })

        if (!serviceAndReviews) {
            return NextResponse.json({ error: "No services found" }, { status: 404 });
        }
        
        return NextResponse.json(serviceAndReviews);

    } catch (error) {
        console.error("Error fetching services and reviews:", error);
        return NextResponse.json({ error: "Error fetching services and reviews" }, { status: 500 });
        
    }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, userId, rating, comment } = body;

    // Validar datos requeridos
    if (!serviceId || !userId || !rating) {
      return NextResponse.json(
        { error: 'Se requieren el ID del servicio, ID del usuario y calificación' },
        { status: 400 }
      );
    }

    // Validar que el rating sea un número entre 1 y 5
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La calificación debe ser un número entre 1 y 5' },
        { status: 400 }
      );
    }

    // Verificar que el servicio existe
    const service = await prisma.services.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'El servicio no existe' },
        { status: 404 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'El usuario no existe' },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya ha dejado una reseña para este servicio
    const existingReview = await prisma.reviews.findFirst({
      where: {
        serviceId,
        userId,
        deletedAt: null,
      },
    });

    if (existingReview) {      // Actualizar la reseña existente en lugar de crear una nueva
      const updatedReview = await prisma.reviews.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment: comment || null,
          updatedAt: new Date(),
        },
      });

      // Obtener información para la notificación
      const serviceWithProvider = await prisma.services.findUnique({
        where: { id: serviceId },
        include: {
          user: true  // Esto obtiene el provider
        }
      });

      const reviewer = await prisma.user.findUnique({
        where: { id: userId }
      });

      // Enviar notificación al proveedor sobre la actualización de la reseña
      if (serviceWithProvider && serviceWithProvider.user) {
        await createProviderNotification({
          providerId: serviceWithProvider.user.id,
          type: 'REVIEW_NEW',
          title: 'Reseña actualizada',
          message: `${reviewer?.name || 'Un usuario'} ha actualizado su reseña a ${rating} estrellas para tu servicio "${serviceWithProvider.title}"`,
          relatedId: updatedReview.id,
          linkPath: `/service-provider/profile`,
          metadata: {
            rating: rating,
            userName: reviewer?.name,
            userImage: reviewer?.image,
            serviceTitle: serviceWithProvider.title,
            isUpdate: true
          }
        });
      }

      return NextResponse.json({
        message: 'Reseña actualizada con éxito',
        review: updatedReview,
      });
    }    // Crear una nueva reseña
    const newReview = await prisma.reviews.create({
      data: {
        serviceId,
        userId,
        rating,
        comment: comment || null,
      },
    });

    // Obtener información para la notificación
    const serviceWithProvider = await prisma.services.findUnique({
      where: { id: serviceId },
      include: {
        user: true  // Esto obtiene el provider
      }
    });

    const reviewer = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Enviar notificación al proveedor sobre la nueva reseña
    if (serviceWithProvider && serviceWithProvider.user) {
      await createProviderNotification({
        providerId: serviceWithProvider.user.id,
        type: 'REVIEW_NEW',
        title: 'Nueva reseña recibida',
        message: `${reviewer?.name || 'Un usuario'} ha dejado una reseña de ${rating} estrellas para tu servicio "${serviceWithProvider.title}"`,
        relatedId: newReview.id,
        linkPath: `/service-provider/profile`,
        metadata: {
          rating: rating,
          userName: reviewer?.name,
          userImage: reviewer?.image,
          serviceTitle: serviceWithProvider.title
        }
      });
    }

    return NextResponse.json({
      message: 'Reseña creada con éxito',
      review: newReview,
    });

  } catch (error) {
    console.error('Error al crear/actualizar reseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}