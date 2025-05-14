import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Necesitamos esperar a que params.id esté disponible
 
  const {id: serviceProviderId } = await params;
  
  if (!serviceProviderId) {
    return NextResponse.json({ error: "ID de proveedor no proporcionado" }, { status: 400 });
  }

  try {
    const services = await prisma.services.findMany({
      where: {
        userId: serviceProviderId,
      }
    });

    if (!services || services.length === 0) {
      return NextResponse.json({ error: "No se encontraron servicios" }, { status: 404 });
    }

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Error al obtener los servicios" }, { status: 500 });
  }
}