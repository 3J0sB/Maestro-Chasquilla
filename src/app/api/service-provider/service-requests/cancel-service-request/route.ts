import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function PUT(req: NextRequest) {
  try {

    
    const body = await req.json();
    const { requestId, cancelReason } = body;
    
    if (!requestId) {
      return NextResponse.json({ error: 'ID de solicitud requerido' }, { status: 400 });
    }
    
    if (!cancelReason || cancelReason.trim() === '') {
      return NextResponse.json({ error: 'Se requiere una razón para cancelar' }, { status: 400 });
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
      },
    });
    
    if (!serviceRequest) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }
    

    // Verificar que la solicitud no esté ya completada o cancelada
    if (['COMPLETED', 'CANCELLED', 'REJECTED'].includes(serviceRequest.status)) {
      return NextResponse.json({ error: 'No se puede cancelar una solicitud que ya está completada, cancelada o rechazada' }, { status: 400 });
    }
    
    // Actualizar el estado de la solicitud
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });
    

    
    return NextResponse.json({
      message: 'Servicio cancelado correctamente',
      request: updatedRequest,
    });
    
  } catch (error) {
    console.error('Error al cancelar el servicio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}