import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
    const { id, title, description, price, serviceTag, image} = await request.json();
    console.log("Datos recibidos para actualizar el servicio:", {
        id,
        title,
        description,
        price,
        serviceTag,
        image,
    });
    try {
        const updatedService = await prisma.services.update({
            where: { id },
            data: {
                title: title,
                description: description,
                price: price,
                serviceTag: serviceTag,
                image: image
            },
        });
        console.log("Servicio actualizado backend:", updatedService);
        return NextResponse.json(updatedService, { status: 200 });

    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json({ error: "Error al actualizar el servicio" }, { status: 500 });
    }
}