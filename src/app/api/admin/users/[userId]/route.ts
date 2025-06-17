import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }
    const resolvedParams = await params;
    const userId = await resolvedParams.userId;
    const { status } = await req.json();

    if (!userId || !status) {
      return new NextResponse(JSON.stringify({ error: "Se requiere ID de usuario y estado" }), {
        status: 400,
      });
    }

    // Verificar si es un usuario regular o un proveedor de servicios
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    const providerExists = await prisma.serviceProviderUser.findUnique({
      where: { id: userId },
    });

    if (!userExists && !providerExists) {
      return new NextResponse(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
      });
    }

    // Actualizar según el tipo de usuario y el estado solicitado
    if (userExists) {
      if (status === 'INACTIVE' || status === 'BANNED') {
        // Marcar como inactivo/baneado estableciendo deletedAt
        await prisma.user.update({
          where: { id: userId },
          data: {
            deletedAt: new Date(),
          },
        });
      } else if (status === 'ACTIVE') {
        // Activar usuario eliminando deletedAt
        await prisma.user.update({
          where: { id: userId },
          data: {
            deletedAt: null,
          },
        });
      }
    } else if (providerExists) {
      if (status === 'INACTIVE' || status === 'BANNED') {
        // Marcar como inactivo/baneado estableciendo deletedAt
        await prisma.serviceProviderUser.update({
          where: { id: userId },
          data: {
            deletedAt: new Date(),
          },
        });
      } else if (status === 'ACTIVE') {
        // Activar proveedor eliminando deletedAt
        await prisma.serviceProviderUser.update({
          where: { id: userId },
          data: {
            deletedAt: null,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Usuario actualizado a estado: ${status}`
    });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return new NextResponse(JSON.stringify({ error: "Error al actualizar usuario" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }

    const resolvedParams = await params;
    const userId = await resolvedParams.userId;

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Se requiere ID de usuario" }), {
        status: 400,
      });
    }

    // Verificar si es un usuario regular o un proveedor de servicios
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    const providerExists = await prisma.serviceProviderUser.findUnique({
      where: { id: userId },
    });

    if (!userExists && !providerExists) {
      return new NextResponse(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
      });
    }

    // Eliminar el usuario según su tipo (soft delete)
    if (userExists) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date()
        },
      });
    } else if (providerExists) {
      await prisma.serviceProviderUser.update({
        where: { id: userId },
        data: {
          deletedAt: new Date()
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return new NextResponse(JSON.stringify({ error: "Error al eliminar usuario, puede que tenga relaciones con otros registros" }), {
      status: 500,
    });
  }
}
