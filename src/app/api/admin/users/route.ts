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

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Obtener todos los proveedores de servicios
    const serviceProviders = await prisma.serviceProviderUser.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Combinar los resultados y mapear el estado basado en deletedAt
    const mappedUsers = [
      ...users.map(user => ({
        ...user,
        status: user.deletedAt ? 'INACTIVE' : 'ACTIVE',
        lastLogin: user.updatedAt, // Usamos updatedAt como aproximación de último login
      })),
      ...serviceProviders.map(provider => ({
        ...provider,
        status: provider.deletedAt ? 'INACTIVE' : 'ACTIVE',
        lastLogin: provider.updatedAt,
      }))
    ];

    return NextResponse.json({ users: mappedUsers });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return new NextResponse(JSON.stringify({ error: "Error al obtener usuarios" }), {
      status: 500,
    });
  }
}
