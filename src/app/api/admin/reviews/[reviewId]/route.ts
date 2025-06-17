import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }
    const resolvedParams = await params;
    const reviewId = resolvedParams.reviewId;
    const { status } = await req.json();

    if (!reviewId || !status) {
      return new NextResponse(JSON.stringify({ error: "Se requiere ID de review y estado" }), {
        status: 400,
      });
    }

    // Verificar si la review existe
    const reviewExists = await prisma.reviews.findUnique({
      where: { id: reviewId },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            userId: true,
          }
        }
      }
    });

    if (!reviewExists) {
      return new NextResponse(JSON.stringify({ error: "Review no encontrada" }), {
        status: 404,
      });
    }

    // Actualizar el estado de la review - usando deletedAt como indicador de rechazo
    let updatedReview;
    if (status === 'APPROVED') {
      updatedReview = await prisma.reviews.update({
        where: { id: reviewId },
        data: {
          deletedAt: null,
        },
      });

      // Notificar al proveedor del servicio
      await prisma.notification.create({
        data: {
          title: "Nueva reseña aprobada",
          message: `Se ha aprobado una nueva reseña para tu servicio "${reviewExists.service.title}".`,
          type: "REVIEW_APPROVED",
          linkPath: `/service-provider/service-config?id=${reviewExists.service.id}`,
          providerId: reviewExists.service.userId,
          relatedId: reviewId,
        },
      });
    } else if (status === 'REJECTED') {
      updatedReview = await prisma.reviews.update({
        where: { id: reviewId },
        data: {
          deletedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Review actualizada a estado: ${status}`,
      review: updatedReview
    });

  } catch (error) {
    console.error("Error al actualizar review:", error);
    return new NextResponse(JSON.stringify({ error: "Error al actualizar review" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: {  params: { reviewId: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }
    const resolvedParams = await params;
    const reviewId = resolvedParams.reviewId;

    if (!reviewId) {
      return new NextResponse(JSON.stringify({ error: "Se requiere ID de review" }), {
        status: 400,
      });
    }

    // Verificar si la review existe
    const reviewExists = await prisma.reviews.findUnique({
      where: { id: reviewId },
    });

    if (!reviewExists) {
      return new NextResponse(JSON.stringify({ error: "Review no encontrada" }), {
        status: 404,
      });
    }

    // Eliminar la review permanentemente
    await prisma.reviews.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Review eliminada correctamente" 
    });

  } catch (error) {
    console.error("Error al eliminar review:", error);
    return new NextResponse(JSON.stringify({ error: "Error al eliminar review" }), {
      status: 500,
    });
  }
}
