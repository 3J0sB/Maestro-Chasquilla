import { PrismaClient, Role } from '../src/generated/prisma'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()
async function main() {
  const ServiceProviderUser = await prisma.serviceProviderUser.create({
    data: {
      rut: '11111111-9',
      email: 'service@test.com',
      hashedPassword: await bcrypt.hash('1234', 10),
      name: 'Service provider User',
      lastName: 'service provider',
      lastName2: 'service provider',

    },
  })

  console.log(`[SEED] ---> Created SERVICE PROVIDER user with id: ${ServiceProviderUser.id}`)

  const ServiceProviderUserLocation = await prisma.location.create({
    data: {
      address: '123 Main St',
      city: 'Talca',
      region: 'Maule',
      country: 'Chile',
      latitude: -33.4489,
      longitude: -70.6693,
      serviceProvider: {
        connect: { id: ServiceProviderUser.id }
      },
    },
  })

  console.log(`[SEED] ---> Created location for SERVICE PROVIDER with id: ${ServiceProviderUserLocation.id}`)

  const ConsumerUser = await prisma.user.create({
    data: {
      email: 'consumer@test.com',
      rut: '22222222-9',
      hashedPassword: await bcrypt.hash('1234', 10),
      name: 'Consumer User',
      lastName: 'Consumer User',
      lastName2: 'Consumer User ',
      role: 'USER',
    },
  })
  console.log(`[SEED] ---> Created CONSUMER user with id: ${ConsumerUser.id}`)

  const ConsumerUser2 = await prisma.user.create({
    data: {
      email: 'consumer2@test.com',
      rut: '22222221-9',
      hashedPassword: await bcrypt.hash('1234', 10),
      name: 'Consumer User2',
      lastName: 'Consumer User2',
      lastName2: 'Consumer User2 ',
      role: 'USER',
    },
  })

  console.log(`[SEED] ---> Created CONSUMER user with id: ${ConsumerUser2.id}`)



  const AdminUser = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      rut: '33333333-9',
      hashedPassword: await bcrypt.hash('1234', 10),
      name: 'Admin User',
      lastName: 'Admin User',
      lastName2: 'Admin User ',
      role: 'ADMIN',
    },
  })

  console.log(`[SEED] ---> Created ADMIN user with id: ${AdminUser.id}`)


  const serviceTest = await prisma.services.create({
    data: {
      title: 'Test Service',
      price: 100,
      description: 'This is a test service',
      userId: ServiceProviderUser.id,
      serviceTag: 'Test Tag1',
      serviceTag2: 'Test Tag2',
      serviceTag3: 'Test Tag3',
    }
  })

  console.log(`[SEED] ---> Created ServiceTest with id: ${serviceTest.id}`)


  const review = await prisma.reviews.create({

    data: {
      rating: 5,
      comment: 'This is a test review',
      serviceId: serviceTest.id,
      userId: ConsumerUser.id,
    }
  })

  console.log(`[SEED] ---> Created Review with id: ${review.id}`)

  const review2 = await prisma.reviews.create({
    data: {
      rating: 4,
      comment: 'This is a test review number 2',
      serviceId: serviceTest.id,
      userId: ConsumerUser2.id,
    }
  })

  console.log(`[SEED] ---> Created Review with id: ${review2.id}`)

  const serviceTest2 = await prisma.services.create({
    data: {
      title: 'Test Service2',
      price: 500,
      minServicePrice: 50,
      maxServicePrice: 1000,
      description: 'This is a test service',
      userId: ServiceProviderUser.id,
      serviceTag: 'Test Tag1',
      serviceTag2: 'Test Tag2',
      serviceTag3: 'Test Tag3',
    }
  })
  console.log(`[SEED] ---> Created ServiceTest2 with id: ${serviceTest2.id}`)

  const serviceTest3 = await prisma.services.create({
    data: {
      title: 'Test Service3',
      price: 500,
      minServicePrice: 50,
      maxServicePrice: 1000,
      description: 'This is a test service',
      userId: ServiceProviderUser.id,
      serviceTag: 'Test Tag1',
      serviceTag2: 'Test Tag2',
      serviceTag3: 'Test Tag3',
    }
  })
  console.log(`[SEED] ---> Created ServiceTest2 with id: ${serviceTest3.id}`)


  const serviceRequestTest = await prisma.serviceRequest.create({
    data: {
      consumerId: ConsumerUser.id,
      serviceId: serviceTest.id,
      providerId: ServiceProviderUser.id,
      status: 'PENDING',
      message: 'This is a test service request number 1',
    }
  })
  console.log(`[SEED] ---> Created Service request test with id: ${serviceRequestTest.id}`)

  const serviceRequestTest2 = await prisma.serviceRequest.create({
    data: {
      consumerId: ConsumerUser.id,
      serviceId: serviceTest2.id,
      providerId: ServiceProviderUser.id,
      status: 'PENDING',
      message: 'This is a test service request number 2',
    }
  })
  console.log(`[SEED] ---> Created Service request test with id: ${serviceRequestTest2.id}`)

  const serviceRequestTest3 = await prisma.serviceRequest.create({
    data: {
      consumerId: ConsumerUser.id,
      serviceId: serviceTest3.id,
      providerId: ServiceProviderUser.id,
      status: 'PENDING',
      message: 'This is a test service request number 3',
    }
  })
  // console.table(serviceRequestTest)
  console.log(`[SEED] ---> Created Service request test with id: ${serviceRequestTest3.id}`)


  const category = await prisma.categories.createMany({
    data: [
      { name: 'Hogar y mantenimiento' },
      { name: 'Confección y moda' },
      { name: 'Automotrices' },
      { name: 'Creativos y personalizados' },
      { name: 'Alimentos y catering' },
      { name: 'Servicios personales y de bienestar ' },
      { name: 'Educación y apoyo escolar' },
      { name: 'Artesanías y productos hechos a mano' },
      { name: 'Servicios técnicos y digitales' },
    ]
  })

  console.log(`[SEED] ---> Created: ${category.count} categories`)

