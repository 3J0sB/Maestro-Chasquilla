import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: reportId } = await params;

    // Obtener el reporte para acceder al proveedor
    const report = await db.serviceProviderReport.findUnique({
      where: { id: reportId },
      include: { provider: true }
    });

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    // Usar una transacción para actualizar tanto el reporte como el proveedor
    const result = await db.$transaction(async (tx) => {
      // Marcar el proveedor como eliminado (soft delete)
      await tx.serviceProviderUser.update({
        where: { id: report.providerId },
        data: {
          deletedAt: new Date()
        }
      });

      // También marcar todos sus servicios como eliminados
      await tx.services.updateMany({
        where: { 
          userId: report.providerId,
          deletedAt: null // Solo actualizar servicios que no estén ya eliminados
        },
        data: {
          deletedAt: new Date(),
          status: 'REJECTED'
        }
      });

      // Actualizar el estado del reporte
      const updatedReport = await tx.serviceProviderReport.update({
        where: { id: reportId },
        data: {
          status: 'REVIEWED',
          resolvedAt: new Date()
        }
      });

      return updatedReport;
    });

    return NextResponse.json({ 
      message: 'Proveedor desactivado exitosamente',
      report: result 
    });
  } catch (error) {
    console.error('Error deactivating provider:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
