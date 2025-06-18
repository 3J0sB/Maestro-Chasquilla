import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Obtener el ID del proveedor desde los parámetros de consulta
        const { id: providerId } = await params;

        // Validar que se proporcionó un ID
        if (!providerId) {
            return NextResponse.json(
                { error: 'Se requiere el ID del proveedor' },
                { status: 400 }
            );
        }

        // Verificar que el proveedor existe
        const providerExists = await prisma.serviceProviderUser.findUnique({
            where: { id: providerId },
        });

        if (!providerExists) {
            return NextResponse.json(
                { error: 'Proveedor no encontrado' },
                { status: 404 }
            );
        }

        // Obtener todos los servicios del proveedor con sus reviews
        const servicesWithReviews = await prisma.services.findMany({
            where: {
                userId: providerId,
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
                },
            },
        });

        // Extraer todas las reviews de todos los servicios
        const allReviews = servicesWithReviews.flatMap(service =>
            service.reviews.map(review => ({
                ...review,
                serviceName: service.title,
                serviceId: service.id
            }))
        );

        // Calcular el promedio de calificación
        const totalReviews = allReviews.length;
        const averageRating = totalReviews > 0
            ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;

        // Calcular distribucion de ratings
        const ratingDistribution = {
            5: allReviews.filter(review => review.rating === 5).length,
            4: allReviews.filter(review => review.rating === 4).length,
            3: allReviews.filter(review => review.rating === 3).length,
            2: allReviews.filter(review => review.rating === 2).length,
            1: allReviews.filter(review => review.rating === 1).length,
        };

        return NextResponse.json({
            providerId,
            totalReviews,
            averageRating,
            ratingDistribution,
            reviews: allReviews,
        });

    } catch (error) {
        console.error('Error al obtener reviews:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}