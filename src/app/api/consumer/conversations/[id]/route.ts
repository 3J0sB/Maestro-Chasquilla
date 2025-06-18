import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: userId } = await params;

    if (!userId) {
        return NextResponse.json({ error: 'ID de usuario no proporcionado' }, { status: 400 });
    }

    try {
        const userConversations = await prisma.conversation.findMany({
            where: {
                userId: userId,
                deletedAt: null,
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        lastName: true,
                        image: true,
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    where: {
                        deletedAt: null,
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        if (!userConversations || userConversations.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(userConversations, { status: 200 });
    } catch (error) {
        console.error('Error al obtener conversaciones:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}