import prisma from '@/lib/prisma';

/**
 * Script para generar notificaciones de prueba
 * 
 * Ejecutar con: npx ts-node seed-notifications.ts
 */
async function main() {
  // Primero, obtén un proveedor de servicios
  const provider = await prisma.serviceProviderUser.findFirst({
    where: {
      role: 'SERVICE_PROVIDER',
    },
  });

  if (!provider) {
    console.error('No se encontró ningún proveedor de servicios');
    return;
  }

  console.log(`Generando notificaciones para el proveedor: ${provider.name} ${provider.lastName}`);

  // Generar varios tipos de notificaciones
  const notificationTypes = [
    {
      type: 'REQUEST_NEW',
      title: 'Nueva solicitud de servicio',
      message: 'Juan Pérez ha solicitado tu servicio "Reparación de tuberías"',
      linkPath: '/service-provider/request?id=test-id-1',
    },
    {
      type: 'REVIEW_NEW',
      title: 'Nueva reseña recibida',
      message: 'María González ha dejado una reseña de 5 estrellas para tu servicio "Instalación eléctrica"',
      linkPath: '/service-provider/profile',
    },
    {
      type: 'REQUEST_CANCELLED',
      title: 'Solicitud de servicio cancelada',
      message: 'Carlos Rodríguez ha cancelado la solicitud para tu servicio "Reparación de goteras"',
      linkPath: '/service-provider/request?id=test-id-3',
    },
    {
      type: 'NEW_MESSAGE',
      title: 'Nuevo mensaje recibido',
      message: 'Ana Martínez te ha enviado un nuevo mensaje',
      linkPath: '/service-provider/messages?conversation=test-conv-1',
    },
    {
      type: 'REQUEST_COMPLETED',
      title: 'Servicio completado',
      message: 'Luis Torres ha marcado como completado tu servicio "Pintura de interiores"',
      linkPath: '/service-provider/request?id=test-id-5',
    }
  ];

  // Crear notificaciones con diferentes fechas
  const now = new Date();

  // Notificaciones leídas (más antiguas)
  const readNotifications = await Promise.all(
    notificationTypes.map(async (notification, index) => {
      const createdAt = new Date(now);
      createdAt.setDate(now.getDate() - (index + 5)); // 5-10 días atrás
      
      const readAt = new Date(createdAt);
      readAt.setHours(createdAt.getHours() + 2); // Leída 2 horas después
      
      return prisma.notification.create({
        data: {
          providerId: provider.id,
          type: notification.type,
          title: notification.title + ' (Leída)',
          message: notification.message,
          linkPath: notification.linkPath,
          createdAt,
          readAt,
          metadata: { demo: true },
        }
      });
    })
  );

  console.log(`Creadas ${readNotifications.length} notificaciones leídas`);

  // Notificaciones no leídas (más recientes)
  const unreadNotifications = await Promise.all(
    notificationTypes.map(async (notification, index) => {
      const createdAt = new Date(now);
      createdAt.setDate(now.getDate() - index); // 0-4 días atrás
      
      return prisma.notification.create({
        data: {
          providerId: provider.id,
          type: notification.type,
          title: notification.title + ' (No leída)',
          message: notification.message,
          linkPath: notification.linkPath,
          createdAt,
          metadata: { demo: true },
        }
      });
    })
  );

  console.log(`Creadas ${unreadNotifications.length} notificaciones no leídas`);
  console.log(`Total: ${readNotifications.length + unreadNotifications.length} notificaciones creadas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
