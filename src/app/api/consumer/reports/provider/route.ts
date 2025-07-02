import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { providerId, reason, description, reporterId } = await request.json()

    // Validaciones
    if (!providerId || !reason || !reporterId) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el proveedor existe
    const provider = await prisma.serviceProviderUser.findUnique({
      where: { id: providerId }
    })

    if (!provider) {
      return NextResponse.json(
        { message: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: reporterId }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el usuario no se esté reportando a sí mismo (si tuviera cuenta de ambos tipos)
    if (reporterId === providerId) {
      return NextResponse.json(
        { message: 'No puedes reportarte a ti mismo' },
        { status: 400 }
      )
    }

    // Verificar si ya existe un reporte del mismo usuario para este proveedor
    const existingReport = await prisma.serviceProviderReport.findFirst({
      where: {
        providerId,
        reporterId,
        status: { not: 'dismissed' } // No contar reportes desestimados
      }
    })

    if (existingReport) {
      return NextResponse.json(
        { message: 'Ya has reportado a este proveedor anteriormente' },
        { status: 400 }
      )
    }

    // Crear el reporte
    const report = await prisma.serviceProviderReport.create({
      data: {
        providerId,
        reporterId,
        reason,
        description,
        status: 'pending'
      }
    })

    return NextResponse.json(
      { 
        message: 'Reporte enviado correctamente',
        reportId: report.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error al crear reporte de proveedor:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}