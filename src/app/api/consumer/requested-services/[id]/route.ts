import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id: consumerId } = await params;
    try {
        if (!consumerId) {
            return NextResponse.json({ error: "ID de consumidor no proporcionado" }, { status: 400 });
        }

        const requestedServices = await prisma.serviceRequest.findMany({
            where: {
                consumerId: consumerId,
            },
            include: {
                service: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                lastName: true,
                                lastName2: true,
                                rut: true,
                                email: true,
                                image: true,
                                areasOfExpertise: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        })

        if (!requestedServices || requestedServices.length === 0) {
            return NextResponse.json({ messsage: "No se encontraron servicios solicitados" }, { status: 200 });
        }

        return NextResponse.json(requestedServices, { status: 200 });
    } catch (error) {
        console.error("Error fetching requested services:", error);
        return NextResponse.json({ error: "Error al obtener los servicios solicitados" }, { status: 500 });
    }

}