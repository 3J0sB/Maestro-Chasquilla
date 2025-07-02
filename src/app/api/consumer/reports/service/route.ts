import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { serviceId, reason, description, reporterId } = await request.json()


    if (!serviceId || !reason || !reporterId) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

  
    const service = await prisma.services.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { message: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: reporterId }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const existingReport = await prisma.serviceReport.findFirst({
      where: {
        serviceId,
        reporterId,
        status: { not: 'dismissed' } 
      }
    })

    if (existingReport) {
      return NextResponse.json(
        { message: 'Ya has reportado este servicio anteriormente' },
        { status: 400 }
      )
    }


    const report = await prisma.serviceReport.create({
      data: {
        serviceId,
        reporterId,
        reason,
        description,
        status: 'pending'
      }
    })

    console.log('Reporte creado:', report)
    return NextResponse.json(
      { 
        message: 'Reporte enviado correctamente',
        reportId: report.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error al crear reporte de servicio:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}