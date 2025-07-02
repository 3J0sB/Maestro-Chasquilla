import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const reportId = params.id;

    // Obtener el reporte para acceder al servicio
    const report = await db.serviceReport.findUnique({
      where: { id: reportId },
      include: { service: true }
    });

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    // Usar una transacción para actualizar tanto el reporte como el servicio
    const result = await db.$transaction(async (tx) => {
      // Marcar el servicio como eliminado (soft delete)
      await tx.services.update({
        where: { id: report.serviceId },
        data: {
          deletedAt: new Date(),
          status: 'REJECTED'
        }
      });

      // Actualizar el estado del reporte
      const updatedReport = await tx.serviceReport.update({
        where: { id: reportId },
        data: {
          status: 'REVIEWED',
          resolvedAt: new Date()
        }
      });

      return updatedReport;
    });

    return NextResponse.json({ 
      message: 'Servicio rechazado exitosamente',
      report: result 
    });
  } catch (error) {
    console.error('Error rejecting service:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
