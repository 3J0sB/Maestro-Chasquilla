import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";


export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/service-provider/notifications');
    const session = await auth();
    if (!session?.user || session.user.role !== 'SERVICE_PROVIDER') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const providerId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const onlyUnread = searchParams.get('unread') === 'true';

    const notifications = await prisma.notification.findMany({
      where: {
        providerId,
        ...(onlyUnread ? { readAt: null } : {}),
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        providerId,
        readAt: null,
        deletedAt: null,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('[NOTIFICATIONS_GET]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
