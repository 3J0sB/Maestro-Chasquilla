import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id: serviceProvider } = await params;
    if (!serviceProvider) {
        return NextResponse.json({ error: "ID de solicitud de servicio no proporcionado" }, { status: 400 });
    }
    try {
        const serviceRequest = await prisma.serviceRequest.findMany({
            where: {
                providerId: serviceProvider,
            },
             include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        lastName: true,
                        email: true,
                    }
                },
                service: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        price: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        })
        if (!serviceRequest || serviceRequest.length === 0) {
            return NextResponse.json({ error: "No se encontraron solicitudes de servicio" }, { status: 404 });
        }

        return NextResponse.json(serviceRequest, { status: 200 });
    } catch (error) {
        console.error("Error fetching service requests:", error);
        return NextResponse.json({ error: "Error al obtener las solicitudes de servicio" }, { status: 500 });
    }

}