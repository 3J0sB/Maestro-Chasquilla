import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
    const { requestId } = await request.json();
    try {
        const serviceRequest = await prisma.serviceRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: "ACCEPTED",
            },
        });

        console.log("Service request accepted:", serviceRequest);
        return NextResponse.json(serviceRequest, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error al aceptar la solicitud" }, { status: 500 });
    }
}