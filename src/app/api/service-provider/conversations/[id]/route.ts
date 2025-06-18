import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id: providerId } = await params;

    if (!providerId) {
        return NextResponse.json({ error: 'ID de proveedor no proporcionado' }, { status: 400 });
    }

    try {
        const providerConversations = await prisma.conversation.findMany({
            where: {
                providerId: providerId,
                deletedAt: null,
            },
            include: {
                user: {
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
            },orderBy: {
                        createdAt: 'desc',
                    },
        });

        if (!providerConversations) {
            return NextResponse.json({ error: 'No se encontró la conversación' }, { status: 404 });
        }

        return NextResponse.json(providerConversations, { status: 200 });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return NextResponse.json({ error: 'Error al obtener la conversación' }, { status: 500 });
    }
}