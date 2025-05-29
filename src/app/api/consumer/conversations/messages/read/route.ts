import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { conversationId, userId } = body;

        // Validar los datos requeridos
        if (!conversationId || !userId) {
            return NextResponse.json(
                { error: 'Se requiere el ID de la conversación y del usuario' },
                { status: 400 }
            );
        }

        // Verificar que la conversación existe y que el usuario tiene acceso a ella
        const conversation = await prisma.conversation.findUnique({
            where: { 
                id: conversationId,
                userId: userId,
            },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversación no encontrada o no tienes permiso para acceder' },
                { status: 404 }
            );
        }

        // Marcar como leídos todos los mensajes del proveedor en esta conversación
        const result = await prisma.messages.updateMany({
            where: {
                conversationId: conversationId,
                senderType: 'SERVICE_PROVIDER', // Solo mensajes enviados por el proveedor
                isRead: false,                  // Solo mensajes no leídos
            },
            data: {
                isRead: true,
                updatedAt: new Date(),
            }
        });

        return NextResponse.json({ 
            success: true, 
            messagesMarkedAsRead: result.count 
        });
    } catch (error) {
        console.error('Error al marcar mensajes como leídos:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}