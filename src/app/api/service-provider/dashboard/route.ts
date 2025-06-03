import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { add, sub, format, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

export async function GET(request: NextRequest) {
  try {



    // Obtener parámetros
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30d';
    const providerId = searchParams.get('providerId');
    console.log('Provider ID:', providerId);
    console.log('Time Range:', timeRange);
    // Calcular fechas según el rango de tiempo
    let startDate: Date;
    const now = new Date();

    switch (timeRange) {
      case '7d':
        startDate = sub(now, { days: 7 });
        break;
      case '90d':
        startDate = sub(now, { days: 90 });
        break;
      case '1y':
        startDate = sub(now, { days: 365 });
        break;
      case '30d':
      default:
        startDate = sub(now, { days: 30 });
        break;
    }



    // 1. Estadísticas básicas
    const totalServices = await prisma.services.count({
      where: {
        userId: providerId ?? undefined,
        deletedAt: null,
      },
    });

    // 2. Solicitudes por estado
    const requestsByStatus = await prisma.serviceRequest.groupBy({
      by: ['status'],
      where: {
        providerId: providerId ?? undefined,
        deletedAt: null,
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
    });

    const pendingRequests = requestsByStatus.find(r => r.status === 'PENDING')?._count?.id || 0;
    const completedRequests = requestsByStatus.find(r => r.status === 'COMPLETED')?._count?.id || 0;

    // 3. Reseñas y calificaciones
    const reviews = await prisma.services.findMany({
      where: {
        userId: providerId ?? undefined,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        reviews: {
          where: {
            deletedAt: null,
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
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Calcular calificación promedio
    let totalRating = 0;
    let totalReviewsCount = 0;
    let allReviews: any[] = [];
    const ratingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(service => {
      service.reviews.forEach(review => {
        totalRating += review.rating;
        totalReviewsCount++;
        ratingsCount[review.rating as 1 | 2 | 3 | 4 | 5] += 1;

        allReviews.push({
          id: review.id,
          serviceId: service.id,
          serviceName: service.title,
          userName: review.user.name || 'Usuario Anónimo',
          userImage: review.user.image,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        });
      });
    });

    const averageRating = totalReviewsCount > 0 ? totalRating / totalReviewsCount : 0;

    // 4. Ingresos estimados
    const completedServiceRequests = await prisma.serviceRequest.findMany({
      where: {
        providerId: providerId ?? undefined,
        status: 'COMPLETED',
        deletedAt: null,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        service: {
          select: {
            price: true,
          },
        },
      },
    });

    const estimatedRevenue = completedServiceRequests.reduce(
      (sum, req) => sum + (req.service.price || 0),
      0
    );

    // 5. Tendencia de solicitudes
    // Generar array de fechas para el período
    const dateRange = [];
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = sub(now, { days: i });
      dateRange.push(format(date, 'yyyy-MM-dd'));
    }

    // Obtener solicitudes por día
    const requestsByDay = await prisma.serviceRequest.groupBy({
      by: ['createdAt'],
      where: {
        providerId: providerId ?? undefined,
        deletedAt: null,
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
    });

    const completedByDay = await prisma.serviceRequest.groupBy({
      by: ['updatedAt'],
      where: {
        providerId: providerId ?? undefined,
        status: 'COMPLETED',
        deletedAt: null,
        updatedAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
    });

    const requestsTrend = dateRange.map(date => {
      const dayRequests = requestsByDay.filter(r =>
        format(new Date(r.createdAt), 'yyyy-MM-dd') === date
      ).reduce((sum, curr) => sum + curr._count.id, 0);

      const dayCompleted = completedByDay.filter(r =>
        format(new Date(r.updatedAt), 'yyyy-MM-dd') === date
      ).reduce((sum, curr) => sum + curr._count.id, 0);

      return {
        date,
        received: dayRequests,
        completed: dayCompleted,
      };
    });

    // 6. Servicios más solicitados
    const topServicesData = await prisma.services.findMany({
      where: {
        userId: providerId ?? undefined,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        serviceRequest: {
          where: {
            createdAt: {
              gte: startDate,
            },
            deletedAt: null,
          },
        },
        reviews: {
          where: {
            deletedAt: null,
          },
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        serviceRequest: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const topServices = topServicesData.map(service => {
      const totalRating = service.reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = service.reviews.length > 0 ? totalRating / service.reviews.length : 0;

      // Calcular una tendencia ficticia para demostración
      const trend = Math.floor(Math.random() * 41) - 20; // -20% a +20%

      return {
        id: service.id,
        title: service.title,
        requestCount: service.serviceRequest.length,
        rating: avgRating,
        trend,
      };
    });

    // 7. Distribución de calificaciones
    const ratingsDistribution = Object.entries(ratingsCount).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
    }));

    // 8. Actividad por día de la semana
    const thisWeekStart = startOfWeek(now);
    const thisWeekEnd = endOfWeek(now);

    const weekdayData = await prisma.$queryRaw`
      SELECT EXTRACT(DOW FROM "createdAt") as day_num, COUNT(*) as count
      FROM "service_request"
      WHERE "provider_id" = ${providerId}
      AND "deleted_at" IS NULL
      GROUP BY day_num
      ORDER BY day_num ASC
    `;

    // Traducir números de días a nombres
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const weeklyActivity = Array.from({ length: 7 }).map((_, index) => {
      const dayData = (weekdayData as any[]).find(d => parseInt(d.day_num) === index);
      return {
        day: dayNames[index],
        count: dayData ? parseInt(dayData.count) : 0,
      };
    });

    // 9. Solicitudes por estado para gráfico de pastel
    const statusColors = {
      PENDING: '#fbbf24', // Amarillo
      ACCEPTED: '#f97316', // Naranja
      IN_PROGRESS: '#3b82f6', // Azul
      COMPLETED: '#22c55e', // Verde
      CANCELLED: '#ef4444', // Rojo
      REJECTED: '#6b7280', // Gris
    };

    const statusTranslations = {
      PENDING: 'Pendientes',
      ACCEPTED: 'Aceptadas',
      IN_PROGRESS: 'En progreso',
      COMPLETED: 'Completadas',
      CANCELLED: 'Canceladas',
      REJECTED: 'Rechazadas',
    };

    const requestsByStatusChart = requestsByStatus.map(item => ({
      name: statusTranslations[item.status as keyof typeof statusTranslations] || item.status,
      value: item._count.id,
      color: statusColors[item.status as keyof typeof statusColors] || '#9ca3af',
    }));


    // Respuesta final
    const dashboardData = {
      stats: {
        totalServices,
        averageRating,
        pendingRequests,
        completedRequests,
        estimatedRevenue,
        totalReviews: totalReviewsCount,
      },
      requestsTrend,
      ratingsDistribution,
      topServices,
      requestsByStatus: requestsByStatusChart,
      weeklyActivity,
      recentReviews: allReviews.slice(0, 5),
    };
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error al generar datos del dashboard:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}