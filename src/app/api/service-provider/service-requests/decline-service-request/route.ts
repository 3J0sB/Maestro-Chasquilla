import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createProviderNotification } from "@/utils/notifications";

export async function PUT(request: NextRequest) {
    const { requestId } = await request.json();
    try {
        const serviceRequest = await prisma.serviceRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: "REJECTED",
            },
            include: {
                service: true,
                user: true,
                provider: true
            }
        });

        // Crear notificación para el proveedor
        await createProviderNotification({
            providerId: serviceRequest.providerId,
            type: 'REQUEST_DECLINED',
            title: 'Solicitud rechazada',
            message: `Has rechazado la solicitud de ${serviceRequest.user.name} para tu servicio "${serviceRequest.service.title}"`,
            relatedId: serviceRequest.id,
            linkPath: `/service-provider/request?id=${serviceRequest.id}`,
            metadata: {
                userName: serviceRequest.user.name,
                userImage: serviceRequest.user.image,
                serviceTitle: serviceRequest.service.title
            }
        });

        console.log("Service request declined:", serviceRequest);
        return NextResponse.json(serviceRequest, { status: 200 });
    } catch (error) {
        console.error("Error al rechazar la solicitud:", error);
        return NextResponse.json({ error: "Error al rechazar la solicitud" }, { status: 500 });
    }
}