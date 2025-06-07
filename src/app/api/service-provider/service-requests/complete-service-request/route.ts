import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function PUT(req: NextRequest) {
  try {

    
    const body = await req.json();
    const { requestId } = body;
    
    if (!requestId) {
      return NextResponse.json({ error: 'ID de solicitud requerido' }, { status: 400 });
    }
    
    // Verificar la solicitud
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        service: {
          select: {
            userId: true,
            title: true,
          },
        },
        user: {
          select: {
            name: true,
            lastName: true,
          }
        }
      },
    });
    
    if (!serviceRequest) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }
    

    
    // Verificar que la solicitud esté en estado IN_PROGRESS
    if (serviceRequest.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'La solicitud debe estar en progreso para completarla' }, { status: 400 });
    }
    
    // Actualizar el estado de la solicitud
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date(),

      },
    });
    
    // Crear notificación para el cliente
    
    return NextResponse.json({
      message: 'Servicio completado correctamente',
      request: updatedRequest,
    });
    
  } catch (error) {
    console.error('Error al completar el servicio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}