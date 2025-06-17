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

    // Contar usuarios regulares
    const usersCount = await prisma.user.count({
      where: { 
        deletedAt: null,
        role: 'USER'
      }
    });

    // Contar proveedores de servicios
    const serviceProvidersCount = await prisma.serviceProviderUser.count({
      where: { deletedAt: null }
    });

    // Contar administradores
    const adminsCount = await prisma.user.count({
      where: { 
        deletedAt: null,
        role: 'ADMIN'
      }
    });

    // Contar servicios pendientes de aprobación (usando status como filtro)
    const pendingServicesCount = await prisma.services.count({
      where: { 
        status: 'PENDING', 
        deletedAt: null 
      }
    });

    // Contar reseñas (asumiendo que no tienen un campo de aprobación, mostramos todas)
    const reviewsCount = await prisma.reviews.count({
      where: { deletedAt: null }
    });

    // Contar categorías
    const categoriesCount = await prisma.categories.count();

    // Obtener servicios pendientes recientes para mostrar en el dashboard
    const recentPendingServices = await prisma.services.findMany({
      where: { 
        status: 'PENDING',
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Obtener reseñas recientes
    const recentReviews = await prisma.reviews.findMany({
      where: { 
        deletedAt: null
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            image: true
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
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return NextResponse.json({
      stats: {
        usersCount,
        serviceProvidersCount,
        adminsCount,
        pendingServicesCount,
        reviewsCount,
        categoriesCount,
        totalUsers: usersCount + serviceProvidersCount + adminsCount
      },
      recentPendingServices,
      recentReviews
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return new NextResponse(JSON.stringify({ error: "Error al obtener estadísticas del dashboard" }), {
      status: 500,
    });
  }
}
