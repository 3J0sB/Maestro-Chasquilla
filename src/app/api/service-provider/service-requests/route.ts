import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request: NextRequest) {
    try {
        const serviceRequests = await prisma.serviceRequest.findMany({
            where: {
                status: "PENDING",
            },
            include:{
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
            }
        })


        if (!serviceRequests || serviceRequests.length === 0) {
            return NextResponse.json({ error: "No se encontraron solicitudes de servicio" }, { status: 404 });
        }
        return NextResponse.json(serviceRequests, { status: 200 });
    } catch (error) {
        
    }
}