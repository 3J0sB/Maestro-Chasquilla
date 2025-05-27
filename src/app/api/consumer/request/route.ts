import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {

    const data = await request.json();
    const { message, serviceId, providerId, consumerId } = data; 
    console.log('Datos recibidos:', data);
    
    // Validaciones básicas
    if (!message || !serviceId || !providerId || !consumerId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    // Verificar que el servicio existe
    const service = await prisma.services.findUnique({
      where: { id: serviceId }
    });
    
    if (!service) {
      return NextResponse.json(
        { error: 'El servicio no existe' },
        { status: 404 }
      );
    }
    
    // Verificar que el proveedor existe
    const provider = await prisma.serviceProviderUser.findUnique({
      where: { id: providerId }
    });
    
    if (!provider) {
      return NextResponse.json(
        { error: 'El proveedor no existe' },
        { status: 404 }
      );
    }
    
    // Crear la solicitud de servicio
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        message,
        status: 'PENDING', // Estado inicial
        consumerId,
        providerId,
        serviceId,
      },
    });
    
    return NextResponse.json({
      message: 'Solicitud enviada con éxito',
      serviceRequest
    });
    
  } catch (error) {
    console.error('Error al crear solicitud de servicio:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}