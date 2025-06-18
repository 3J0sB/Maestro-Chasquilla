import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: userId } = await params;
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario actual es el dueño del perfil
    if (session.user.id !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_INFO_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: userId } = await params;
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que el usuario actual es el dueño del perfil
    if (session.user.id !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    
    // Validar los campos recibidos
    const { name, lastName, email, image } = body;

    if (!name || !lastName || !email) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verificar si el correo ya está en uso por otro usuario
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (existingUser && existingUser.id !== userId) {
        return new NextResponse("Email already in use", { status: 400 });
      }
    }

    // Actualizar el usuario
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        lastName,
        email,
        image: image || null,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_INFO_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}