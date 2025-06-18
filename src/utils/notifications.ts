/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/
// notifications.ts - Utils for managing notifications

import prisma from "@/lib/prisma";

export type NotificationType = 
  | 'REQUEST_NEW' 
  | 'REQUEST_ACCEPTED' 
  | 'REQUEST_DECLINED'
  | 'REQUEST_CANCELLED'
  | 'REQUEST_COMPLETED'
  | 'REQUEST_IN_PROGRESS'
  | 'REVIEW_NEW'
  | 'PAYMENT_RECEIVED'
  | 'SYSTEM_MESSAGE'
  | 'NEW_MESSAGE';

/**
 * Creates a notification for a service provider
 */
export async function createProviderNotification({
  providerId,
  type,
  title,
  message,
  relatedId,
  linkPath,
  metadata = {}
}: {
  providerId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  linkPath?: string;
  metadata?: Record<string, any>;
}) {
  try {
    return await prisma.notification.create({
      data: {
        providerId,
        type,
        title,
        message,
        relatedId,
        linkPath,
        metadata,
      }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * Marks a notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() }
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
}

/**
 * Marks all notifications for a provider as read
 */
export async function markAllNotificationsAsRead(providerId: string) {
  try {
    return await prisma.notification.updateMany({
      where: { 
        providerId,
        readAt: null,
        deletedAt: null
      },
      data: { readAt: new Date() }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return null;
  }
}

/**
 * Soft deletes a notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { deletedAt: new Date() }
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return null;
  }
}
