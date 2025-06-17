import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }

    // Obtener todas las reseñas con información adicional
    const reviews = await prisma.reviews.findMany({
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            image: true,
          }
        },
        service: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mapear las reseñas y agregar un campo de estado basado en deletedAt
    const mappedReviews = reviews.map(review => ({
      ...review,
      status: review.deletedAt ? 'REJECTED' : 'APPROVED'
    }));

    return NextResponse.json({ reviews: mappedReviews });
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    return new NextResponse(JSON.stringify({ error: "Error al obtener reseñas" }), {
      status: 500,
    });
  }
}
