import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const providerReports = await db.serviceProviderReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: {
            id: true,
            email: true
          }
        },
        provider: {
          select: {
            id: true,
            email: true,
            name: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json({ reports: providerReports });
  } catch (error) {
    console.error('Error fetching provider reports:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