// Código existente hasta línea 183
// ...

  console.log(`[SEED] ---> Created Service request test with id: ${serviceRequestTest3.id}`)

  // Agregar más usuarios consumidores
  console.log("[SEED] ---> Creando usuarios consumidores adicionales...")
  
  const additionalConsumers = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `consumer${i+2}@test.com`,
        rut: `1234567${i}-${i}`,
        hashedPassword: await bcrypt.hash('1234', 10),
        name: `Usuario ${i}`,
        lastName: `Apellido ${i}`,
        lastName2: `Segundo ${i}`,
        role: 'USER',
      }
    });
    additionalConsumers.push(user);
    console.log(`[SEED] ---> Creado usuario consumidor con id: ${user.id}`);
  }

  // Crear ubicaciones para algunos consumidores
  for (let i = 0; i < 5; i++) {
    const location = await prisma.location.create({
      data: {
        address: `Calle ${i+1} #${i*100}`,
        city: ['Santiago', 'Valparaíso', 'Concepción', 'Temuco', 'La Serena'][i % 5],
        region: ['Metropolitana', 'Valparaíso', 'Biobío', 'Araucanía', 'Coquimbo'][i % 5],
        country: 'Chile',
        latitude: -33.4489 + (Math.random() * 2 - 1),
        longitude: -70.6693 + (Math.random() * 2 - 1),
        user: {
          connect: { id: additionalConsumers[i].id }
        },
      },
    });
    console.log(`[SEED] ---> Creada ubicación para consumidor con id: ${location.id}`);
  }

  // Crear más servicios para tener variedad
  const serviceNames = [
    'Plomería General', 
    'Electricidad Domiciliaria', 
    'Carpintería a Medida', 
    'Reparación de Techos', 
    'Pintura Interior',
    'Instalación de Pisos',
    'Jardinería y Paisajismo',
    'Limpieza Profunda',
    'Reparación de Electrodomésticos',
    'Instalación de Aire Acondicionado'
  ];
  
  const serviceTags = [
    'Hogar y mantenimiento', 'Confección y moda', 'Automotrices', 'Creativos y personalizados', 'Alimentos y catering',
    'Servicios personales y de bienestar', 'Educación y apoyo escolar', 'Artesanías y productos hechos a mano', 'Servicios técnicos y digitales', 
  ];

  console.log("[SEED] ---> Creando servicios adicionales...");
  const additionalServices = [];
  
  for (let i = 0; i < 10; i++) {
    const service = await prisma.services.create({
      data: {
        title: serviceNames[i],
        price: Math.floor(Math.random() * 50000) + 10000,
        minServicePrice: Math.floor(Math.random() * 5000) + 5000,
        maxServicePrice: Math.floor(Math.random() * 100000) + 50000,
        description: `Servicio profesional de ${serviceNames[i].toLowerCase()} con garantía de satisfacción. Presupuesto sin compromiso.`,
        userId: ServiceProviderUser.id,
        serviceTag: serviceTags[Math.floor(Math.random() * serviceTags.length)],
        serviceTag2: serviceTags[Math.floor(Math.random() * serviceTags.length)],
        serviceTag3: serviceTags[Math.floor(Math.random() * serviceTags.length)],
      }
    });
    additionalServices.push(service);
    console.log(`[SEED] ---> Creado servicio con id: ${service.id}`);
  }

  // Crear solicitudes de servicio con diferentes estados y fechas en el último año
  console.log("[SEED] ---> Creando solicitudes de servicio con diferentes estados y fechas...");
  
  const allServices = [serviceTest, serviceTest2, serviceTest3, ...additionalServices];
  const allUsers = [ConsumerUser, ConsumerUser2, ...additionalConsumers];
  
  const statusOptions = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'];
  
  // Generar fechas en el último año
  const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1); // Un año atrás
  
  // Crear 100 solicitudes de servicio distribuidas en el último año con diferentes estados
  for (let i = 0; i < 100; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const randomService = allServices[Math.floor(Math.random() * allServices.length)];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const randomDate = getRandomDate(startDate, endDate);
    
    // Para solicitudes completadas, rechazadas o canceladas, aseguramos que la fecha de actualización sea posterior a la creación
    let updatedAt = null;
    if (['COMPLETED', 'CANCELLED', 'REJECTED'].includes(randomStatus)) {
      const minDelay = 1000 * 60 * 60; // 1 hora mínimo
      const maxDelay = 1000 * 60 * 60 * 24 * 14; // Máximo 14 días
      const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
      updatedAt = new Date(randomDate.getTime() + delay);
      
      // Si la fecha de actualización es posterior a la fecha actual, ajustarla
      if (updatedAt > endDate) {
        updatedAt = endDate;
      }
    }
    
    try {
      const request = await prisma.serviceRequest.create({
        data: {
          consumerId: randomUser.id,
          serviceId: randomService.id,
          providerId: ServiceProviderUser.id,
          status: randomStatus,
          message: `Solicitud de ${randomService.title}. Necesito este servicio con urgencia.`,
          createdAt: randomDate,
          ...(updatedAt && { updatedAt })
        }
      });
      
      console.log(`[SEED] ---> Creada solicitud ${i+1}/100 con id: ${request.id}, estado: ${randomStatus}, fecha: ${randomDate.toISOString()}`);
      
      // Para solicitudes completadas, agregar una reseña en algunos casos (70% de probabilidad)
      if (randomStatus === 'COMPLETED' && Math.random() < 0.7) {
        const reviewDate = new Date(updatedAt!.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 72)); // 0-72 horas después
        
        // Si la fecha de reseña es posterior a la fecha actual, ajustarla
        const actualReviewDate = reviewDate > endDate ? endDate : reviewDate;
        
        const rating = Math.floor(Math.random() * 5) + 1; // Rating 1-5
        
        const review = await prisma.reviews.create({
          data: {
            rating,
            comment: rating >= 4 
              ? `Excelente servicio, muy satisfecho con el trabajo realizado.` 
              : rating >= 3 
                ? `Servicio aceptable, aunque podrían mejorar en algunos aspectos.`
                : `Servicio por debajo de mis expectativas, necesitan mejorar.`,
            serviceId: randomService.id,
            userId: randomUser.id,
            createdAt: actualReviewDate
          }
        });
        
        console.log(`[SEED] ---> Creada reseña para solicitud completada, rating: ${rating}, id: ${review.id}`);
      }
    } catch (error) {
      console.error(`Error al crear solicitud ${i+1}:`, error);
    }
  }

  console.log("[SEED] ---> Proceso de seed completado con éxito!");

