import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { conversationId, content, senderId, senderType } = body;

        // Validar los datos requeridos
        if (!conversationId || !content || !senderId || !senderType) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos para crear el mensaje' },
                { status: 400 }
            );
        }

        // Verificar que la conversación existe
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'La conversación no existe' },
                { status: 404 }
            );
        }

        // Verificar que el remitente es parte de la conversación
        if (senderType === 'USER' && conversation.userId !== senderId) {
            return NextResponse.json(
                { error: 'No tienes permiso para enviar mensajes en esta conversación' },
                { status: 403 }
            );
        }

        // Crear el nuevo mensaje
        const newMessage = await prisma.messages.create({
            data: {
                conversationId,
                senderId,
                senderType,
                content,
                isRead: false,
                userId: senderId, // Para mensajes de usuario
            },
        });

        // Actualizar la fecha de la conversación
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error('Error al crear mensaje:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}