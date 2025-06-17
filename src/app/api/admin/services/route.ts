import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }

    // Obtener todos los servicios
    const services = await prisma.services.findMany({
      select: {
        id: true,
        title: true,
        smallDescription: true,
        description: true,
        price: true,
        minServicePrice: true,
        maxServicePrice: true,
        status: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    return new NextResponse(JSON.stringify({ error: "Error al obtener servicios" }), {
      status: 500,
    });
  }
}
