import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { sendServiceAcceptedEmail } from "@/lib/mail";

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
            include: {
                service: {
                    select: {
                        title: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                lastName: true,
                                lastName2: true,
                                email: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        name: true,
                        lastName: true,
                        lastName2: true,
                        email: true,
                    },
                },
            }
        });

        console.log("Service request accepted:", serviceRequest);

        await sendServiceAcceptedEmail(
            serviceRequest.user.email ?? "",
            serviceRequest.user.name ?? "",
            (serviceRequest.service.user.name ?? "") +(" ")+ (serviceRequest.service.user.lastName ?? ""),
            serviceRequest.service.title ?? "",
            serviceRequest.service.user.id ?? ""

        );
        return NextResponse.json(serviceRequest, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error al aceptar la solicitud" }, { status: 500 });
        console.error("Error accepting service request:", error);
    }
}