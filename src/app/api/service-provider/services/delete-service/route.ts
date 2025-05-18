import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
    const { id } = await request.json();
    console.log("ID del servicio a eliminar:", id);
    try {
        const deletedService = await prisma.services.delete({
            where: { id },
        });

        console.log("Servicio eliminado backend:", deletedService);
        return NextResponse.json(deletedService, { status: 200 });

    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json({ error: "Error al eliminar el servicio" }, { status: 500 });
    }
}