// Código existente desde aquí hasta el final
// ...

  const conversation = await prisma.conversation.create({
    data: {
      userId: ConsumerUser.id,
      providerId: ServiceProviderUser.id,
    },
  });
  console.log(`[SEED] ---> Created Conversation with id: ${conversation.id}`);


  const message1 = await prisma.messages.create({
    data: {
      conversationId: conversation.id,
      senderId: ConsumerUser.id,
      senderType: "USER",
      content: "Hola, me gustaría saber más detalles sobre el servicio que ofreces para reparación de cañerías.",
      isRead: true,
      userId: ConsumerUser.id,
    },
  });
  console.log(`[SEED] ---> Created Message from Consumer with id: ${message1.id}`);


  const message2 = await prisma.messages.create({
    data: {
      conversationId: conversation.id,
      senderId: ServiceProviderUser.id,
      senderType: "SERVICE_PROVIDER",
      content: "¡Hola! Claro, ofrezco servicios de reparación de cañerías con garantía de 6 meses. ¿Qué problema específico tienes?",
      isRead: true,
      providerId: ServiceProviderUser.id,
    },
  });
  console.log(`[SEED] ---> Created Message from Provider with id: ${message2.id}`);


  const message3 = await prisma.messages.create({
    data: {
      conversationId: conversation.id,
      senderId: ConsumerUser.id,
      senderType: "USER",
      content: "Tengo una filtración debajo del lavaplatos. ¿Podrías venir mañana a revisarla?",
      isRead: true,
      userId: ConsumerUser.id,
    },
  });
  console.log(`[SEED] ---> Created Message from Consumer with id: ${message3.id}`);


  const message4 = await prisma.messages.create({
    data: {
      conversationId: conversation.id,
      senderId: ServiceProviderUser.id,
      senderType: "SERVICE_PROVIDER",
      content: "Puedo ir mañana por la tarde, entre 15:00 y 17:00. ¿Te parece bien? Necesitaría la dirección exacta.",
      isRead: false, // No leído aún
      providerId: ServiceProviderUser.id,
    },
  });
  console.log(`[SEED] ---> Created Message from Provider with id: ${message4.id}`);


  const conversation2 = await prisma.conversation.create({
    data: {
      userId: ConsumerUser2.id,
      providerId: ServiceProviderUser.id,
    },
  });
  console.log(`[SEED] ---> Created Conversation with id: ${conversation2.id}`);


  const message5 = await prisma.messages.create({
    data: {
      conversationId: conversation2.id,
      senderId: ConsumerUser2.id,
      senderType: "USER",
      content: "Hola, estoy interesado en el servicio de instalación eléctrica para mi nueva casa.",
      isRead: true,
      userId: ConsumerUser2.id,
    },
  });
  console.log(`[SEED] ---> Created Message from Consumer2 with id: ${message5.id}`);


  const message6 = await prisma.messages.create({
    data: {
      conversationId: conversation2.id,
      senderId: ServiceProviderUser.id,
      senderType: "SERVICE_PROVIDER",
      content: "Buenas tardes, gracias por contactarme. Ofrezco instalaciones eléctricas completas y certificadas. ¿Cuántos metros cuadrados tiene tu casa?",
      isRead: false,
      providerId: ServiceProviderUser.id,
    },
  });
  console.log(`[SEED] ---> Created Message from Provider with id: ${message6.id}`);

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
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })