import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, userId } = body;

    // Validar datos requeridos
    if (!providerId || !userId) {
      return NextResponse.json(
        { error: 'Se requieren el ID del proveedor y el ID del usuario' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una conversación entre este usuario y proveedor
    let conversation = await prisma.conversation.findFirst({
      where: {
        providerId: providerId,
        userId: userId,
        deletedAt: null,
      },
    });

    // Si no existe, crear una nueva conversación
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          providerId: providerId,
          userId: userId,
        },
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error al crear/obtener conversación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}