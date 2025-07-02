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

    const {id: reportId }= await params;

    const updatedReport = await db.serviceProviderReport.update({
      where: { id: reportId },
      data: {
        status: 'DISMISSED',
        resolvedAt: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'Reporte desestimado exitosamente',
      report: updatedReport 
    });
  } catch (error) {
    console.error('Error dismissing provider report:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
