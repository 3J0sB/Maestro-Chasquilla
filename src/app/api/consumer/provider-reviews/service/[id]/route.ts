import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Obtener el ID del servicio desde los parámetros de consulta
        const { id: serviceId } = await params;

        // Validar que se proporcionó un ID
        if (!serviceId) {
            return NextResponse.json(
                { error: 'Se requiere el ID del servicio' },
                { status: 400 }
            );
        }

        // Verificar que el servicio existe
        const serviceExists = await prisma.services.findUnique({
            where: { id: serviceId },
        });

        if (!serviceExists) {
            return NextResponse.json(
                { error: 'Servicio no encontrado' },
                { status: 404 }
            );
        }

        // Obtener el servicio con sus reviews
        const serviceWithReviews = await prisma.services.findUnique({
            where: {
                id: serviceId,
            },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                lastName: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc', // Ordenar por fecha de creación, más recientes primero
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!serviceWithReviews) {
            return NextResponse.json(
                { error: 'Servicio no encontrado' },
                { status: 404 }
            );
        }

        // Extraer las reviews del servicio
        const reviews = serviceWithReviews.reviews;

        // Calcular el promedio de calificación
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;

        // Calcular distribución de ratings
        const ratingDistribution = {
            5: reviews.filter(review => review.rating === 5).length,
            4: reviews.filter(review => review.rating === 4).length,
            3: reviews.filter(review => review.rating === 3).length,
            2: reviews.filter(review => review.rating === 2).length,
            1: reviews.filter(review => review.rating === 1).length,
        };

        return NextResponse.json({
            serviceId,
            serviceName: serviceWithReviews.title,
            providerId: serviceWithReviews.userId,
            providerName: `${serviceWithReviews.user.name} ${serviceWithReviews.user.lastName || ''}`.trim(),
            totalReviews,
            averageRating,
            ratingDistribution,
            reviews,
        });

    } catch (error) {
        console.error('Error al obtener reviews:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}