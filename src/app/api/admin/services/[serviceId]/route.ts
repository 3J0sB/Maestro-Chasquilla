/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }

    const resolvedParams = await params;
    const serviceId = resolvedParams.serviceId;
    const { status } = await req.json();

    if (!serviceId || !status) {
      return new NextResponse(JSON.stringify({ error: "Se requiere ID de servicio y estado" }), {
        status: 400,
      });
    }

    // Verificar si el servicio existe
    const serviceExists = await prisma.services.findUnique({
      where: { id: serviceId },
    });

    if (!serviceExists) {
      return new NextResponse(JSON.stringify({ error: "Servicio no encontrado" }), {
        status: 404,
      });
    }

    // Actualizar el estado del servicio
    const updatedService = await prisma.services.update({
      where: { id: serviceId },
      data: {
        status: status,
      },
    });

    // Si el servicio es aprobado, enviar una notificación al proveedor
    if (status === 'APPROVED') {
      await prisma.notification.create({
        data: {
          title: "Servicio aprobado",
          message: `Tu servicio "${serviceExists.title}" ha sido aprobado y ya es visible para los usuarios.`,
          type: "SERVICE_APPROVED",
          linkPath: "/service-provider/service-config",
          providerId: serviceExists.userId,
          relatedId: serviceId,
        },
      });
    }
    // Si el servicio es rechazado, enviar una notificación al proveedor
    else if (status === 'REJECTED') {
      await prisma.notification.create({
        data: {
          title: "Servicio rechazado",
          message: `Tu servicio "${serviceExists.title}" ha sido rechazado. Por favor, revisa los requisitos y vuelve a intentarlo.`,
          type: "SERVICE_REJECTED",
          linkPath: "/service-provider/service-config",
          providerId: serviceExists.userId,
          relatedId: serviceId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Servicio actualizado a estado: ${status}`,
      service: updatedService
    });

  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    return new NextResponse(JSON.stringify({ error: "Error al actualizar servicio" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }

    const resolvedParams = await params;
    const serviceId = resolvedParams.serviceId;
    const { status } = await req.json();

    if (!serviceId) {
      return new NextResponse(JSON.stringify({ error: "Se requiere ID de servicio" }), {
        status: 400,
      });
    }

    const serviceExists = await prisma.services.findUnique({
      where: { id: serviceId },
    });

    if (!serviceExists) {
      return new NextResponse(JSON.stringify({ error: "Servicio no encontrado" }), {
        status: 404,
      });
    }

    const deletedService = await prisma.services.update({
      where: { id: serviceId },
      data: {
        status: status || 'DELETED',
      },
    });

    // Notificar al proveedor
    await prisma.notification.create({
      data: {
        title: "Servicio eliminado",
        message: `Tu servicio "${serviceExists.title}" ha sido eliminado por un administrador.`,
        type: "SERVICE_DELETED",
        linkPath: "/service-provider/service-config",
        providerId: serviceExists.userId,
        relatedId: serviceId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Servicio eliminado correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    return new NextResponse(JSON.stringify({ error: "Error al eliminar servicio, puede que tenga relaciones con otros registros" }), {
      status: 500,
    });
  }
}