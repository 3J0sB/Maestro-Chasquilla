import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Obtener el ID del servicio desde los parámetros de ruta
        const { id: serviceId } = await params;

        // Obtener el ID del usuario desde los parámetros de consulta
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        // Validar que se proporcionaron ambos IDs
        if (!serviceId) {
            return NextResponse.json(
                { error: 'Se requiere el ID del servicio' },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'Se requiere el ID del usuario' },
                { status: 400 }
            );
        }

        // Buscar si existe alguna solicitud del usuario para este servicio
        const existingRequest = await prisma.serviceRequest.findFirst({
            where: {
                serviceId: serviceId,
                consumerId: userId,
                status: { in: ['PENDING', 'ACCEPTED', 'COMPLETED'] },
                deletedAt: null, 
            },
        });

        // Devolver true si existe una solicitud, false en caso contrario
        return NextResponse.json({
            hasRequested: !!existingRequest,
            // Opcionalmente, puedes incluir más información
            requestInfo: existingRequest ? {
                id: existingRequest.id,
                status: existingRequest.status,
                createdAt: existingRequest.createdAt
            } : null
        });

    } catch (error) {
        console.error('Error al verificar solicitud:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}