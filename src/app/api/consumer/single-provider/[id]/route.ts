import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: serviceProviderId } = await params;
    console.log("Service Provider ID:", serviceProviderId);

    if (!serviceProviderId) {
        return NextResponse.json({ error: "ID de proveedor no proporcionado" }, { status: 400 });
    }

    try {
        const serviceProvider = await prisma.serviceProviderUser.findUnique({
            where: {
                id: serviceProviderId,
            },
            include: {
                services: {
                    include: {
                        reviews: true,
                    },
                },
                location: true, // Incluye la ubicación del proveedor

            }
        })
        if (!serviceProvider) {
            return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });
        }

        return NextResponse.json(serviceProvider, { status: 200 });
    } catch (error) {
        console.error("Error fetching service provider:", error);
        return NextResponse.json({ error: "Error al obtener el proveedor de servicio" }, { status: 500 });
    }



}