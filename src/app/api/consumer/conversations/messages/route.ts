import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createProviderNotification } from '@/utils/notifications';

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
        }        // Verificar que la conversación existe
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                user: true,
                provider: true
            }
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
        });        // Actualizar la fecha de la conversación
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        // Solo crear notificación si el mensaje es del usuario al proveedor
        if (senderType === 'USER' && conversation.provider) {
            // Crear notificación para el proveedor
            await createProviderNotification({
                providerId: conversation.providerId,
                type: 'NEW_MESSAGE',
                title: 'Nuevo mensaje recibido',
                message: `${conversation.user.name} te ha enviado un mensaje`,
                relatedId: conversationId,
                linkPath: `/service-provider/messages?conversationId=${conversationId}`,
                metadata: {
                    userName: conversation.user.name,
                    userImage: conversation.user.image,
                    messagePreview: content.length > 50 ? `${content.substring(0, 50)}...` : content
                }
            });
        }

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error('Error al crear mensaje:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}