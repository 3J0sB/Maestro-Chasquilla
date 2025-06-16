import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * PUT /api/service-provider/notifications/mark-as-read
 * 
 * Marks one or all notifications as read
 * Body params:
 * - notificationId: ID of specific notification to mark as read (optional)
 * - allNotifications: if true, marks all notifications as read (optional)
 * 
 * One of notificationId or allNotifications must be provided
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'SERVICE_PROVIDER') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, allNotifications } = body;
    const providerId = session.user.id;

    if (allNotifications) {
      await prisma.notification.updateMany({
        where: {
          providerId,
          readAt: null,
          deletedAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });
    } else if (notificationId) {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          providerId,
          deletedAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });
    } else {
      return NextResponse.json({ error: 'Se requiere notificationId o allNotifications' }, { status: 400 });
    }
    console.log(`[NOTIFICATIONS_MARK_READ] Provider ${providerId} marked notifications as read`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NOTIFICATIONS_MARK_READ]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
